# INFO-I101 Day 4 helpers

.pretty_label <- function(x) tools::toTitleCase(gsub("_", " ", x))
.column_name <- function(expr, data) {
  name <- deparse(expr)
  if (!name %in% names(data)) stop(paste("Column not found:", name))
  name
}

.group_names <- function(expr, data) {
  if (is.call(expr) && identical(expr[[1]], as.name("c"))) {
    columns <- as.list(expr)[-1]
  } else {
    columns <- list(expr)
  }
  
  vapply(columns, .column_name, character(1), data = data)
}


join_by <- function(data1, data2, x) {
  xn <- .column_name(substitute(x), data1)
  
  if (!xn %in% names(data2)) {
    stop(paste("Column not found in second dataset:", xn))
  }
  
  result <- merge(data1, data2, by = xn, all.x = TRUE)
  
  result
}


filter_rows <- function(data, condition) {
  condition <- substitute(condition)
  keep <- eval(condition, envir = data, enclos = parent.frame())
  if (!is.logical(keep) || length(keep) != nrow(data)) stop("Filtering condition needs one TRUE/FALSE per row.")
  data[!is.na(keep) & keep, , drop = FALSE]
}

count_by <- function(data, x) {
  xn <- .group_names(substitute(x), data)
  result <- aggregate(
    rep(1, nrow(data)),
    by = data[xn],
    FUN = length
  )
  
  names(result)[ncol(result)] <- "count"
  result
}

total_by <- function(data, x, y) {
  xn <- .group_names(substitute(x), data)
  yn <- .group_names(substitute(y), data)
  
  aggregate(data[yn],
            by = data[xn],
            FUN = sum)
}

average_by <- function(data, x, y) {
  xn <- .group_names(substitute(x), data)
  yn <- .group_names(substitute(y), data)
  
  aggregate(data[yn],
            by = data[xn],
            FUN = mean,
            na.rm = TRUE)
}


bar_graph <- function(data, x, y, group = NULL) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  
  options(scipen = 999)
  
  if (missing(group)) {
    # Regular bar graph
    heights <- setNames(data[[yn]], as.character(data[[xn]]))
    
    barplot(heights,
            col = "#3cc8e1", border = NA, las = 1,
            xlab = .pretty_label(xn), ylab = .pretty_label(yn),
            main = paste(.pretty_label(yn), "by", .pretty_label(xn)),
            ylim = c(0, max(heights, na.rm = TRUE) * 1.1),
            yaxs = "i")
    
  } else {
    # Clustered bar graph
    gn <- .column_name(substitute(group), data)
    
    heights <- xtabs(
      as.formula(paste(yn, "~", gn, "+", xn)),
      data = data
    )
    
    colors <- c("#3cc8e1", "#1155cc", "#cf2f7b",
                "#8fd400", "#f0ad4e")
    
    barplot(heights,
            beside = TRUE,
            col = rep(colors, length.out = nrow(heights)),
            border = NA, las = 1,
            xlab = .pretty_label(xn), ylab = .pretty_label(yn),
            main = paste(.pretty_label(yn), "by", .pretty_label(xn),
                         "and", .pretty_label(gn)),
            ylim = c(0, max(heights, na.rm = TRUE) * 1.15),
            yaxs = "i",
            legend.text = rownames(heights),
            args.legend = list(x = "topright", bty = "n"))
  }
  
  box(bty = "l")
}



scatter_plot <- function(data, x, y, group = NULL) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  
  options(scipen = 999)
  
  if (missing(group)) {
    # Regular scatterplot
    colors <- grDevices::adjustcolor("#1155cc", alpha.f = .35)
    
  } else {
    # Color points by group
    gn <- .column_name(substitute(group), data)
    groups <- factor(data[[gn]])
    
    palette <- c("#1155cc", "#cf2f7b", "#8fd400",
                 "#3cc8e1", "#f0ad4e")
    
    group_colors <- rep(palette, length.out = nlevels(groups))
    colors <- grDevices::adjustcolor(
      group_colors[as.integer(groups)],
      alpha.f = .55
    )
  }
  
  plot(data[[xn]], data[[yn]],
       pch = 19, cex = .65,
       col = colors,
       xlab = .pretty_label(xn),
       ylab = .pretty_label(yn),
       main = paste(.pretty_label(yn), "by", .pretty_label(xn)))
  
  abline(
    lm(reformulate(xn, response = yn), data = data),
    col = "magenta",
    lwd = 3
  )
  
  if (!missing(group)) {
    legend("topright",
           legend = levels(groups),
           col = group_colors,
           pch = 19,
           bty = "n")
    

  }
}


line_graph <- function(data, x, y, group = NULL) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  
  # Put dates/months in chronological order
  x_values <- data[[xn]]
  
  # Convert YYYY-MM strings to dates when needed
  if (is.character(x_values) &&
      all(grepl("^\\d{4}-\\d{2}$", x_values[!is.na(x_values)]))) {
    x_values <- as.Date(paste0(x_values, "-01"))
  }
  
  # Sort observations by x-axis values
  order_rows <- order(x_values)
  data <- data[order_rows, , drop = FALSE]
  x_values <- x_values[order_rows]
  
  # Set up the graph
  plot(x_values, data[[yn]],
       type = "n",
       xlab = .pretty_label(xn),
       ylab = .pretty_label(yn),
       main = paste(.pretty_label(yn), "over", .pretty_label(xn)),
       ylim = c(0, max(data[[yn]], na.rm = TRUE) * 1.1),
       yaxs = "i")
  
  if (missing(group)) {
    
    # One line
    lines(x_values, data[[yn]],
          col = "#1155cc", lwd = 2.5)
    
  } else {
    
    # Separate line for each group
    gn <- .column_name(substitute(group), data)
    groups <- factor(data[[gn]])
    
    colors <- c("#1155cc", "#cf2f7b", "#3cc8e1",
                "#8fd400", "#f0ad4e")
    
    group_colors <- rep(colors, length.out = nlevels(groups))
    
    for (i in seq_along(levels(groups))) {
      selected <- groups == levels(groups)[i]
      
      lines(x_values[selected], data[[yn]][selected],
            col = group_colors[i], lwd = 2.5)
    }
    
    legend("topright",
           legend = levels(groups),
           col = group_colors,
           lwd = 2.5,
           bty = "n")
  }
  
  box(bty = "l")
}



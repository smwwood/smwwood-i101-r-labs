# INFO-I101 Day 3 helpers

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

filter_rows <- function(data, condition) {
  condition <- substitute(condition)
  keep <- eval(condition, envir = data, enclos = parent.frame())
  if (!is.logical(keep) || length(keep) != nrow(data)) stop("Filtering condition needs one TRUE/FALSE per row.")
  data[!is.na(keep) & keep, , drop = FALSE]
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
       main = "Look for a pattern")
  
  if (!missing(group)) {
    legend("topright",
           legend = levels(groups),
           col = group_colors,
           pch = 19,
           bty = "n")
  }
}


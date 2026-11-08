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


join_by <- function(data1, data2, by) {
  xn <- .column_name(substitute(by), data1)
  
  if (!xn %in% names(data2)) {
    stop(paste("Column not found in second dataset:", xn))
  }
  
  result <- merge(data1, data2, by = xn, all.by = TRUE)
  
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


# Homework-specific adaptations; other lab helpers retained.
.graph_args <- function(defaults, overrides) {
  if (length(overrides) && (is.null(names(overrides)) || any(names(overrides) == "")))
    stop("Please name customization arguments, such as col = 'teal'.")
  for (name in names(overrides)) defaults[name] <- overrides[name]
  defaults
}
.anchored_range <- function(values) {
  values <- values[is.finite(values)]
  if (!length(values)) stop("No numerical values to graph.")
  limits <- range(c(0, values))
  if (diff(limits) == 0) limits <- c(0, 1)
  c(if (limits[1] < 0) limits[1] * 1.1 else 0,
    if (limits[2] > 0) limits[2] * 1.1 else 0)
}
bar_graph <- function(data, x, y, group = NULL, ...) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  opts <- list(...)
  horizontal <- isTRUE(opts$horiz)
  if (missing(group)) {
    heights <- setNames(data[[yn]], as.character(data[[xn]]))
    defaults <- list(height = heights, col = "#3cc8e1", border = NA, las = 1,
      main = paste(.pretty_label(yn), "by", .pretty_label(xn)))
  } else {
    gn <- .column_name(substitute(group), data)
    heights <- xtabs(reformulate(c(gn, xn), response = yn), data = data)
    defaults <- list(height = heights, beside = TRUE,
      col = rep(c("#3cc8e1", "#1155cc", "#cf2f7b", "#8fd400", "#f0ad4e"), length.out = nrow(heights)),
      border = NA, las = 1, main = paste(.pretty_label(yn), "by", .pretty_label(xn), "and", .pretty_label(gn)),
      legend.text = rownames(heights), args.legend = list(x = "topright", bty = "n"))
  }
  defaults$xlab <- .pretty_label(if (horizontal) yn else xn)
  defaults$ylab <- .pretty_label(if (horizontal) xn else yn)
  defaults[[if (horizontal) "xlim" else "ylim"]] <- .anchored_range(heights)
  defaults[[if (horizontal) "xaxs" else "yaxs"]] <- "i"
  do.call(barplot, .graph_args(defaults, opts))
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


line_graph <- function(data, x, y, group = NULL, ...) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  xv <- data[[xn]]
  if (is.character(xv) && all(grepl("^\\d{4}-\\d{2}$", xv[!is.na(xv)])))
    xv <- as.Date(paste0(xv, "-01"))
  rows <- order(xv)
  data <- data[rows, , drop = FALSE]
  xv <- xv[rows]
  opts <- list(...)
  defaults <- list(x = xv, y = data[[yn]], type = "l", col = "#1155cc", lwd = 2.5,
    xlab = .pretty_label(xn), ylab = .pretty_label(yn),
    main = paste(.pretty_label(yn), "over", .pretty_label(xn)),
    ylim = .anchored_range(data[[yn]]), yaxs = "i")
  # Real x values are preserved, including gaps after unrated episodes are removed.
  if (missing(group)) {
    do.call(plot, .graph_args(defaults, opts))
  } else {
    gn <- .column_name(substitute(group), data)
    groups <- factor(data[[gn]])
    colors <- rep(c("#1155cc", "#cf2f7b", "#3cc8e1", "#8fd400", "#f0ad4e"), length.out = nlevels(groups))
    setup <- .graph_args(defaults, opts)
    setup$type <- "n"
    do.call(plot, setup)
    drawing <- opts[intersect(names(opts), c("type", "col", "lwd", "lty", "pch", "cex"))]
    for (i in seq_along(levels(groups))) {
      selected <- !is.na(groups) & groups == levels(groups)[i]
      do.call(lines, .graph_args(list(x = xv[selected], y = data[[yn]][selected],
        type = "l", col = colors[i], lwd = 2.5), drawing))
    }
    legend("topright", legend = levels(groups), col = if (is.null(opts$col)) colors else opts$col,
      lwd = if (is.null(opts$lwd)) 2.5 else opts$lwd, bty = "n")
  }
  box(bty = "l")
}

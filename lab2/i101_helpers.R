# INFO-I101 Day 2 helpers: data first, then columns/conditions.
# Bare column names are captured by substitute() and evaluated in the data frame.
.pretty_label <- function(x) tools::toTitleCase(gsub("_", " ", x))
.column_name <- function(expr, data) {
  name <- deparse(expr)
  if (!name %in% names(data)) stop(paste("Column not found:", name))
  name
}
filter_rows <- function(data, condition) {
  condition <- substitute(condition)
  keep <- eval(condition, envir = data, enclos = parent.frame())
  if (!is.logical(keep) || length(keep) != nrow(data)) stop("Filtering condition needs one TRUE/FALSE per row.")
  data[!is.na(keep) & keep, , drop = FALSE]
}
total_by <- function(data, x, y) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  out <- aggregate(data[[yn]], by = setNames(list(data[[xn]]), xn), FUN = sum)
  names(out) <- c(xn, yn)
  out
}
average_by <- function(data, x, y) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  out <- aggregate(data[[yn]], 
                   by = setNames(list(data[[xn]]), xn), 
                   FUN = mean,
                   na.rm = TRUE)
  names(out) <- c(xn, yn)
  out
}

bar_graph <- function(data, x, y) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  
  options(scipen = 999)
  
  barplot(setNames(data[[yn]], as.character(data[[xn]])),
          col = "#3cc8e1", border = NA, las = 1,
          xlab = .pretty_label(xn), ylab = .pretty_label(yn),
          main = paste(.pretty_label(yn), "by", .pretty_label(xn)),
          ylim = c(0, max(data[[yn]], na.rm = TRUE) * 1.1),
          yaxs = "i")
  
  box(bty = "l")
}
scatter_plot <- function(data, x, y) {
  xn <- .column_name(substitute(x), data)
  yn <- .column_name(substitute(y), data)
  plot(data[[xn]], data[[yn]], pch=19, cex=.55,
       col=grDevices::adjustcolor("#1155cc", alpha.f=.35),
       xlab=.pretty_label(xn), ylab=.pretty_label(yn), main="Look for a pattern")
}

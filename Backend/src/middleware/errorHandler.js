export function notFoundHandler(req, res, next) {
  res.status(404).json({
    status: 404,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function globalErrorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Avoid leaking database internal errors to clients in production
  const isDev = process.env.NODE_ENV === "development";
  res.status(statusCode).json({
    status: statusCode,
    message: statusCode === 500 && !isDev 
      ? "An unexpected internal server error occurred." 
      : err.message || "Internal Server Error",
    ...(isDev && { stack: err.stack }),
  });
}

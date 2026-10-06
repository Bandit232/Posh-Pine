function notFound(req, res, next) {
  res.status(404);
  res.json({ success: false, error: "Not Found" });
}

function errorHandler(err, req, res, next) {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  const payload = {
    success: false,
    error: err.message || "Server Error",
  };
  if (process.env.NODE_ENV === "development") payload.stack = err.stack;
  // Log server-side
  /* eslint-disable no-console */
  console.error(err);
  /* eslint-enable no-console */
  res.json(payload);
}

module.exports = { notFound, errorHandler };

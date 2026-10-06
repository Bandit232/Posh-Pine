function success(res, data = null, message = "OK", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

function error(res, message = "Error", status = 400, details = null) {
  const payload = { success: false, error: message };
  if (process.env.NODE_ENV === "development" && details)
    payload.details = details;
  return res.status(status).json(payload);
}

function validationErrors(res, errors = [], status = 422) {
  return res.status(status).json({ success: false, errors });
}

module.exports = { success, error, validationErrors };

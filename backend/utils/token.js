const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = { id: user._id };
  if (user.role) payload.role = user.role;
  const expiresIn = process.env.JWT_EXPIRES || "7d";
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function sendToken(res, user, opts = {}) {
  const token = generateToken(user);
  const maxAge =
    parseInt(process.env.JWT_COOKIE_AGE || String(7 * 24 * 60 * 60), 10) * 1000; // ms
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge,
  };
  if (opts.domain) cookieOptions.domain = opts.domain;
  res.cookie("token", token, cookieOptions);
  return token;
}

module.exports = { generateToken, verifyToken, sendToken };

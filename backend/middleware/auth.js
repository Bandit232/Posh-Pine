const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401);
      return next(new Error("Not authorized, token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      res.status(401);
      return next(new Error("Not authorized, user not found"));
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    next(err);
  }
}

function admin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  res.status(403);
  next(new Error("Require admin role"));
}

module.exports = { protect, admin };

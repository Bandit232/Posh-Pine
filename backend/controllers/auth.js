const User = require("../models/User");
const { sendToken } = require("../utils/token");
const { success } = require("../utils/response");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400);
      return next(new Error("Email already in use"));
    }

    const user = await User.create({ name, email, password });
    sendToken(res, user);
    return success(res, { user: user.toJSON() }, "User registered", 201);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      res.status(400);
      return next(new Error("Invalid credentials"));
    }
    const match = await user.comparePassword(password);
    if (!match) {
      res.status(400);
      return next(new Error("Invalid credentials"));
    }
    sendToken(res, user);
    return success(res, { user: user.toJSON() }, "Logged in", 200);
  } catch (err) {
    next(err);
  }
}

async function adminLogin(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: String(username || "").trim().toLowerCase() }).select("+password");
    if (!user || !user.password || user.role !== "admin") {
      res.status(400);
      return next(new Error("Invalid admin credentials"));
    }
    const match = await user.comparePassword(password);
    if (!match) {
      res.status(400);
      return next(new Error("Invalid admin credentials"));
    }
    sendToken(res, user);
    return success(res, { user: user.toJSON() }, "Admin logged in", 200);
  } catch (err) {
    next(err);
  }
}

function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
  return success(res, null, "Logged out", 200);
}

async function getProfile(req, res, next) {
  try {
    if (!req.user) {
      res.status(401);
      return next(new Error("Not authenticated"));
    }
    return success(res, { user: req.user.toJSON() }, "Profile");
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = req.user;
    if (!user) {
      res.status(401);
      return next(new Error("Not authenticated"));
    }
    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
    // refresh cookie token
    sendToken(res, user);
    return success(res, { user: user.toJSON() }, "Profile updated", 200);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, adminLogin, logout, getProfile, updateProfile };

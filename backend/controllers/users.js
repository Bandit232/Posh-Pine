const User = require("../models/User");
const { success } = require("../utils/response");

async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-password");
    return success(res, { users }, "Users list");
  } catch (err) {
    next(err);
  }
}

async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    return success(res, { user }, "User");
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    const { name, email, role } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    return success(res, { user: user.toJSON() }, "User updated");
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      return next(new Error("User not found"));
    }
    await user.remove();
    return success(res, null, "User deleted");
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, getUser, updateUser, deleteUser };

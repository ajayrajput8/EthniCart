const express = require("express");

const {
  signup,
  login,
  getUsers,
  editUser,
  changePassword,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/", /*protect,*/ getUsers);

router.put("/edit", protect, editUser);

router.put("/change-password", protect, changePassword);

module.exports = router;
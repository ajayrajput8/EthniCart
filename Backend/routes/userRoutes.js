const express = require("express");

const {
  signup,
  login,
  getUsers,
  editUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/", /*protect,*/ getUsers);

router.put("/edit", protect, editUser);

module.exports = router;
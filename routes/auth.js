const express = require("express");
const { body } = require("express-validator");
const { authenticateToken } = require("../middleware/auth");
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} = require("../controllers/authController");

const router = express.Router();

// Register new user
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
  ],
  register
);

// Login user
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  login
);

// Get current user profile
router.get("/profile", authenticateToken, getProfile);

// Update user profile
router.put(
  "/profile",
  authenticateToken,
  [
    body("firstName").optional().trim().notEmpty(),
    body("lastName").optional().trim().notEmpty(),
  ],
  updateProfile
);

// Change password
router.post(
  "/change-password",
  authenticateToken,
  [
    body("currentPassword").notEmpty(),
    body("newPassword").isLength({ min: 6 }),
  ],
  changePassword
);

// Logout
router.post("/logout", authenticateToken, logout);

module.exports = router;

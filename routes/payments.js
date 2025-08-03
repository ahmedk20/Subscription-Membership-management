const express = require("express");
const { body } = require("express-validator");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
  getAllPayments,
  getUserPayments,
  getPaymentById,
  processPayment,
  refundPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Get all payments (Admin only)
router.get("/admin/all", authenticateToken, requireAdmin, getAllPayments);

// Get user's payments
router.get("/my", authenticateToken, getUserPayments);

// Get payment by ID
router.get("/:id", authenticateToken, getPaymentById);

// Process payment
router.post(
  "/process",
  authenticateToken,
  [
    body("subscriptionId")
      .notEmpty()
      .withMessage("Subscription ID is required"),
    body("amount")
      .isFloat({ min: 0.01 })
      .withMessage("Amount must be a positive number"),
  ],
  processPayment
);

// Refund payment
router.post("/:id/refund", authenticateToken, refundPayment);

module.exports = router;

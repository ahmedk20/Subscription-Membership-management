const express = require("express");
const { body } = require("express-validator");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
  getAllSubscriptions,
  getUserSubscriptions,
  getSubscriptionById,
  createSubscription,
  cancelSubscription,
  reactivateSubscription,
} = require("../controllers/subscriptionController");

const router = express.Router();

// Get all subscriptions (Admin only)
router.get("/admin/all", authenticateToken, requireAdmin, getAllSubscriptions);

// Get user's subscriptions
router.get("/my", authenticateToken, getUserSubscriptions);

// Get subscription by ID
router.get("/:id", authenticateToken, getSubscriptionById);

// Create new subscription
router.post(
  "/",
  authenticateToken,
  [body("planId").notEmpty().withMessage("Plan ID is required")],
  createSubscription
);

// Cancel subscription
router.post("/:id/cancel", authenticateToken, cancelSubscription);

// Reactivate subscription
router.post("/:id/reactivate", authenticateToken, reactivateSubscription);

module.exports = router;

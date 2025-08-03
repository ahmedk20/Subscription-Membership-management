const { validationResult } = require("express-validator");
const Payment = require("../models/Payment");
const Subscription = require("../models/Subscription");

// Get all payments (Admin only)
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "firstName lastName email")
      .populate("subscription")
      .sort({ createdAt: -1 });

    res.json({
      message: "All payments retrieved successfully",
      payments,
    });
  } catch (error) {
    console.error("Payments retrieval error:", error);
    res.status(500).json({ error: "Payments retrieval failed" });
  }
};

// Get user's payments
const getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate("subscription")
      .sort({ createdAt: -1 });

    res.json({
      message: "User payments retrieved successfully",
      payments,
    });
  } catch (error) {
    console.error("User payments retrieval error:", error);
    res.status(500).json({ error: "Payments retrieval failed" });
  }
};

// Get payment by ID
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("subscription");

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Check if user owns this payment or is admin
    if (
      payment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      message: "Payment retrieved successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment retrieval error:", error);
    res.status(500).json({ error: "Payment retrieval failed" });
  }
};

// Process payment
const processPayment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { subscriptionId, amount, paymentMethod, description } = req.body;

    // Check if subscription exists and belongs to user
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Create payment record
    const payment = new Payment({
      user: req.user._id,
      subscription: subscriptionId,
      amount,
      currency: subscription.currency,
      status: "completed", // Simplified - assume payment succeeds
      paymentMethod: paymentMethod || "card",
      description: description || `Payment for subscription`,
      processedAt: new Date(),
      paymentGatewayId: "pg_" + Math.random().toString(36).substr(2, 9),
    });

    await payment.save();
    await payment.populate("subscription");

    res.status(201).json({
      message: "Payment processed successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Check if user owns this payment or is admin
    if (
      payment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    if (payment.status !== "completed") {
      return res
        .status(400)
        .json({ error: "Payment must be completed to refund" });
    }

    await payment.refund(amount);

    res.json({
      message: "Payment refunded successfully",
      payment,
    });
  } catch (error) {
    console.error("Payment refund error:", error);
    res.status(500).json({ error: "Payment refund failed" });
  }
};

module.exports = {
  getAllPayments,
  getUserPayments,
  getPaymentById,
  processPayment,
  refundPayment,
};

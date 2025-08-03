const { validationResult } = require("express-validator");
const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");

// Get all subscriptions (Admin only)
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find()
      .populate("plan")
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({
      message: "All subscriptions retrieved successfully",
      subscriptions,
    });
  } catch (error) {
    console.error("Subscriptions retrieval error:", error);
    res.status(500).json({ error: "Subscriptions retrieval failed" });
  }
};

// Get user's subscriptions
const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate("plan")
      .sort({ createdAt: -1 });

    res.json({
      message: "User subscriptions retrieved successfully",
      subscriptions,
    });
  } catch (error) {
    console.error("User subscriptions retrieval error:", error);
    res.status(500).json({ error: "Subscriptions retrieval failed" });
  }
};

// Get subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate("plan")
      .populate("user", "firstName lastName email");

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Check if user owns this subscription or is admin
    if (
      subscription.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      message: "Subscription retrieved successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription retrieval error:", error);
    res.status(500).json({ error: "Subscription retrieval failed" });
  }
};

// Create new subscription
const createSubscription = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { planId } = req.body;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan || !plan.isActive) {
      return res.status(404).json({ error: "Plan not found or inactive" });
    }

    // Check if user already has an active subscription
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      status: "active",
    });

    if (existingSubscription) {
      return res
        .status(400)
        .json({ error: "User already has an active subscription" });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
    const nextBillingDate = new Date(endDate);

    // Create subscription
    const subscription = new Subscription({
      user: req.user._id,
      plan: planId,
      status: "active",
      startDate,
      endDate,
      nextBillingDate,
      amount: plan.price,
      currency: plan.currency,
      paymentMethod: "card",
    });

    await subscription.save();
    await subscription.populate("plan");

    res.status(201).json({
      message: "Subscription created successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    res.status(500).json({ error: "Subscription creation failed" });
  }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Check if user owns this subscription or is admin
    if (
      subscription.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    await subscription.cancel("User requested cancellation");

    res.json({
      message: "Subscription cancelled successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription cancellation error:", error);
    res.status(500).json({ error: "Subscription cancellation failed" });
  }
};

// Reactivate subscription
const reactivateSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    // Check if user owns this subscription or is admin
    if (
      subscription.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    await subscription.reactivate();

    res.json({
      message: "Subscription reactivated successfully",
      subscription,
    });
  } catch (error) {
    console.error("Subscription reactivation error:", error);
    res.status(500).json({ error: "Subscription reactivation failed" });
  }
};

module.exports = {
  getAllSubscriptions,
  getUserSubscriptions,
  getSubscriptionById,
  createSubscription,
  cancelSubscription,
  reactivateSubscription,
};

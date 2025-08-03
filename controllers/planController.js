const { validationResult } = require("express-validator");
const Plan = require("../models/Plan");

// Get all plans
const getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({
      sortOrder: 1,
      price: 1,
    });
    res.json({
      message: "Plans retrieved successfully",
      plans,
    });
  } catch (error) {
    console.error("Plans retrieval error:", error);
    res.status(500).json({ error: "Plans retrieval failed" });
  }
};

// Get plan by ID
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    res.json({
      message: "Plan retrieved successfully",
      plan,
    });
  } catch (error) {
    console.error("Plan retrieval error:", error);
    res.status(500).json({ error: "Plan retrieval failed" });
  }
};

// Create new plan (Admin only)
const createPlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      price,
      currency,
      billingCycle,
      maxUsers,
      features,
      trialDays,
    } = req.body;

    const plan = new Plan({
      name,
      description,
      price,
      currency: currency || "USD",
      billingCycle,
      maxUsers: maxUsers || 1,
      features: features || [],
      trialDays: trialDays || 0,
      isActive: true,
      sortOrder: 0,
    });

    await plan.save();

    res.status(201).json({
      message: "Plan created successfully",
      plan,
    });
  } catch (error) {
    console.error("Plan creation error:", error);
    res.status(500).json({ error: "Plan creation failed" });
  }
};

// Update plan (Admin only)
const updatePlan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    const {
      name,
      description,
      price,
      currency,
      billingCycle,
      maxUsers,
      features,
      trialDays,
      isActive,
    } = req.body;

    if (name) plan.name = name;
    if (description) plan.description = description;
    if (price !== undefined) plan.price = price;
    if (currency) plan.currency = currency;
    if (billingCycle) plan.billingCycle = billingCycle;
    if (maxUsers !== undefined) plan.maxUsers = maxUsers;
    if (features) plan.features = features;
    if (trialDays !== undefined) plan.trialDays = trialDays;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();

    res.json({
      message: "Plan updated successfully",
      plan,
    });
  } catch (error) {
    console.error("Plan update error:", error);
    res.status(500).json({ error: "Plan update failed" });
  }
};

// Delete plan (Admin only)
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    await plan.remove();

    res.json({
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Plan deletion error:", error);
    res.status(500).json({ error: "Plan deletion failed" });
  }
};

module.exports = {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
};

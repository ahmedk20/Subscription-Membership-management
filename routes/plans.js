const express = require("express");
const { body } = require("express-validator");
const { authenticateToken, requireAdmin } = require("../middleware/auth");
const {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} = require("../controllers/planController");

const router = express.Router();

// Get all plans
router.get("/", getAllPlans);

// Get plan by ID
router.get("/:id", getPlanById);

// Create new plan (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
    body("billingCycle")
      .isIn(["monthly", "yearly"])
      .withMessage("Billing cycle must be monthly or yearly"),
  ],
  createPlan
);

// Update plan (Admin only)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  [
    body("name").optional().notEmpty().withMessage("Name cannot be empty"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number"),
  ],
  updatePlan
);

// Delete plan (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, deletePlan);

module.exports = router;

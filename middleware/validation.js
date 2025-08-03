const { body, param, query, validationResult } = require("express-validator");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Please check your input data",
      details: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  next();
};

// Validation rules for user registration
const validateUserRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  handleValidationErrors,
];

// Validation rules for user login
const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Validation rules for plan creation
const validatePlanCreation = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Plan name must be between 3 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("currency")
    .optional()
    .isIn(["USD", "EUR", "GBP"])
    .withMessage("Currency must be USD, EUR, or GBP"),
  body("billingCycle")
    .isIn(["monthly", "quarterly", "yearly"])
    .withMessage("Billing cycle must be monthly, quarterly, or yearly"),
  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),
  body("features.*.name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Feature name must be between 1 and 100 characters"),
  body("maxUsers")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Max users must be a positive integer"),
  body("trialDays")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Trial days must be a non-negative integer"),
  handleValidationErrors,
];

// Validation rules for subscription creation
const validateSubscriptionCreation = [
  body("planId").isMongoId().withMessage("Please provide a valid plan ID"),
  body("paymentMethod")
    .isIn(["credit_card", "paypal", "bank_transfer"])
    .withMessage(
      "Payment method must be credit_card, paypal, or bank_transfer"
    ),
  handleValidationErrors,
];

// Validation rules for payment processing
const validatePaymentProcessing = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("currency")
    .optional()
    .isIn(["USD", "EUR", "GBP"])
    .withMessage("Currency must be USD, EUR, or GBP"),
  body("paymentMethod")
    .isIn(["credit_card", "paypal", "bank_transfer"])
    .withMessage(
      "Payment method must be credit_card, paypal, or bank_transfer"
    ),
  handleValidationErrors,
];

// Validation rules for object IDs
const validateObjectId = [
  param("id").isMongoId().withMessage("Please provide a valid ID"),
  handleValidationErrors,
];

// Validation rules for pagination
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Page must be between 1 and 1000"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  handleValidationErrors,
];

// Validation rules for date ranges (prevents NoSQL injection)
const validateDateRange = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  handleValidationErrors,
];

// Validation rules for status filters
const validateStatusFilter = [
  query("status")
    .optional()
    .isIn([
      "active",
      "cancelled",
      "expired",
      "past_due",
      "trialing",
      "suspended",
      "pending",
      "completed",
      "failed",
      "refunded",
      "disputed",
    ])
    .withMessage("Invalid status value"),
  handleValidationErrors,
];

// Validation rules for user ID filter (admin only)
const validateUserIdFilter = [
  query("userId")
    .optional()
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
  handleValidationErrors,
];

// Validation rules for payment method filter
const validatePaymentMethodFilter = [
  query("paymentMethod")
    .optional()
    .isIn(["credit_card", "paypal", "bank_transfer", "crypto"])
    .withMessage("Invalid payment method"),
  handleValidationErrors,
];

// Validation rules for currency filter
const validateCurrencyFilter = [
  query("currency")
    .optional()
    .isIn(["USD", "EUR", "GBP"])
    .withMessage("Currency must be USD, EUR, or GBP"),
  handleValidationErrors,
];

// Validation rules for billing cycle filter
const validateBillingCycleFilter = [
  query("billingCycle")
    .optional()
    .isIn(["monthly", "quarterly", "yearly"])
    .withMessage("Billing cycle must be monthly, quarterly, or yearly"),
  handleValidationErrors,
];

// Validation rules for amount range (prevents injection)
const validateAmountRange = [
  query("minAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum amount must be a positive number"),
  query("maxAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum amount must be a positive number"),
  handleValidationErrors,
];

// Validation rules for profile updates
const validateProfileUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  handleValidationErrors,
];

// Validation rules for password change
const validatePasswordChange = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  handleValidationErrors,
];

// Validation rules for plan updates
const validatePlanUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Plan name must be between 3 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("currency")
    .optional()
    .isIn(["USD", "EUR", "GBP"])
    .withMessage("Currency must be USD, EUR, or GBP"),
  body("billingCycle")
    .optional()
    .isIn(["monthly", "quarterly", "yearly"])
    .withMessage("Billing cycle must be monthly, quarterly, or yearly"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  handleValidationErrors,
];

// Validation rules for subscription updates
const validateSubscriptionUpdate = [
  body("autoRenew")
    .optional()
    .isBoolean()
    .withMessage("autoRenew must be a boolean value"),
  body("cancellationReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Cancellation reason must not exceed 500 characters"),
  handleValidationErrors,
];

// Validation rules for refund processing
const validateRefundProcessing = [
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Refund amount must be a positive number"),
  body("reason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Refund reason must not exceed 500 characters"),
  handleValidationErrors,
];

// Validation rules for webhook processing
const validateWebhookProcessing = [
  body("event_type")
    .isIn(["payment.succeeded", "payment.failed", "subscription.cancelled"])
    .withMessage("Invalid event type"),
  body("transaction_id").notEmpty().withMessage("Transaction ID is required"),
  handleValidationErrors,
];

// Sanitize and validate date input to prevent injection
const sanitizeDateInput = (dateString) => {
  if (!dateString) return null;

  // Validate ISO 8601 format
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
  if (!isoDateRegex.test(dateString)) {
    throw new Error(
      "Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)"
    );
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date value");
  }

  // Prevent dates too far in the past or future
  const now = new Date();
  const minDate = new Date(now.getFullYear() - 10, 0, 1); // 10 years ago
  const maxDate = new Date(now.getFullYear() + 10, 11, 31); // 10 years in future

  if (date < minDate || date > maxDate) {
    throw new Error(
      "Date must be within reasonable range (10 years past/future)"
    );
  }

  return date;
};

// Sanitize and validate numeric input to prevent injection
const sanitizeNumericInput = (
  value,
  min = 0,
  max = Number.MAX_SAFE_INTEGER
) => {
  if (value === undefined || value === null) return null;

  const num = parseFloat(value);
  if (isNaN(num)) {
    throw new Error("Invalid numeric value");
  }

  if (num < min || num > max) {
    throw new Error(`Value must be between ${min} and ${max}`);
  }

  return num;
};

// Sanitize and validate string input to prevent injection
const sanitizeStringInput = (value, maxLength = 1000) => {
  if (!value) return null;

  const string = String(value).trim();
  if (string.length > maxLength) {
    throw new Error(`String must not exceed ${maxLength} characters`);
  }

  // Remove potentially dangerous characters
  return string.replace(/[<>]/g, "");
};

// Middleware to sanitize query parameters
const sanitizeQueryParams = (req, res, next) => {
  try {
    // Sanitize pagination
    if (req.query.page) {
      req.query.page = sanitizeNumericInput(req.query.page, 1, 1000);
    }
    if (req.query.limit) {
      req.query.limit = sanitizeNumericInput(req.query.limit, 1, 100);
    }

    // Sanitize date ranges
    if (req.query.startDate) {
      req.query.startDate = sanitizeDateInput(req.query.startDate);
    }
    if (req.query.endDate) {
      req.query.endDate = sanitizeDateInput(req.query.endDate);
    }

    // Sanitize amount ranges
    if (req.query.minAmount) {
      req.query.minAmount = sanitizeNumericInput(
        req.query.minAmount,
        0,
        999999.99
      );
    }
    if (req.query.maxAmount) {
      req.query.maxAmount = sanitizeNumericInput(
        req.query.maxAmount,
        0,
        999999.99
      );
    }

    // Sanitize string inputs
    if (req.query.status) {
      req.query.status = sanitizeStringInput(req.query.status, 50);
    }
    if (req.query.currency) {
      req.query.currency = sanitizeStringInput(req.query.currency, 10);
    }
    if (req.query.paymentMethod) {
      req.query.paymentMethod = sanitizeStringInput(
        req.query.paymentMethod,
        50
      );
    }

    next();
  } catch (error) {
    return res.status(400).json({
      error: "Invalid input",
      message: error.message,
    });
  }
};

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validatePlanCreation,
  validateSubscriptionCreation,
  validatePaymentProcessing,
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateStatusFilter,
  validateUserIdFilter,
  validatePaymentMethodFilter,
  validateCurrencyFilter,
  validateBillingCycleFilter,
  validateAmountRange,
  validateProfileUpdate,
  validatePasswordChange,
  validatePlanUpdate,
  validateSubscriptionUpdate,
  validateRefundProcessing,
  validateWebhookProcessing,
  sanitizeQueryParams,
  sanitizeDateInput,
  sanitizeNumericInput,
  sanitizeStringInput,
};

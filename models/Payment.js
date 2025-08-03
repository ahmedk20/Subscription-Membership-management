const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer"],
      default: "card",
    },
    description: {
      type: String,
      trim: true,
    },
    paymentGatewayId: {
      type: String,
      trim: true,
    },
    processedAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    failureReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Mark payment as completed
paymentSchema.methods.markCompleted = function () {
  this.status = "completed";
  this.processedAt = new Date();
  return this.save();
};

// Mark payment as failed
paymentSchema.methods.markFailed = function (reason) {
  this.status = "failed";
  this.failureReason = reason;
  return this.save();
};

// Refund payment
paymentSchema.methods.refund = function (amount = this.amount) {
  this.status = "refunded";
  this.refundedAt = new Date();
  this.refundAmount = amount;
  return this.save();
};

// Remove sensitive data from JSON output
paymentSchema.methods.toJSON = function () {
  const payment = this.toObject();
  return payment;
};

module.exports = mongoose.model("Payment", paymentSchema);

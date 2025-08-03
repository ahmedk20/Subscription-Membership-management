const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired", "suspended"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "paypal", "bank_transfer"],
      default: "card",
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    trialEnd: {
      type: Date,
    },
    paymentGatewayId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Cancel subscription method
subscriptionSchema.methods.cancel = function (reason) {
  this.status = "cancelled";
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};

// Reactivate subscription method
subscriptionSchema.methods.reactivate = function () {
  this.status = "active";
  this.cancelledAt = null;
  this.cancellationReason = null;
  return this.save();
};

// Remove sensitive data from JSON output
subscriptionSchema.methods.toJSON = function () {
  const subscription = this.toObject();
  return subscription;
};

module.exports = mongoose.model("Subscription", subscriptionSchema);

const crypto = require("crypto");

class DummyPaymentGateway {
  constructor() {
    // Enforce environment variable requirements
    const apiKey = process.env.PAYMENT_GATEWAY_API_KEY;
    const secretKey = process.env.PAYMENT_GATEWAY_SECRET;

    if (!apiKey || !secretKey) {
      throw new Error(
        "Payment gateway credentials not configured. Please set PAYMENT_GATEWAY_API_KEY and PAYMENT_GATEWAY_SECRET environment variables."
      );
    }

    this.apiKey = apiKey;
    this.secretKey = secretKey;
    this.baseUrl =
      process.env.PAYMENT_GATEWAY_URL || "https://api.paymentgateway.com";
  }

  // Generate a secure signature for webhook verification
  generateSignature(payload) {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(JSON.stringify(payload))
      .digest("hex");
  }

  // Verify webhook signature
  verifySignature(payload, signature) {
    const expectedSignature = this.generateSignature(payload);
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  }

  // Process a payment
  async processPayment(paymentData) {
    const {
      amount,
      currency = "USD",
      paymentMethod,
      description,
      customerEmail,
      customerId,
    } = paymentData;

    // Validate required fields
    if (!amount || amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    if (!paymentMethod) {
      throw new Error("Payment method is required");
    }

    if (!customerEmail) {
      throw new Error("Customer email is required");
    }

    // Simulate API call delay
    await this.simulateDelay(1000, 3000);

    // Generate transaction ID
    const transactionId = `txn_${crypto.randomBytes(16).toString("hex")}`;

    // Simulate different payment scenarios
    const successRate = 0.95; // 95% success rate
    const isSuccessful = Math.random() < successRate;

    if (isSuccessful) {
      return {
        success: true,
        transactionId,
        status: "completed",
        amount,
        currency,
        paymentMethod,
        processedAt: new Date().toISOString(),
        gatewayResponse: {
          code: "SUCCESS",
          message: "Payment processed successfully",
        },
      };
    } else {
      // Simulate different failure scenarios
      const failureReasons = [
        "Insufficient funds",
        "Card declined",
        "Invalid card number",
        "Expired card",
        "CVV mismatch",
      ];
      const failureReason =
        failureReasons[Math.floor(Math.random() * failureReasons.length)];

      return {
        success: false,
        transactionId,
        status: "failed",
        amount,
        currency,
        paymentMethod,
        processedAt: new Date().toISOString(),
        failureReason,
        gatewayResponse: {
          code: "FAILED",
          message: failureReason,
        },
      };
    }
  }

  // Process a refund
  async processRefund(refundData) {
    const { transactionId, amount, reason } = refundData;

    // Validate required fields
    if (!transactionId) {
      throw new Error("Transaction ID is required");
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid refund amount");
    }

    // Simulate API call delay
    await this.simulateDelay(800, 2000);

    // Generate refund ID
    const refundId = `ref_${crypto.randomBytes(16).toString("hex")}`;

    // Simulate refund processing
    const successRate = 0.98; // 98% success rate for refunds
    const isSuccessful = Math.random() < successRate;

    if (isSuccessful) {
      return {
        success: true,
        refundId,
        transactionId,
        status: "refunded",
        amount,
        reason: reason || "Customer request",
        processedAt: new Date().toISOString(),
        gatewayResponse: {
          code: "REFUND_SUCCESS",
          message: "Refund processed successfully",
        },
      };
    } else {
      return {
        success: false,
        refundId,
        transactionId,
        status: "failed",
        amount,
        reason: reason || "Customer request",
        processedAt: new Date().toISOString(),
        failureReason: "Refund processing failed",
        gatewayResponse: {
          code: "REFUND_FAILED",
          message: "Refund processing failed",
        },
      };
    }
  }

  // Create a subscription
  async createSubscription(subscriptionData) {
    const {
      planId,
      customerId,
      paymentMethod,
      amount,
      currency = "USD",
      billingCycle,
    } = subscriptionData;

    // Validate required fields
    if (!planId) {
      throw new Error("Plan ID is required");
    }

    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    if (!paymentMethod) {
      throw new Error("Payment method is required");
    }

    if (!amount || amount <= 0) {
      throw new Error("Invalid subscription amount");
    }

    // Simulate API call delay
    await this.simulateDelay(1500, 4000);

    // Generate subscription ID
    const subscriptionId = `sub_${crypto.randomBytes(16).toString("hex")}`;

    // Simulate subscription creation
    const successRate = 0.92; // 92% success rate
    const isSuccessful = Math.random() < successRate;

    if (isSuccessful) {
      return {
        success: true,
        subscriptionId,
        status: "active",
        planId,
        customerId,
        amount,
        currency,
        paymentMethod,
        billingCycle,
        createdAt: new Date().toISOString(),
        nextBillingDate: this.calculateNextBillingDate(billingCycle),
        gatewayResponse: {
          code: "SUBSCRIPTION_CREATED",
          message: "Subscription created successfully",
        },
      };
    } else {
      return {
        success: false,
        subscriptionId,
        status: "failed",
        planId,
        customerId,
        amount,
        currency,
        paymentMethod,
        billingCycle,
        createdAt: new Date().toISOString(),
        failureReason: "Subscription creation failed",
        gatewayResponse: {
          code: "SUBSCRIPTION_FAILED",
          message: "Subscription creation failed",
        },
      };
    }
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId) {
    // Validate required fields
    if (!subscriptionId) {
      throw new Error("Subscription ID is required");
    }

    // Simulate API call delay
    await this.simulateDelay(500, 1500);

    // Simulate subscription cancellation
    const successRate = 0.99; // 99% success rate for cancellations
    const isSuccessful = Math.random() < successRate;

    if (isSuccessful) {
      return {
        success: true,
        subscriptionId,
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        gatewayResponse: {
          code: "SUBSCRIPTION_CANCELLED",
          message: "Subscription cancelled successfully",
        },
      };
    } else {
      return {
        success: false,
        subscriptionId,
        status: "failed",
        cancelledAt: new Date().toISOString(),
        failureReason: "Subscription cancellation failed",
        gatewayResponse: {
          code: "CANCELLATION_FAILED",
          message: "Subscription cancellation failed",
        },
      };
    }
  }

  // Calculate next billing date based on billing cycle
  calculateNextBillingDate(billingCycle) {
    const now = new Date();
    let nextDate;

    switch (billingCycle) {
      case "monthly":
        nextDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate()
        );
        break;
      case "quarterly":
        nextDate = new Date(
          now.getFullYear(),
          now.getMonth() + 3,
          now.getDate()
        );
        break;
      case "yearly":
        nextDate = new Date(
          now.getFullYear() + 1,
          now.getMonth(),
          now.getDate()
        );
        break;
      default:
        nextDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          now.getDate()
        );
    }

    return nextDate.toISOString();
  }

  // Simulate API delay
  async simulateDelay(minMs = 500, maxMs = 2000) {
    const delay = Math.random() * (maxMs - minMs) + minMs;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Get payment gateway status
  async getStatus() {
    // Simulate API call delay
    await this.simulateDelay(200, 500);

    return {
      status: "operational",
      uptime: 99.9,
      responseTime: Math.random() * 100 + 50, // 50-150ms
      lastChecked: new Date().toISOString(),
    };
  }

  // Validate webhook payload
  validateWebhookPayload(payload) {
    const requiredFields = ["event_type", "transaction_id", "timestamp"];

    for (const field of requiredFields) {
      if (!payload[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate event type
    const validEventTypes = [
      "payment.succeeded",
      "payment.failed",
      "subscription.created",
      "subscription.cancelled",
      "subscription.updated",
    ];

    if (!validEventTypes.includes(payload.event_type)) {
      throw new Error(`Invalid event type: ${payload.event_type}`);
    }

    // Validate timestamp (should be recent)
    const timestamp = new Date(payload.timestamp);
    const now = new Date();
    const timeDiff = Math.abs(now - timestamp);

    if (timeDiff > 5 * 60 * 1000) {
      // 5 minutes
      throw new Error("Webhook timestamp is too old");
    }

    return true;
  }
}

module.exports = DummyPaymentGateway;

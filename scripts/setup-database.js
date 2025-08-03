#!/usr/bin/env node

const mongoose = require("mongoose");
const User = require("../models/User");
const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");
require("dotenv").config();

const samplePlans = [
  {
    name: "Basic Plan",
    description: "Perfect for small teams",
    price: 9.99,
    currency: "USD",
    billingCycle: "monthly",
    maxUsers: 5,
    features: [
      { name: "Basic Analytics", description: "Simple analytics dashboard" },
      {
        name: "Email Support",
        description: "Email support during business hours",
      },
      { name: "5GB Storage", description: "5GB of data storage" },
    ],
    trialDays: 7,
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "Professional Plan",
    description: "For growing businesses",
    price: 29.99,
    currency: "USD",
    billingCycle: "monthly",
    maxUsers: 25,
    features: [
      {
        name: "Advanced Analytics",
        description: "Advanced analytics with custom reports",
      },
      {
        name: "Priority Support",
        description: "Priority support with faster response times",
      },
      { name: "50GB Storage", description: "50GB of data storage" },
      { name: "API Access", description: "Full API access" },
      {
        name: "Custom Integrations",
        description: "Custom integration support",
      },
    ],
    trialDays: 14,
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Enterprise Plan",
    description: "For large organizations",
    price: 99.99,
    currency: "USD",
    billingCycle: "monthly",
    maxUsers: 100,
    features: [
      {
        name: "Enterprise Analytics",
        description: "Advanced analytics with custom dashboards",
      },
      { name: "Dedicated Support", description: "Dedicated account manager" },
      { name: "Unlimited Storage", description: "Unlimited data storage" },
      {
        name: "Full API Access",
        description: "Complete API access with rate limits",
      },
      {
        name: "Custom Integrations",
        description: "Custom integration development",
      },
      { name: "SLA Guarantee", description: "99.9% uptime SLA" },
      { name: "Advanced Security", description: "Advanced security features" },
    ],
    trialDays: 30,
    isActive: true,
    sortOrder: 3,
  },
];

const sampleUsers = [
  {
    email: "admin@example.com",
    password: "Admin123!",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    isActive: true,
  },
  {
    email: "user@example.com",
    password: "User123!",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    isActive: true,
  },
  {
    email: "premium@example.com",
    password: "Premium123!",
    firstName: "Jane",
    lastName: "Smith",
    role: "user",
    isActive: true,
  },
];

async function connectToDatabase() {
  const mongoUri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/members-api";

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    console.log(`Database: ${mongoose.connection.name}`);
    console.log(
      `Host: ${mongoose.connection.host}:${mongoose.connection.port}`
    );
    return true;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    return false;
  }
}

async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Subscription.deleteMany({});
    await Payment.deleteMany({});
    console.log("Database cleared");
  } catch (error) {
    console.error("Error clearing database:", error.message);
  }
}

async function createSampleData() {
  try {
    // Create plans
    console.log("Creating sample plans...");
    const createdPlans = await Plan.insertMany(samplePlans);
    console.log(`Created ${createdPlans.length} plans`);

    // Create users
    console.log("Creating sample users...");
    const createdUsers = [];

    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    console.log(`Created ${createdUsers.length} users`);

    // Create subscriptions
    console.log("Creating sample subscriptions...");
    const subscriptions = [];

    subscriptions.push({
      user: createdUsers[1]._id,
      plan: createdPlans[0]._id,
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      amount: createdPlans[0].price,
      currency: createdPlans[0].currency,
      paymentMethod: "card",
    });

    subscriptions.push({
      user: createdUsers[2]._id,
      plan: createdPlans[1]._id,
      status: "active",
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      amount: createdPlans[1].price,
      currency: createdPlans[1].currency,
      paymentMethod: "card",
    });

    const createdSubscriptions = await Subscription.insertMany(subscriptions);
    console.log(`Created ${createdSubscriptions.length} subscriptions`);

    // Create payments
    console.log("Creating sample payments...");
    const payments = [];

    payments.push({
      user: createdUsers[1]._id,
      subscription: createdSubscriptions[0]._id,
      amount: createdPlans[0].price,
      currency: createdPlans[0].currency,
      status: "completed",
      paymentMethod: "card",
      description: "Basic Plan - Monthly Subscription",
      processedAt: new Date(),
      paymentGatewayId: "pg_" + Math.random().toString(36).substr(2, 9),
    });

    payments.push({
      user: createdUsers[2]._id,
      subscription: createdSubscriptions[1]._id,
      amount: createdPlans[1].price,
      currency: createdPlans[1].currency,
      status: "completed",
      paymentMethod: "card",
      description: "Professional Plan - Monthly Subscription",
      processedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      paymentGatewayId: "pg_" + Math.random().toString(36).substr(2, 9),
    });

    const createdPayments = await Payment.insertMany(payments);
    console.log(`Created ${createdPayments.length} payments`);

    return {
      users: createdUsers.length,
      plans: createdPlans.length,
      subscriptions: createdSubscriptions.length,
      payments: createdPayments.length,
    };
  } catch (error) {
    console.error("Error creating sample data:", error.message);
    throw error;
  }
}

async function displayDatabaseInfo() {
  try {
    const userCount = await User.countDocuments();
    const planCount = await Plan.countDocuments();
    const subscriptionCount = await Subscription.countDocuments();
    const paymentCount = await Payment.countDocuments();

    console.log("\nDatabase Summary:");
    console.log(`Users: ${userCount}`);
    console.log(`Plans: ${planCount}`);
    console.log(`Subscriptions: ${subscriptionCount}`);
    console.log(`Payments: ${paymentCount}`);

    console.log("\nSample Login Credentials:");
    console.log("Admin: admin@example.com / Admin123!");
    console.log("User: user@example.com / User123!");
    console.log("Premium: premium@example.com / Premium123!");
  } catch (error) {
    console.error("Error getting database info:", error.message);
  }
}

async function main() {
  const command = process.argv[2];

  if (!(await connectToDatabase())) {
    process.exit(1);
  }

  if (command === "clear") {
    await clearDatabase();
    console.log("Database cleared successfully");
  } else if (command === "info") {
    await displayDatabaseInfo();
  } else {
    console.log("Setting up database with sample data...");
    await clearDatabase();
    await createSampleData();
    await displayDatabaseInfo();
    console.log("\nDatabase setup complete!");
  }

  await mongoose.connection.close();
  console.log("Database connection closed");
}

main().catch(console.error);

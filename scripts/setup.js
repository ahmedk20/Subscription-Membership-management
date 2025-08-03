const mongoose = require("mongoose");
const User = require("../models/User");
const Plan = require("../models/Plan");
require("dotenv").config();

async function setupDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/members-api"
    );
    console.log("✅ Connected to MongoDB");

    // Create admin user
    console.log("👤 Creating admin user...");
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (!adminExists) {
      const adminUser = new User({
        email: "admin@example.com",
        password: "AdminPass123",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
      });
      await adminUser.save();
      console.log("✅ Admin user created: admin@example.com / AdminPass123");
    } else {
      console.log("ℹ️  Admin user already exists");
    }

    // Create sample plans
    console.log("📋 Creating sample plans...");
    const plans = [
      {
        name: "Basic Plan",
        description: "Perfect for individuals getting started",
        price: 9.99,
        currency: "USD",
        billingCycle: "monthly",
        features: [
          { name: "Basic Access", description: "Access to basic features" },
          {
            name: "Email Support",
            description: "Email support during business hours",
          },
        ],
        maxUsers: 1,
        trialDays: 0,
        sortOrder: 1,
      },
      {
        name: "Pro Plan",
        description: "Great for growing businesses",
        price: 29.99,
        currency: "USD",
        billingCycle: "monthly",
        features: [
          { name: "Advanced Access", description: "Access to all features" },
          {
            name: "Priority Support",
            description: "Priority email and chat support",
          },
          {
            name: "Analytics",
            description: "Advanced analytics and reporting",
          },
          { name: "API Access", description: "Full API access" },
        ],
        maxUsers: 5,
        trialDays: 7,
        sortOrder: 2,
      },
      {
        name: "Enterprise Plan",
        description: "For large organizations with advanced needs",
        price: 99.99,
        currency: "USD",
        billingCycle: "monthly",
        features: [
          {
            name: "Unlimited Access",
            description: "Access to all features and future updates",
          },
          {
            name: "24/7 Support",
            description: "Round-the-clock phone and chat support",
          },
          {
            name: "Advanced Analytics",
            description: "Custom analytics and reporting",
          },
          {
            name: "API Access",
            description: "Full API access with higher limits",
          },
          {
            name: "Custom Integrations",
            description: "Custom integrations and white-labeling",
          },
          {
            name: "Dedicated Account Manager",
            description: "Personal account manager",
          },
        ],
        maxUsers: 50,
        trialDays: 14,
        sortOrder: 3,
      },
    ];

    for (const planData of plans) {
      const existingPlan = await Plan.findOne({ name: planData.name });
      if (!existingPlan) {
        const plan = new Plan(planData);
        await plan.save();
        console.log(`✅ Created plan: ${planData.name}`);
      } else {
        console.log(`ℹ️  Plan already exists: ${planData.name}`);
      }
    }

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📝 Sample Data:");
    console.log("Admin User: admin@example.com / AdminPass123");
    console.log(
      "Sample Plans: Basic ($9.99), Pro ($29.99), Enterprise ($99.99)"
    );
    console.log("\n🚀 You can now start the server with: npm run dev");
  } catch (error) {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;

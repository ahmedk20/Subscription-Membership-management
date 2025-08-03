const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Simple JWT token blacklist (in production, use Redis)
const blacklistedTokens = new Set();

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  // Check if token is blacklisted
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ error: "Token has been revoked" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "User account is inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Generate JWT tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" }
  );

  return { accessToken, refreshToken };
};

// Require admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Blacklist token (logout)
const blacklistToken = (token) => {
  blacklistedTokens.add(token);

  // Clean up old tokens periodically (simple approach)
  if (blacklistedTokens.size > 1000) {
    blacklistedTokens.clear();
  }
};

module.exports = {
  authenticateToken,
  generateTokens,
  requireAdmin,
  blacklistToken,
};

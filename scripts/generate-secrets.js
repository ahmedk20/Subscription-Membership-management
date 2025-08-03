#!/usr/bin/env node

const crypto = require("crypto");

/**
 * Generate secure JWT secrets following OWASP guidelines
 *
 * This script generates cryptographically secure random secrets
 * for JWT signing that meet OWASP security requirements.
 */

console.log("🔐 Generating Secure JWT Secrets\n");

// Generate 256-bit (32-byte) secrets
const jwtSecret = crypto.randomBytes(32).toString("hex");
const refreshSecret = crypto.randomBytes(32).toString("hex");

// Generate 512-bit (64-byte) secrets for extra security
const jwtSecretExtra = crypto.randomBytes(64).toString("hex");
const refreshSecretExtra = crypto.randomBytes(64).toString("hex");

console.log("📋 Environment Variables for .env file:\n");

console.log("# JWT Configuration (OWASP Compliant)");
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`JWT_REFRESH_SECRET=${refreshSecret}`);
console.log("JWT_EXPIRES_IN=900000");
console.log("JWT_REFRESH_EXPIRES_IN=604800000");
console.log("JWT_ISSUER=members-api");
console.log("JWT_AUDIENCE=members-api-users");

console.log("\n🔒 Extra Secure Secrets (512-bit):\n");

console.log("# JWT Configuration (Extra Secure - 512-bit)");
console.log(`JWT_SECRET=${jwtSecretExtra}`);
console.log(`JWT_REFRESH_SECRET=${refreshSecretExtra}`);
console.log("JWT_EXPIRES_IN=900000");
console.log("JWT_REFRESH_EXPIRES_IN=604800000");
console.log("JWT_ISSUER=members-api");
console.log("JWT_AUDIENCE=members-api-users");

console.log("\n📊 Security Information:");
console.log(`- JWT Secret Length: ${jwtSecret.length * 4} bits`);
console.log(`- Refresh Secret Length: ${refreshSecret.length * 4} bits`);
console.log(`- Extra Secure Length: ${jwtSecretExtra.length * 4} bits`);
console.log("- Algorithm: HS256 (HMAC SHA-256)");
console.log("- OWASP Compliance: ✅");

console.log("\n⚠️  Security Notes:");
console.log("- Store secrets securely (not in version control)");
console.log("- Use different secrets for each environment");
console.log("- Rotate secrets periodically");
console.log("- Use environment variables or secret management services");
console.log("- Never commit secrets to version control");

console.log("\n🚀 Next Steps:");
console.log("1. Copy the environment variables to your .env file");
console.log("2. Restart your application");
console.log("3. Test authentication endpoints");
console.log("4. Monitor for any security issues");

console.log("\n✅ Secrets generated successfully!");

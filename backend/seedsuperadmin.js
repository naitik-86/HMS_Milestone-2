/**
 * Seed SuperAdmin
 * Run: node seedsuperadmin.js
 *
 * Creates (or updates) the SuperAdmin account in MongoDB Atlas.
 * Safe to re-run — uses findOneAndUpdate with upsert.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SuperAdmin = require("./src/models/SuperAdmin");

const SUPER_ADMIN_EMAIL    = "admin@webarclight.com";
const SUPER_ADMIN_PASSWORD = "Admin@HMS2026!";

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌  MONGO_URI not set. Make sure .env is present.");
      process.exit(1);
    }

    console.log("🔌  Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅  Connected:", mongoose.connection.host);

    const hashed = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 12);

    const result = await SuperAdmin.findOneAndUpdate(
      { email: SUPER_ADMIN_EMAIL },
      {
        $set: {
          email:    SUPER_ADMIN_EMAIL,
          password: hashed,
          role:     "SUPER_ADMIN",
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const action = result.createdAt?.getTime() === result.updatedAt?.getTime()
      ? "created"
      : "updated";

    console.log(`\n🎉  SuperAdmin ${action} successfully!`);
    console.log("─────────────────────────────────────");
    console.log("  Email   :", SUPER_ADMIN_EMAIL);
    console.log("  Password:", SUPER_ADMIN_PASSWORD);
    console.log("  Role    :", result.role);
    console.log("  ID      :", result._id.toString());
    console.log("─────────────────────────────────────");
    console.log("\n🔐  Login at: http://13.232.125.254/login");
    console.log("    Dashboard: http://13.232.125.254/superadmin\n");
  } catch (err) {
    console.error("❌  Seed failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌  Disconnected.");
  }
}

seed();

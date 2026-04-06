/**
 * Create or reset a staff (Admin panel) login — separate from student accounts on /login.
 *
 * Usage (from server folder):
 *   node scripts/ensureStaffAdmin.mjs <email> <password> [fullName] [admin_id] [role] [phone]
 *
 * Example:
 *   node scripts/ensureStaffAdmin.mjs someone@mail.com "MyPass123" "Full Name" "ADM001" "Admin" "0770000000"
 */
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("Missing MONGODB_URI in server/.env");
  process.exit(1);
}

const [, , emailArg, password, fullName = "Staff User", admin_id = "STAFF-001", role = "Admin", phone = "0000000000"] =
  process.argv;

if (!emailArg || !password) {
  console.error(
    "Usage: node scripts/ensureStaffAdmin.mjs <email> <password> [fullName] [admin_id] [role] [phoneNumber]"
  );
  process.exit(1);
}

const email = String(emailArg).trim().toLowerCase();

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15_000 });
  const hashed = await bcrypt.hash(password, 10);
  const existing = await Admin.findOne({ email });

  if (existing) {
    existing.password = hashed;
    await existing.save();
    console.log("Password updated for existing staff account:", email);
  } else {
    await Admin.create({
      admin_id: String(admin_id).trim(),
      fullName: String(fullName).trim(),
      email,
      role: String(role).trim(),
      phoneNumber: String(phone).trim(),
      password: hashed,
    });
    console.log("Created staff account:", email, "role:", role);
  }
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
} finally {
  await mongoose.disconnect();
}

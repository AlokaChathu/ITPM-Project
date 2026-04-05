import Admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getAdminJwtSecret } from "../config/jwtSecret.js";

// Admin Registration
export const adminRegister = async (req, res) => {
  try {
    const { admin_id, fullName, email, role, phoneNumber, password } = req.body;

    if (!admin_id || !fullName || !email || !role || !phoneNumber || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const emailNorm = String(email).trim().toLowerCase();
    const existingAdmin = await Admin.findOne({
      $or: [{ email: emailNorm }, { admin_id: String(admin_id).trim() }],
    });
    if (existingAdmin) {
      return res.status(400).json({ success: false, message: "Admin with given email or admin_id already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      admin_id: String(admin_id).trim(),
      fullName,
      email: emailNorm,
      role,
      phoneNumber,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        admin_id: String(admin_id).trim(),
        fullName,
        email: emailNorm,
        role,
        phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error in adminRegister:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    const emailNorm = String(email).trim().toLowerCase();
    const admin = await Admin.findOne({ email: emailNorm });
    if (!admin) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    const adminSecret = getAdminJwtSecret();
    if (!adminSecret) {
      return res.status(500).json({ success: false, message: "Server admin JWT secret is not configured" });
    }

    const token = jwt.sign({ id: admin._id }, adminSecret, {
      expiresIn: "1h",
    });

    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        admin_id: admin.admin_id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        phoneNumber: admin.phoneNumber,
        id: admin._id,
      },
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Admin logout
export const logout = (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify Admin (used by main app)
export const verifyAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Admin verified successfully",
      data: {
        admin_id: admin.admin_id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
        phoneNumber: admin.phoneNumber,
        id: admin._id,
      },
    });
  } catch (error) {
    console.error("Error in verifyAdmin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.model.js";

// Company Register
export const registerCompany = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      industry,
      description,
      supervisorName,
      supervisorEmail,
      password,
    } = req.body;

    if (
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !companyAddress ||
      !industry ||
      !description ||
      !supervisorName ||
      !supervisorEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingCompany = await Company.findOne({ companyEmail });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already registered with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      companyName,
      companyEmail,
      companyPhone,
      companyAddress,
      companyWebsite,
      industry,
      description,
      supervisorName,
      supervisorEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: company._id, role: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("companyToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Company registered successfully",
      company: {
        id: company._id,
        companyName: company.companyName,
        companyEmail: company.companyEmail,
        role: company.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Company Login
export const loginCompany = async (req, res) => {
  try {
    const { companyEmail, password } = req.body;

    if (!companyEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const company = await Company.findOne({ companyEmail });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Invalid email",
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: company._id, role: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("companyToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Company login successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Company Logout
export const logoutCompany = async (req, res) => {
  try {
    res.clearCookie("companyToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.json({
      success: true,
      message: "Company logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
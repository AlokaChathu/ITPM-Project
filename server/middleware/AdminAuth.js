import jwt from "jsonwebtoken";
import { getAdminJwtSecret } from "../config/jwtSecret.js";

const adminAuth = async (req, res, next) => {
  try {
    const adminToken = req.cookies?.adminToken;

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    const adminSecret = getAdminJwtSecret();
    if (!adminSecret) {
      return res.status(500).json({
        success: false,
        message: "Server admin JWT secret is not configured",
      });
    }

    const decoded = jwt.verify(adminToken, adminSecret);

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.adminId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default adminAuth;

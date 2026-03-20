import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
  try {
    const adminToken = req.cookies?.adminToken;

    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login.",
      });
    }

    const decoded = jwt.verify(
      adminToken,
      process.env.JWT_SECRET_ADMIN
    );

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

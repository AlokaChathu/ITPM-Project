import Company from "../models/Company.model.js";

export const getCompanyDashboard = async (req, res) => {
  try {
    const company = await Company.findById(req.companyId).select("-password");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE COMPANY PROFILE
export const updateCompanyProfile = async (req, res) => {
  try {
    const {
      companyName,
      description,
      companyEmail,
      companyPhone,
      companyAddress,
      companyContact,
    } = req.body;

    const company = await Company.findByIdAndUpdate(
      req.companyId,
      {
        companyName,
        description,
        companyEmail,
        companyPhone,
        companyAddress,
        companyContact,
      },
      { new: true }
    ).select("-password");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      message: "Company profile updated successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
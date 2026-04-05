import Internship from "../models/Internship.js";

// CREATE
export const createInternship = async (req, res) => {
  try {
    const { title, description, requirements, duration, deadline, status } = req.body;

    const internship = await Internship.create({
      company: req.companyId,
      title,
      description,
      requirements,
      duration,
      deadline,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Internship created successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ ALL
export const getCompanyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.companyId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      internships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// READ ONE
export const getSingleInternship = async (req, res) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      company: req.companyId,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.json({
      success: true,
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updateInternship = async (req, res) => {
  try {
    const { title, description, requirements, duration, deadline, status } = req.body;

    const internship = await Internship.findOneAndUpdate(
      { _id: req.params.id, company: req.companyId },
      { title, description, requirements, duration, deadline, status },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.json({
      success: true,
      message: "Internship updated successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findOneAndDelete({
      _id: req.params.id,
      company: req.companyId,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: "Internship not found",
      });
    }

    res.json({
      success: true,
      message: "Internship deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
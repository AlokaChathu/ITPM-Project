import Portfolio from "../models/Portfolio.model.js";

// [STUDENT] Get their own portfolio (skills)
export const getMyPortfolio = async (req, res) => {
    try {
        const studentId = req.userId;
        let portfolio = await Portfolio.findOne({ studentId });
        
        // If they don't have one yet, return an empty array of skills
        if (!portfolio) {
            return res.json({ success: true, data: { skills: [] } });
        }
        res.json({ success: true, data: portfolio });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [STUDENT] Add or update skills
export const updateSkills = async (req, res) => {
    try {
        const studentId = req.userId;
        const { skills } = req.body; // Expecting an array of strings

        let portfolio = await Portfolio.findOne({ studentId });

        if (portfolio) {
            portfolio.skills = skills;
            await portfolio.save();
        } else {
            portfolio = new Portfolio({ studentId, skills });
            await portfolio.save();
        }

        res.json({ success: true, message: "Skills updated successfully", data: portfolio });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// [ADMIN] Get all portfolios (to view students and their skills)
export const getAllPortfolios = async (req, res) => {
    try {
        const portfolios = await Portfolio.find().populate('studentId', 'name email');
        res.json({ success: true, data: portfolios });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
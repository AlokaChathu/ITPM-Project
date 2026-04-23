import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const companyAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not authorized to login again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            const user = await userModel.findById(tokenDecode.id);
            
            if (!user) {
                return res.json({ success: false, message: "User not found" });
            }

            if (user.role !== 'Company') {
                return res.json({ success: false, message: "Not authorized - Company role required" });
            }

            req.userId = tokenDecode.id;
            req.companyName = user.companyName;
        } else {
            return res.json({ success: false, message: "Not authorized to login again" });
        }

        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default companyAuth;

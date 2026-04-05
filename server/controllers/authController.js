import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import tranporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password, age, phone, address } = req.body;

  if (!name || !email || !password || !age || !phone || !address) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Include age, phone, address here
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      age,
      phone,
      address
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Welcome to AUTH System',
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; background: #f4f6f8; border: 1px solid #e0e0e0;">
      
      <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #1a73e8; margin: 0;">AUTH System</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; font-weight: 600; margin-top: 0;">Welcome to AUTH System!</h2>
        <p style="color: #555; font-size: 16px;">
          Hello ${email},
        </p>
        <p style="color: #555; font-size: 16px;">
          We’re excited to have you on board. Your account has been successfully created with the email ID: <strong>${email}</strong>.
        </p>
        <p style="color: #555; font-size: 16px;">
          You can now explore our platform and start using all the features we offer.
        </p>
        <p style="color: #555; font-size: 16px; text-align: center; margin-top: 30px;">
        
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} AUTH System. All rights reserved.
      </div>
    </div>
  `
    };


    await tranporter.sendMail(mailOptions);

    return res.json({ success: true });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: "Logged Out" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// send verification email to the User's Email

export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified." });
    }

    // Generate a 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP and expiry time
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    // Professional HTML Email with modern colors
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; background: #f4f6f8; border: 1px solid #e0e0e0;">
          
          <div style="text-align: center; padding-bottom: 20px;">
            <h1 style="color: #1a73e8; margin: 0;">AUTH System</h1>
          </div>

          <div style="background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; font-weight: 600; margin-top: 0;">Verify Your Account</h2>
            <p style="color: #555; font-size: 16px;">
              Hi ${user.name || "User"},
            </p>
            <p style="color: #555; font-size: 16px;">
              We received a request to verify your account. Use the OTP below to complete your verification:
            </p>
            
            <p style="text-align: center; font-size: 28px; font-weight: bold; color: #1a73e8; letter-spacing: 2px; margin: 30px 0;">
              ${otp}
            </p>
            
            <p style="color: #555; font-size: 14px;">
              This OTP is valid for <strong>24 hours</strong>. Do not share it with anyone.
            </p>
            <p style="color: #555; font-size: 14px;">
              If you did not request this, you can safely ignore this email.
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
            © ${new Date().getFullYear()} AUTH System. All rights reserved.
          </div>
        </div>
      `
    };

    await tranporter.sendMail(mailOption);

    res.json({
      success: true,
      message: "Verification OTP sent on Email"
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// verify email using OTP

export const verifyEmail = async (req, res) => {

  const { otp } = req.body;

  if (!otp) {
    return res.json({
      success: false, message: "Missing details"
    });
  }

  try {

    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {

      return res.json({ success: false, message: "OTP Expired" });

    }

    user.isAccountVerified = true;

    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" })

  } catch (error) {
    res.json({ success: false, message: error.message });
  }


}


// chekc if user is authernticated

export const isAuthenticated = async (req, res) => {

  try {
    return res.json({ success: true });

  } catch (error) {
    return res.json({ success: true, message: error.message })
  }

}



// Send password reset OTP

export const sendResetOtp = async (req, res) => {

  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" })
  }

  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: 'Password Reset OTP - AUTH System',
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 30px; border-radius: 12px; background: #f4f6f8; border: 1px solid #e0e0e0;">
      
      <div style="text-align: center; padding-bottom: 20px;">
        <h1 style="color: #1a73e8; margin: 0;">AUTH System</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; font-weight: 600; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #555; font-size: 16px;">
          Hi ${user.name || "User"},
        </p>
        <p style="color: #555; font-size: 16px;">
          We received a request to reset your password. Use the OTP below to proceed:
        </p>
        
        <p style="text-align: center; font-size: 28px; font-weight: bold; color: #1a73e8; letter-spacing: 2px; margin: 30px 0;">
          ${otp}
        </p>
        
        <p style="color: #555; font-size: 14px;">
          This OTP is valid for <strong>24 hours</strong>. Please do not share it with anyone.
        </p>
        <p style="color: #555; font-size: 14px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} AUTH System. All rights reserved.
      </div>
    </div>
  `
    };


    await tranporter.sendMail(mailOption);

    return res.json({ success: true, message: "OTP send to your email" });


  } catch (error) {
    return res.json({ success: false, message: error.message })
  }

};



// Reset User Password 

export const resetPassword = async (req, res) => {

  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {

    return res.json({ success: false, message: "Email ,otp and password required ." })
  }

  try {

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" })
    }

    if (user.resetOtp == "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" })
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetOtp = '';

    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Password has been resetted successfully" });

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }

}


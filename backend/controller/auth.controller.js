import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import crypto from "crypto";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenandSetcookie } from "../utils/generateTokenSetCookie.js";
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/email.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    } // check if any of fields are empty

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    } // check if password is less than 6 characters long

    const userAlreadyExists = await User.findOne({ email }); // check if user already exists

    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //hash password using bcrypt

    const verificationToken = generateVerificationCode(); // generate verification code

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });
    await user.save(); // save user to database

    //jwt token

    generateTokenandSetcookie(res, user._id);

    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc, // spread user document and get all fields except password
        password: undefined, // remove password from response so that it is not sent to client
      },
    });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }, // check if verification token is not expired
    });
    if(!user){
        res.status(400).json({success: false, message: "Invalid or expired verification code"});
    }
    user.isVerfied = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({success: true, message: "Email verified successfully",
        user:{
            ...user._doc,
            password: undefined,
        },
    });
  } catch (error) {
    console.log("Error verifying email", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    } // check if user exists in database or not

    const isMatchPassword = await bcrypt.compare(password, user.password);
    if(!isMatchPassword){
      res.status(400).json({success: false, message: "Invalid Credentials"});
    } // check if password is correct or not

    generateTokenandSetcookie(res, user._id); // generate jwt token and set cookie

    user.lastlogin = new Date(); // update last login date
    await user.save();

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
      });
  } catch (error) {
    console.log("Error logging in", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success:true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email});
    if(!user){
        res.status(400).json({success: false, message: "User not found"});
    }
    // Generate password reset token
    const resetToken = crypto.randomBytes(20).toString("hex"); // generate random token using crypto
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = resetTokenExpiresAt;

    await user.save();

    // send email with reset password link
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({success: true, message: "Password reset link sent to your email"});
  } catch (error) {
    console.log("Error sending password reset email", error);
    res.status(500).json({success: false, message: "Server Error"});
  }
}

export const resetPassword = async (req, res) => {
  
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpires: { $gt: Date.now() },
    });

    if(!user){
        res.status(400).json({success: false, message: "Invalid or expired reset token"});
    } // check if reset token is valid or not

    user.password = await bcrypt.hash(password, 10); // hash new password if token is valid
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;

    await user.save();

   await sendPasswordResetSuccessEmail(user.email); // send email to user that password has been reset
  
      res.status(200).json({success: true, message: "Password reset successfully"});
    
  } catch (error) {
    console.log("Error resetting password", error);
    res.status(500).json({success: false, message: "Server Error"});
  }

}
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // get user by id and exclude password field

    if(!user) {
      return res.status(401).json({success: false, message: "User not found"});
    }
    res.status(200).json({success: true, user}); // send user data if user is found in database
  } catch (error) {
    console.log("Error checking auth", error);
    res.status(500).json({success: false, message: "Server Error"});
  }
}
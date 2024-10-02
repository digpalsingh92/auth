import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenandSetcookie } from "../utils/generateTokenSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/email.js";

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
        user:{
            ...user._doc,  // spread user document and get all fields except password
            password: undefined,   // remove password from response so that it is not sent to client
        }
    })

  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }

};
export const login = async (req, res) => {
  res.send("login route");
};
export const logout = async (req, res) => {
  res.send("logout route");
};

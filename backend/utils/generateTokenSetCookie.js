import jwt from "jsonwebtoken";

export const generateTokenandSetcookie = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    }); // create token with user id and secret key

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    }); // set cookie with token and its age to 7 days

    return token
};
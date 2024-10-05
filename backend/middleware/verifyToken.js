import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;  // get token from cookie and token name comes from line 8 generateTokenandSetcookie.js name has to be same
    if(!token)return res.status(401).json({success: false, message: "Unauthorized - nO token Provided"}); // if token is not present then send unauthorized response

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify token with secret key and get decoded data. same secret key has to be used which was used to create token
        if(!decoded) return res.status(401).json({success: false, message: "Unauthorized - Invalid token"}); // if token is invalid then send unauthorized response

        req.userId = decoded.userId; // set userId in req object
        next(); // call next middleware
    } catch (error) {
        console.log("Error verifying token", error);
    }
} // verify token and set user in req.user.. next will call the next middleware
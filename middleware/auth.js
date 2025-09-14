// authMiddleware.js or protect.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// 🔑 Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  console.log("Incoming headers:", req.headers);

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Extracted Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded Payload:", decoded);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      next(); // user is authenticated
    } catch (error) {
      console.error("JWT Error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token expired, please log in again" });
      }

      return res.status(401).json({ success: false, message: "Token invalid" });
    }
  } else {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }
};

// 🔑 Utility to generate JWTs (use this in login/signup controllers)
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "15d" } // token valid for 1 hour
  );
};

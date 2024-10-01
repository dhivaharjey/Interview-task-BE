import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/userSchema.js";

dotenv.config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid token." });
  }
};
export default authenticateToken;

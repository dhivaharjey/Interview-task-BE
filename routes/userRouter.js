import express from "express";
import {
  getLoggedInUserDetails,
  userLogin,
  userRegister,
} from "../controllers/userController.js";
import authenticateToken from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.get("/check-auth", authenticateToken, (req, res) => {
  res.json({ message: "This is protected data.", user: req.user });
});
userRouter.get("/user-details", authenticateToken, getLoggedInUserDetails);

export default userRouter;

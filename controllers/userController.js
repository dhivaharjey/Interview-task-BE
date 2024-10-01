import User from "../model/userSchema.js";
import { validateLogIn, validateSignUp } from "../utils/validationSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const validatedData = validateSignUp(req.body);
    const { userName, email, password } = validatedData;

    const isUserNameExists = await User.findOne({ userName });
    const isUserEmailExists = await User.findOne({ email });

    if (isUserNameExists) {
      return res.status(409).json({
        status: false,
        error: "User Name already exists, try another name!",
      });
    }
    if (isUserEmailExists) {
      return res.status(409).json({
        status: false,
        error: "User Email already exists, try another email!",
      });
    }

    const newUser = new User({ userName, email, password });
    await newUser.save();

    return res.status(201).json({
      status: true,
      message: "Registered successfully!",
    });
  } catch (error) {
    if (error.message) {
      return res.status(400).json({ status: false, error: error.message });
    }

    res.status(500).json({ status: false, error: "Internal server error!" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const validatedData = validateLogIn(req.body);
    const { userName, password } = validatedData;

    const user = await User.findOne({ userName });
    if (!user) {
      return res
        .status(401)
        .json({ status: false, error: "Invalid User Name!" });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ status: false, error: "Invalid Password!" });
    }

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Token valid for 1 hour
      }
    );

    return res.status(200).json({
      status: true,
      message: "Logged In Successfully!",
      token,
    });
  } catch (error) {
    if (error.message) {
      // Return Joi validation error messages
      // console.log(error.message);
      return res.status(400).json({ status: false, error: error.message });
    }
    return res
      .status(500)
      .json({ status: false, error: "Internal server error!" });
  }
};
export const getLoggedInUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: false, error: "User not found." });
    }

    return res.status(200).json({ status: true, user });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "An error occurred while fetching user details.",
    });
  }
};

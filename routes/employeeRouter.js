import express from "express";
import authenticateToken from "../middleware/auth.js";
import {
  createEmployee,
  deleteEmployee,
  employeeDetails,
  getEmployeeList,
  updateEmployee,
} from "../controllers/employeeController.js";
import upload from "../utils/imageUpload.js";

const empRouter = express.Router();

empRouter.post(
  "/create-employee",
  authenticateToken,
  upload.single("image"),
  createEmployee
);
empRouter.get("/get-employee-list", authenticateToken, getEmployeeList);
empRouter.get("/get-employee/:id", authenticateToken, employeeDetails);
empRouter.put(
  "/update-employee/:id",
  authenticateToken,
  upload.single("image"),
  updateEmployee
);
empRouter.delete("/delete-employee/:id", authenticateToken, deleteEmployee);
export default empRouter;

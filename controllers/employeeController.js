import Employee from "../model/employeeSchema.js";

import { validateEmployee } from "../utils/validationSchema.js";

export const createEmployee = async (req, res) => {
  try {
    const validatedData = validateEmployee(req.body);
    const { name, email, mobileNumber, designation, gender, course } =
      validatedData;
    if (!req.file) {
      return res
        .status(400)
        .json({ status: false, error: "Image upload is required" });
    }
    const userId = req.user._id;

    const existingEmployee = await Employee.findOne({
      user: userId,
      $or: [{ name: name }, { email: email }, { mobileNumber: mobileNumber }],
    });

    if (existingEmployee) {
      if (existingEmployee.name === name) {
        return res
          .status(400)
          .json({ error: "An employee with this name already exists." });
      } else if (existingEmployee.email === email) {
        return res
          .status(400)
          .json({ error: "An employee with this email already exists." });
      } else if (existingEmployee.mobileNumber === mobileNumber) {
        return res.status(400).json({
          error: "An employee with this mobile number already exists.",
        });
      }
    }

    const newEmployee = new Employee({
      name,
      email,
      mobileNumber,
      designation,
      gender,
      course,
      image: req.file ? req.file.path : "",
      user: userId,
    });

    // Step 4: Save the employee document
    const savedEmployee = await newEmployee.save();
    res
      .status(201)
      .json({ savedEmployee, message: "Employee Created successfully!!!" });
  } catch (error) {
    if (error.message) {
      // Return Joi validation error messages
      // console.log(error.message);
      return res.status(400).json({ status: false, error: error.message });
    }
    res.status(500).json({ error: "Failed to create employee" });
  }
};

export const getEmployeeList = async (req, res) => {
  try {
    const userId = req.user._id; // Get logged-in user's ID

    // Fetch employees belonging to the logged-in user
    const employees = await Employee.find({ user: userId });

    const formattedEmployees = employees.map((employee) => ({
      ...employee._doc,
      createdAt: new Date(employee.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    }));

    return res.status(200).json(formattedEmployees);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the employee list." });
  }
};
export const employeeDetails = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateEmployee = async (req, res) => {
  try {
    console.log(req.body);
    const validatedData = validateEmployee(req.body);
    const employeeId = req.params.id;

    const updatedData = {
      name: validatedData.name,
      email: validatedData.email,
      mobileNumber: validatedData.mobileNumber,
      designation: validatedData.designation,
      gender: validatedData.gender,
      course: validatedData.course,
      image: req.file ? req.file.path : undefined,
    };

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    if (error.message) {
      // Return Joi validation error messages
      // console.log(error.message);
      return res.status(400).json({ status: false, error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
      employee: deletedEmployee,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

import Joi from "joi";

const validator = (schema) => (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false });
  if (error) {
    // console.log(error.details);
    const messages = error.details.map((err) => err.message);

    throw new Error(messages.join(", "));
  }
  return value;
};

const signUpSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": `"User Name" should be a type of 'text'`,
    "string.empty": `"User Name" cannot be an empty field`,
    "string.min": `"User Name" should have a minimum length of 3`,
    "string.max": `"User Name" should have a maximum length of 30`,
    "any.required": `"User Name" is a required field`,
  }),
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.base": `"Email" should be a type of 'text'`,
    "string.email": `"Email" must be a valid email`,
    "string.empty": `"Email" cannot be an empty field`,
    "any.required": `"Email" is a required field`,
  }),
  password: Joi.string()
    .trim()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    )
    .required()
    .messages({
      "string.pattern.base": `"Password" must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`,
      "string.empty": `"Password" cannot be an empty field`,
      "any.required": `"Password" is a required field`,
    }),
});

const loginSchema = Joi.object({
  userName: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": `"User Name" should be a type of 'text'`,
    "string.empty": `"User Name" cannot be an empty field`,
    "string.min": `"User Name" should have a minimum length of 3`,
    "string.max": `"User Name" should have a maximum length of 8`,
    "any.required": `"User Name" is a required field`,
  }),
  password: Joi.string()
    .trim()
    .pattern(
      new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})")
    )
    .required()
    .messages({
      "string.pattern.base": `"Password" must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character`,
      "string.empty": `"Password" cannot be an empty field`,
      "any.required": `"Password" is a required field`,
    }),
});

// Joi validation schema for the employee data
const employeeValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": `"User Name" should be a type of 'text'`,
    "string.empty": `"User Name" cannot be an empty field`,
    "string.min": `"User Name" should have a minimum length of 3`,
    "string.max": `"User Name" should have a maximum length of 8`,
    "any.required": `"User Name" is a required field`,
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  mobileNumber: Joi.string()
    .pattern(/^(?!([0-9])\1{9})[0-9]{10}$/, "number")
    .min(10)
    .max(15)
    .required()
    .messages({
      "string.pattern.base":
        "Mobile number must contain only digits, same number should not be repeated",
      "string.min": "Mobile number must be at least 10 digits long",
      "string.max": "Mobile number must not exceed 15 digits",
      "string.empty": "Mobile number is required",
    }),

  designation: Joi.string()
    .valid("HR", "Manager", "Sales")
    .required()
    .messages({
      "any.only": "Designation must be one of HR, Manager, or Sales",
      "string.empty": "Designation is required",
    }),

  gender: Joi.string().valid("Male", "Female").required().messages({
    "any.only": "Gender must be either Male or Female",
    "string.empty": "Gender is required",
  }),

  course: Joi.string().valid("MCA", "BCA", "BSC").required().messages({
    "any.only": "Course must be one of MCA, BCA, or BSC",
    "string.empty": "Course is required",
  }),

  // image: Joi.string().optional(),
  image: Joi.string()
    .optional()
    .custom((value, helpers) => {
      const fileExtension = value.split(".").pop().toLowerCase();
      if (!["png", "jpeg"].includes(fileExtension)) {
        return helpers.message("Image must be a valid png or jpeg file");
      }
      return value;
    }),
  // createdAt: Joi.date()
  //   .default(() => new Date(), "Current date")
  //   .optional(),
});

export const validateEmployee = validator(employeeValidationSchema);
export const validateSignUp = validator(signUpSchema);
export const validateLogIn = validator(loginSchema);

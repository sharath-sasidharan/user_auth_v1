import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User Already Exist", 404));

    //! Hash the password before creating the user
    const passwordHash = await bcrypt.hash(password, 10);
    user = await User.create({
      name,
      email,
      password: passwordHash,
    });

    sendCookie(user, res, "Register Success", 201);
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email }).select("+password");
    //! while login verify the user exist or no, if no will redirect user to register if yes then redirect user to home page

    if (!user) return next(new ErrorHandler("Invalid Email or Password", 404));

    //! Compare the password
    const password_match = await bcrypt.compare(password, user.password);

    //! password does not match
    if (!password_match) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    sendCookie(user, res, "Login Success", 200);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    let users = await User.find();
    res.status(200).json({
      success: "true",
      users,
    });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    let users = await User.findById(id);
    if (!users) return next(new ErrorHandler("User not found", 404));

    sendCookie(users, res, "User Updated Success", 200);
  } catch (err) {
    next(err);
  }
};

export const DeleteUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    let users = await User.findById(id);
    if (!users) return next(new ErrorHandler("User not found", 404));

    users.deleteOne();
    sendCookie(users, res, "User Deleted Success", 200);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  const { id } = req.params;

  try {
    let users = await User.findById(id);
    if (!users) return next(new ErrorHandler("User not found", 404));

    sendCookie(users, res, "User fetched Success", 200);
  } catch (err) {
    next(err);
  }
};

export const logoutUser = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
    secure: process.env.NODE_ENV === "Development" ? false : true,
  });
  res.status(200).json({
    message: "Logout Success",
  });
};

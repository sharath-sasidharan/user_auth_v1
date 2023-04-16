import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  HomePage,
  loginPage,
  registerPage,
  getAllUsers,
  getUser,
  DeleteUser,
  updateUser,
} from "../controllers/user.js";

const router = express.Router();

//! Login the user
router.post("/login", loginUser);

//! Register the user
router.post("/register", registerUser);

//!Get All Users
router.get("/get-users", getAllUsers);

//! Get user by id
router
  .route("/get-users/:id")
  .get(isAuthenticated, getUser)
  .put(isAuthenticated, updateUser)
  .delete(isAuthenticated, DeleteUser);

//! Logout
router.get("/logout", logoutUser);

export default router;

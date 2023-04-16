import express from "express";
import { DeleteTask, addTask, getTask } from "../controllers/task.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new", isAuthenticated, addTask);

router.get("/all", isAuthenticated, getTask);

router.delete("/:id", isAuthenticated, DeleteTask);

export default router;

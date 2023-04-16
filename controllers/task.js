import ErrorHandler from "../middlewares/error.js";
import { Task } from "../models/task.js";

export const addTask = async (req, res, next) => {
  const { title, description } = req.body;
  if (!title || !description) return next(new Error("Required Fields"));
  try {
    let task = await Task.create({
      title,
      description,
      user: req.user,
    });
    res.status(201).json({
      success: true,
      message: "Task Added successfully",
      task,
    });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    let task = await Task.find({ user: req.user._id });
    if (!task) return next(new ErrorHandler("Task not found", 404));

    res.status(201).json({
      success: true,
      message: "Task Fetched successfully",
      task,
    });
  } catch (err) {
    next(err);
  }
};

export const DeleteTask = async (req, res, next) => {
  const { id } = req.params;

  try {
    let task = await Task.findById(id);
    if (!task) return next(new ErrorHandler("Task not found", 404));
    task.deleteOne();

    res.status(200).json({
      success: "true",
      message: "Deleted Task successfully",
    });
  } catch (err) {
    next(err);
  }
};

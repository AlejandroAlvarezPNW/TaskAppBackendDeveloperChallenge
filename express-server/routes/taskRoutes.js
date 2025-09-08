const express = require("express");
const Task = require("../models/Task"); // Import the Task schema
const authMiddleware = require("../middleware/authMiddleware"); // Ensure only authenticated users can access

const router = express.Router();

// Create a new task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const newTask = new Task({ title, description: "Manually Created" , userId: req.user.id });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all tasks for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Update a task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure task belongs to logged-in user
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    task.title = title || task.title;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

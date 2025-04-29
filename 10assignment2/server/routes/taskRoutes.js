const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Task
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, dueDate, status, category, priority } = req.body;
        const task = new Task({ userId: req.user.id, title, description, dueDate, status, category, priority });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Get Tasks
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Update Task
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.userId.toString() !== req.user.id) return res.status(404).json({ message: "Task not found" });

        Object.assign(task, req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

// Delete Task
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task || task.userId.toString() !== req.user.id) return res.status(404).json({ message: "Task not found" });

        await task.remove();
        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).send("Server error");
    }
});

module.exports = router;

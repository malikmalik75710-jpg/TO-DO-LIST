
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let tasks = [];

// Backend test
app.get("/", (req, res) => {
  res.json({
    message: "To Do List Backend is running!"
  });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add task
app.post("/api/tasks", (req, res) => {
  const { text, hobby } = req.body;

  if (!text || !hobby) {
    return res.status(400).json({
      message: "Task and hobby are required"
    });
  }

  const newTask = {
    id: Date.now(),
    text,
    hobby,
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    message: "Task deleted successfully"
  });
});

// Edit and complete task
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const { text, completed } = req.body;

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  if (text !== undefined) {
    task.text = text;
  }

  if (completed !== undefined) {
    task.completed = completed;
  }

  res.json(task);
});

// Vercel serverless export
module.exports = app;

const Task = require("../models/Task");

const getTasks = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 5 } = req.query;

    const filter = { userId: req.user.id };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      tasks,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const createTask = async (req, res) => {
  const { title, description, status } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: "title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }
    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "not authorized" });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "not authorized" });
    }

    await task.deleteOne();

    res.json({ message: "task deleted" });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

const toggleStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "task not found" });
    }

    if (task.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "not authorized" });
    }

    task.status = task.status === "pending" ? "completed" : "pending";
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, toggleStatus };
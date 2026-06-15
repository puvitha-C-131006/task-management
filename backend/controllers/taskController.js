import Task from '../models/Task.js';

// @desc    Get logged in user's tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    
    // Map _id to id for frontend compatibility
    const formattedTasks = tasks.map(task => ({
      ...task.toObject(),
      id: task._id.toString()
    }));
    
    res.json(formattedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedUser } = req.body;

    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedUser,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    
    const formattedTask = {
      ...createdTask.toObject(),
      id: createdTask._id.toString()
    };

    res.status(201).json(formattedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedUser } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this task');
    }

    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.assignedUser = assignedUser !== undefined ? assignedUser : task.assignedUser;

    const updatedTask = await task.save();
    
    const formattedTask = {
      ...updatedTask.toObject(),
      id: updatedTask._id.toString()
    };

    res.json(formattedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Make sure user owns task
    if (task.createdBy.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to delete this task');
    }

    await task.deleteOne();

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

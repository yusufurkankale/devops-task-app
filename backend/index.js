const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
// Fallback to localhost if MONGO_URI is not set
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp';

app.use(cors());
app.use(express.json());

// Simple Todo Model
const todoSchema = new mongoose.Schema({
  title: String,
  completed: Boolean
});
const Todo = mongoose.model('Todo', todoSchema);

// Basic API to connect to frontend
app.get('/api/status', (req, res) => {
  res.json({ message: 'Merhaba! Backend çalışıyor ve veritabanına bağlı.' });
});

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = new Todo({ title: req.body.title, completed: false });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Connect to MongoDB and start server
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, () => {
      console.log(`Backend server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

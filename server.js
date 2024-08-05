const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://vinodxw720:CoNDESvoVLyqTQd3@db29.xcclxio.mongodb.net/?retryWrites=true&w=majority&appName=db29')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Define a schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobileNo: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  address: {
    street: String,
    city: String,
    state: String,
    country: String
  },
  loginId: { type: String, required: true, match: /^[a-zA-Z0-9]{8,}$/ },
  password: { type: String, required: true, minlength: 6 },
  creationTime: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

// Create a model
const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

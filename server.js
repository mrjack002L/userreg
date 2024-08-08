const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb+srv://vinodxw720:CoNDESvoVLyqTQd3@db29.xcclxio.mongodb.net/?retryWrites=true&w=majority&appName=db29')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, match: /^[a-zA-Z\s]+$/ },
  lastName: { type: String, required: true, match: /^[a-zA-Z\s]+$/ },
  mobileNo: { type: String, required: true, match: /^\d{10}$/ },
  email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  address: {
    street: { type: String, match: /^[a-zA-Z0-9\s,.'-]{3,}$/ },
    city: { type: String, match: /^[a-zA-Z\s]+$/ },
    state: { type: String, match: /^[a-zA-Z\s]+$/ },
    country: { type: String, match: /^[a-zA-Z\s]+$/ }
  },
  loginId: { type: String, required: true, match: /^[a-zA-Z0-9]{8,}$/ },
  password: { type: String, required: true, match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/ },
  creationTime: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/profile/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

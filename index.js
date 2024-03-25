import express from "express";
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { UserInfo, WorkInfo } from "./model/data.js";


const app = express();
const password = 'password123';
const salt = bcrypt.genSaltSync(10);
// No router or controller folder :(

app.use(express.json());  // Middleware

await mongoose.connect('mongodb+srv://s3924462:s3924462@test.abo4prq.mongodb.net/?retryWrites=true&w=majority&appName=Test').then(() => {
    console.log("Yes we have connected to database")
});

//!! Authentication
// REGISTER
app.post('/register', async (req, res) => {
  try {
      const { username, password, full_name, date_of_birth, birth_location, nationality } = req.body;

      // Check existing username
      const existingUser = await UserInfo.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
      }

      // Hashing passwords
      const hashedPassword = await bcrypt.hash(password, 10);

      // Creating new user personal info and data
      const newUserPersonalInfo = await UserInfo.create({ 
        full_name, 
        date_of_birth, 
        birth_location, 
        nationality });
      const newUser = await User.create({ 
        username, 
        password: hashedPassword, 
        personal_info: newUserPersonalInfo._id });

      res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find username
    const user = await UserInfo.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check correct password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logout successful' });
});

//!! User info
// Create new user info
app.post('/userinfo', async (req, res) => {
  try {
      const userInfo = await UserInfo.create(req.body);
      res.status(201).json(userInfo);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Get user info
app.get('/userinfo', async (req, res) => {
  try {
      const userInfos = await UserInfo.find();
      res.json(userInfos);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Update user info by ID
app.put('/userinfo/:id', async (req, res) => {
  try {
      const userInfo = await UserInfo.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(userInfo);
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

// Delete user info by ID
app.delete('/userinfo/:id', async (req, res) => {
  try {
      await UserInfo.findByIdAndDelete(req.params.id);
      res.json({ message: 'User info deleted successfully' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

//!! Work info
// Create new work info
app.post("/workinfo", async (req, res) => {
  try {
    const workInfo = await WorkInfo.create(req.body);
    res.status(201).json({ message: "Work info created successfully", data: workInfo });
  } catch (error) {
    res.status(500).json({ message: "Failed to create work info", error: error.message });
  }
});

// Get work info
app.get("/workinfo", async (req, res) => {
  try {
    const workInfos = await WorkInfo.find();
    res.status(200).json({ message: "Get work infos successfully", data: workInfos });
  } catch (error) {
    res.status(500).json({ message: "Failed to get work infos", error: error.message });
  }
});

// Get work info by ID
app.get("/workinfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const workInfo = await WorkInfo.findById(id);
    if (!workInfo) {
      return res.status(404).json({ message: "Work info not found" });
    }
    res.status(200).json({ message: "Get work info successfully", data: workInfo });
  } catch (error) {
    res.status(500).json({ message: "Failed to get work info", error: error.message });
  }
});

// Update work info by ID
app.put("/workinfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedWorkInfo = await WorkInfo.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedWorkInfo) {
      return res.status(404).json({ message: "Work info not found" });
    }
    res.status(200).json({ message: "Update work info successfully", data: updatedWorkInfo });
  } catch (error) {
    res.status(500).json({ message: "Failed to update work info", error: error.message });
  }
});

// Delete work info by ID
app.delete("/workinfo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedWorkInfo = await WorkInfo.findByIdAndDelete(id);
    if (!deletedWorkInfo) {
      return res.status(404).json({ message: "Work info not found" });
    }
    res.status(200).json({ message: "Delete work info successfully", data: deletedWorkInfo });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete work info", error: error.message });
  }
});

app.listen(8000, () => {
    console.log('Server is running!');
});

// mongodb+srv://s3924462:s3924462@test.abo4prq.mongodb.net/?retryWrites=true&w=majority&appName=Test
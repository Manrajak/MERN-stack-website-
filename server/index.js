import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import EmployeeModel from "./models/Employee.js";
import AgentModel from './models/Agent.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Import list routes (convert to ES module if needed)
import listRoutes from './routes/list.js';
import auth from './middleware/auth.js';

dotenv.config({path : './.env'});
// console.log(process.env.mongoDb);

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    "https://mern-stack-website-quab.vercel.app",
    "https://mern-stack-website-quab-dv4xg4s7v-manrajaks-projects.vercel.app"
  ]
}));

// Use .env for MongoDB connection
mongoose.connect(
process.env.mongoDb
);

// Registration: hash password and check for existing email
app.post("/register", async (req, res) => {
  const { name, email, password, mobile } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await EmployeeModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (user) {
      return res.status(400).json({ success: false, error: "Email already exists!" });
    }
    const newUser = await EmployeeModel.create({ ...req.body, password: hashedPassword });
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login: verify password, return JWT
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await EmployeeModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ success: true, token });
    }
    res.status(401).json({ success: false, error: "Invalid credentials" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add this line to use list upload routes
app.use('/api/list', auth, listRoutes);

// Add Agent (with password hashing and country code validation)
app.post("/agents", auth, async (req, res) => {
  const { name, email, mobile, password } = req.body;
  if (!/^\+\d{10,}$/.test(mobile)) {
    return res.status(400).json({ success: false, error: "Mobile number must include country code (e.g. +911234567890)" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existing = await AgentModel.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (existing) return res.status(400).json({ success: false, error: "Agent email already exists" });
    const agent = await AgentModel.create({ name, email, mobile, password: hashedPassword });
    res.json({ success: true, agent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all agents (hide password)
app.get("/agents", async (req, res) => {
  try {
    const agents = await AgentModel.find({}, { password: 0 });
    res.json({ success: true, agents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Protect agent deletion with JWT auth
app.delete("/agents/:id", auth, async (req, res) => {
  try {
    await AgentModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get('/', (req, res) => {
  res.send('MERN Stack API is running.');
});

app.listen(5000, () => {
  console.log("server is running");
});

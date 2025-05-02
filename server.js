// Import necessary packages
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Load environment variables from .env file
dotenv.config();

// Initialize Express App
const app = express();
const PORT = 8080;

// Middleware Setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(bodyParser.json()); // Parse JSON body (redundant with express.json but kept)

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://norhangamal298:dtKOXI4k1QF4bxJi@mydbdata.z73pk.mongodb.net/?retryWrites=true&w=majority&appName=mydbdata"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    throw new Error("MongoDB connection failed");
  });

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Pre-save Hook: Hash password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create User Model
const User = mongoose.model("User", userSchema);

// ---------------- Routes ---------------- //

// Sign-Up Route
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    console.log("Signup request received:", req.body);

    // Create and save new user
    const user = new User({ firstName, lastName, email, password });
    await user.save();

    console.log("User created successfully:", user);
    res.status(201).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token: "dummy-token", // Replace with real token (JWT) later
    });
  } catch (err) {
    console.error("Error during signup:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Sign-In Route
app.post("/api/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Successful login
    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token: "dummy-token", // Replace with real token (JWT) later
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch User Profile by Email
app.get("/api/profile", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const fullName = `${user.firstName} ${user.lastName}`;
    res.json({
      fullName,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------- Quiz Result Management ---------------- //

// Define Quiz Result Schema
const quizResultSchema = new mongoose.Schema({
  email: { type: String, required: true },
  quizId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// Create Quiz Result Model
const QuizResult = mongoose.model("QuizResult", quizResultSchema);

// Save or Update Quiz Results
app.post("/api/quiz-results", async (req, res) => {
  const { email, quizId, score, totalQuestions } = req.body;

  if (!email || !quizId) {
    return res.status(400).json({ error: "Email and Quiz ID are required" });
  }

  try {
    const existingResult = await QuizResult.findOne({ email, quizId });

    if (existingResult) {
      // Update existing quiz result
      existingResult.score = score;
      existingResult.totalQuestions = totalQuestions;
      await existingResult.save();
      res
        .status(200)
        .json({
          message: "Quiz result updated successfully",
          result: existingResult,
        });
    } else {
      // Save new quiz result
      const newResult = new QuizResult({
        email,
        quizId,
        score,
        totalQuestions,
      });
      await newResult.save();
      res
        .status(201)
        .json({ message: "Quiz result saved successfully", result: newResult });
    }
  } catch (error) {
    console.error("Error saving or updating quiz result:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Quiz Results for a Specific User
app.get("/api/quiz-results/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const results = await QuizResult.find({ email });
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- User Progress Management ---------------- //

// Define User Progress Schema
const userProgressSchema = new mongoose.Schema({
  email: { type: String, required: true },
  topicId: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

// Create User Progress Model
const UserProgress = mongoose.model("UserProgress", userProgressSchema);

// Update User Progress (Mark topic as completed)
app.post("/api/update-progress", async (req, res) => {
  const { email, topicId } = req.body;

  if (!email || !topicId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existingProgress = await UserProgress.findOne({ email, topicId });

    if (existingProgress) {
      existingProgress.completed = true;
      await existingProgress.save();
      res.status(200).json({ message: "Progress updated successfully" });
    } else {
      const newProgress = new UserProgress({ email, topicId, completed: true });
      await newProgress.save();
      res.status(201).json({ message: "Progress saved successfully" });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch All Progress for a Specific User
app.get("/api/user-progress/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const progress = await UserProgress.find({ email });

    // Transform list to { topicId: completed } format
    const progressMap = {};
    progress.forEach((item) => {
      progressMap[item.topicId] = item.completed;
    });

    res.status(200).json(progressMap);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------------- User Profile Management ---------------- //

// Update User Profile by User ID
app.patch("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update User Password
app.post("/api/update-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const email = req.query.email; // Get email from query parameters
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Start Express Server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

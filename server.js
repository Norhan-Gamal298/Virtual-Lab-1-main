// Import necessary packages
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

// Initialize Express App
const app = express();
const PORT = 8080;

// Middleware Setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(bodyParser.json()); // Parse JSON body (redundant with express.json but kept)

// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
  role: { type: String, enum: ["user", "admin", "root"], default: "user" },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save Hook: Hash password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Create User Model
const User = mongoose.model("User", userSchema);

// Define Note Schema
const noteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  topicId: { type: String, required: true },
  videoSrc: { type: String, required: true },
  notes: [
    {
      time: { type: Number, required: true },
      text: { type: String, required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create Note Model
const Note = mongoose.model("Note", noteSchema);

// Define Quiz Schema
const quizSchema = new mongoose.Schema({
  chapterId: { type: Number, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

// Create Quiz Model
const Quiz = mongoose.model("Quiz", quizSchema);

// ---------------- Routes ---------------- //

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !["admin", "root"].includes(user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};



const Chapter = mongoose.model('Chapter', new mongoose.Schema({
  chapterId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  order: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const Topic = mongoose.model('Topic', new mongoose.Schema({
  chapterId: { type: Number, required: true },
  topicId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  images: [{
    filename: String,
    data: Buffer,
    contentType: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));





// Get all chapters
app.get('/api/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.find().sort({ order: 1 }).lean();
    const safeChapters = (chapters || []).map(ch => ({
      chapterId: ch.chapterId,
      title: ch.title,
      description: ch.description,
      order: ch.order
    }));
    res.json(safeChapters);
  } catch (error) {
    res.status(500).json({ chapters: [], error: 'Failed to fetch chapters' });
  }
});

// Chapter CRUD operations
app.post('/api/admin/chapters', adminAuth, async (req, res) => {
  try {
    const lastChapter = await Chapter.findOne().sort({ order: -1 });
    const newChapter = new Chapter({
      ...req.body,
      order: lastChapter ? lastChapter.order + 1 : 1
    });
    await newChapter.save();
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/chapters/:id', adminAuth, async (req, res) => {
  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedChapter);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/admin/chapters/:id', adminAuth, async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);
    // Delete associated topics
    await Topic.deleteMany({ chapterId: req.body.chapterId });
    res.json({ message: 'Chapter deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Topic CRUD operations
app.get('/api/topics/:topicId', async (req, res) => {
  try {
    const topic = await Topic.findOne({ topicId: req.params.topicId });
    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/topics', adminAuth, async (req, res) => {
  try {
    const { chapterId, content, ...topicData } = req.body;

    // Process images from content
    const imageRegex = /!\[.*?\]\(data:image\/(.*?);base64,(.*?)\)/g;
    let processedContent = content;
    const images = [];
    let match;
    let imgIndex = 0;

    while ((match = imageRegex.exec(content)) !== null) {
      const contentType = match[1];
      const base64Data = match[2];
      const filename = `image-${Date.now()}-${imgIndex++}.${contentType.split(';')[0]}`;

      images.push({
        filename,
        contentType: `image/${contentType}`,
        data: Buffer.from(base64Data, 'base64')
      });

      processedContent = processedContent.replace(match[0], `![${filename}](images/${filename})`);
    }

    const lastTopic = await Topic.findOne({ chapterId }).sort({ order: -1 });
    const newTopic = new Topic({
      ...topicData,
      chapterId,
      content: processedContent,
      images,
      order: lastTopic ? lastTopic.order + 1 : 1
    });

    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/admin/topics/:id', adminAuth, async (req, res) => {
  try {
    // Similar image processing as in POST
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedTopic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/admin/topics/:id', adminAuth, async (req, res) => {
  try {
    await Topic.findByIdAndDelete(req.params.id);
    res.json({ message: 'Topic deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve topic images
app.get('/api/topics/:topicId/images/:filename', async (req, res) => {
  try {
    const topic = await Topic.findOne({ topicId: req.params.topicId });
    const image = topic.images.find(img => img.filename === req.params.filename);

    if (image) {
      res.set('Content-Type', image.contentType);
      res.send(image.data);
    } else {
      res.status(404).send('Image not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder endpoints
app.post('/api/admin/reorder/chapters', adminAuth, async (req, res) => {
  try {
    const { orderMap } = req.body;
    for (const [id, order] of Object.entries(orderMap)) {
      await Chapter.findByIdAndUpdate(id, { order });
    }
    res.json({ message: 'Chapters reordered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin/reorder/topics', adminAuth, async (req, res) => {
  try {
    const { chapterId, orderMap } = req.body;
    for (const [id, order] of Object.entries(orderMap)) {
      await Topic.findByIdAndUpdate(id, { order });
    }
    res.json({ message: 'Topics reordered' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});












// Temporary admin creation route (remove after use!)
// Add this with your other routes in server.js

// TEST ROUTE - TEMPORARY
// Add this right before app.listen()
app.get("/api/test-users", async (req, res) => {
  try {
    console.log("Attempting to create test users...");

    // Test users data
    const testUsers = [
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
      },
      {
        firstName: "Regular",
        lastName: "User",
        email: "user@test.com",
        password: "password123",
        role: "user",
      },
    ];

    // Create users if they don't exist
    for (const user of testUsers) {
      const exists = await User.findOne({ email: user.email });
      if (!exists) {
        const newUser = new User(user);
        await newUser.save();
        console.log(`Created test user: ${user.email}`);
      } else {
        console.log(`User ${user.email} already exists`);
      }
    }

    // Return all users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database`);
    res.json(users);
  } catch (error) {
    console.error("Test route error:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
});

// // Then start your server
// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });

app.get("/api/admin/users", adminAuth, async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};

    if (role === "admin") {
      filter.role = { $in: ["admin", "root"] };
    } else if (role === "user") {
      filter.role = "user";
    }

    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Verify admin role
    if (!["admin", "root"].includes(user.role)) {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 5. Send response
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Block/unblock user
app.patch("/api/admin/users/:id/block", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this to your server.js
// Add this with your other routes in server.js
/* app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 3. Verify admin role
    if (!['admin', 'root'].includes(user.role)) {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5. Send response
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
}); */

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
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "Account is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token,
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
      res.status(200).json({
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

// ---------------- Notes Management ---------------- //
app.get("/api/notes", async (req, res) => {
  const { userEmail, topicId } = req.query;

  if (!userEmail || !topicId) {
    return res
      .status(400)
      .json({ error: "userEmail and topicId are required" });
  }

  try {
    const note = await Note.findOne({ userEmail, topicId });
    if (!note) {
      return res.status(404).json({ error: "No notes found for this topic" });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/notes", async (req, res) => {
  const { userEmail, topicId, videoSrc, notes } = req.body;

  if (!userEmail || !topicId || !videoSrc || !notes) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let note = await Note.findOne({ userEmail, topicId });

    if (note) {
      note.notes = notes;
      note.updatedAt = Date.now();
      await note.save();
      res.status(200).json({ message: "Notes updated successfully", note });
    } else {
      note = new Note({ userEmail, topicId, videoSrc, notes });
      await note.save();
      res.status(201).json({ message: "Notes created successfully", note });
    }
  } catch (error) {
    console.error("Error saving notes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// ---------------- Quiz Fetch Route ---------------- //
app.get("/api/quizzes/:chapterId", async (req, res) => {
  try {
    const chapterId = parseInt(req.params.chapterId, 10);
    const questions = await Quiz.find({ chapterId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

// ---------------- Start Express Server ---------------- //
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

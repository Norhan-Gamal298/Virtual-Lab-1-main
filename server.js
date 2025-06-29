// Import necessary packages
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import { Buffer } from "buffer";
import fs from "fs";
import ExcelJS from "exceljs";
import PdfPrinter from "pdfmake";
// import htmlPdf from 'html-pdf';
import path from "path";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { fileURLToPath } from "url";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express App
const app = express();
const PORT = 8080;
// Middleware Setup
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
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

// Add this function to your server
function formatContent(content) {
  // Simple markdown to HTML conversion
  return content
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
    .replace(/\*(.*?)\*/g, "<em>$1</em>") // italic
    .replace(/\n/g, "<br>") // line breaks
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>'); // links
}

const generateReport = async (res, data, headers, fileName, format) => {
  if (format === "xlsx") {
    // Excel generation
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    worksheet.columns = headers.map((header) => ({
      header: header.label,
      key: header.key,
      width: header.width,
    }));

    data.forEach((item) => worksheet.addRow(item));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } else if (format === "pdf") {
    // PDF generation
    const fonts = {
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);

    // Calculate column widths based on header lengths
    const colWidths = headers.map((h) => {
      const headerLength = h.label.length;
      // Base width + extra space for content
      return Math.max(headerLength * 7, 80);
    });

    // Prepare data rows with proper formatting
    const bodyRows = data.map((row) =>
      headers.map((h) => {
        const value = row[h.key];
        // Format dates and long text
        if (h.key.includes("Date") || h.key.includes("At")) {
          return { text: value, style: "dateCell" };
        } else if (value.length > 30) {
          return { text: value, style: "wrapCell" };
        }
        return value;
      })
    );

    const docDefinition = {
      pageOrientation: "landscape",
      pageMargins: [40, 40, 40, 40], // Increased page width
      content: [
        {
          text: fileName,
          style: "header",
          margin: [0, 0, 0, 20], // Reduced margin for the title
        },
        {
          table: {
            headerRows: 1,
            widths: colWidths,
            body: [
              headers.map((h) => ({
                text: h.label,
                style: "tableHeader",
                margin: [5, 4, 5, 4], // Add padding to header cells
              })),
              ...bodyRows.map((row) =>
                row.map((cell) => ({
                  text: typeof cell === "object" ? cell.text : cell,
                  style: typeof cell === "object" ? cell.style : "tableCell",
                  margin: [5, 4, 5, 4], // Add padding to body cells
                }))
              ),
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex === 0 ? "#dddddd" : null),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
        },
        tableCell: {
          fontSize: 9,
          lineHeight: 1.2,
        },
        dateCell: {
          fontSize: 9,
        },
        wrapCell: {
          fontSize: 8,
          lineHeight: 1.1,
        },
        defaultStyle: {
          fontSize: 10,
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}.pdf`
    );
    pdfDoc.pipe(res);
    pdfDoc.end();
  }
};

// Users Report

// Example for UsersManagement.jsx
const downloadReport = (format) => {
  const url = `http://localhost:8080/api/report/users?format=${format}`;
  window.open(url, "_blank");
};

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin", "root"],
    default: "user",
    validate: {
      validator: function (v) {
        if (this.isModified("role") && this._originalRole === "root") {
          return false;
        }
        return true;
      },
      message: "Cannot modify root administrator role",
    },
  },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  profileImage: {
    data: Buffer,
    contentType: String,
    filename: String
  },
  createdAt: { type: Date, default: Date.now },
  phoneNumber: { type: String },
  gender: { type: String },
  country: { type: String },
  dateOfBirth: { type: Date },
  educationalLevel: {
    type: String,
    enum: ["", "High School", "University", "Bachelor's", "Master's", "Doctorate", "Other"],
    required: false // Make optional
  },
  fieldOfStudy: {
    type: String,
    required: false,
  },
  professionalStatus: {
    type: String,
    enum: ["", "Student", "Instructor", "Researcher", "Employed", "Self-employed", "Unemployed", "Retired"],
    required: false // Make optional
  },
  emailNotifications: { type: Boolean, default: false },
  timeZone: { type: String },
  lastActive: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 0 },
  lastLogin: { type: Date },
});




// Pre-save Hook: Hash password before saving to DB
// Add pre-save hook to track original role
userSchema.pre("save", function (next) {
  this._originalRole = this.role;
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

// Topic Schema & Model
const topicSchema = new mongoose.Schema(
  {
    chapterId: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    topicId: { type: String, required: true },
    title: { type: String, required: true },
    markdownPath: { type: String, required: true },
    videoPath: { type: String },
    images: [
      {
        filename: String,
        data: Buffer,
        contentType: String,
      },
    ],
  },
  { timestamps: true }
);

const tokenBlacklist = new Set();

// Middleware to check blacklisted tokens
const checkBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token && tokenBlacklist.has(token)) {
    return res.status(401).json({ error: "Token revoked" });
  }
  next();
};

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);

// 1. Define the Blog schema
const blogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
});
// 2. Create the Blog model
const Blog = mongoose.model("Blog", blogSchema);

// Create a new blog
app.post("/api/blogs", async (req, res) => {
  try {
    const { title, author, content, image } = req.body;
    if (!title || !author || !content) {
      return res
        .status(400)
        .json({ error: "Title, author, and content are required" });
    }

    const blog = new Blog({
      title,
      author,
      content,
      formattedContent: content, // You can format this if needed
      excerpt:
        content.replace(/\n/g, " ").slice(0, 120) +
        (content.length > 120 ? "..." : ""),
      image,
      createdAt: new Date(),
    });

    await blog.save();

    await logActivity(req.user._id, req.user.email, 'blog_created', {
      blogId: blog._id,
      title: blog.title
    });

    res.status(201).json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create blog", details: error.message });
  }
});


// Activity Log Schema
const activityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, required: true },
  actionType: {
    type: String,
    required: true,
    enum: [
      // User actions
      'user_registered',
      'user_logged_in',
      'topic_completed',
      'quiz_attempted',

      // Admin actions
      'blog_created',
      'blog_updated',
      'blog_deleted',
      'chapter_created',
      'chapter_updated',
      'chapter_deleted',
      'topic_created',
      'topic_updated',
      'topic_deleted',
      'quiz_created',
      'quiz_updated',
      'quiz_deleted'
    ]
  },
  details: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);


// Utility function to log activities
const logActivity = async (userId, userEmail, actionType, details = {}) => {
  try {
    const activity = new ActivityLog({
      userId,
      userEmail,
      actionType,
      details
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Configure multer for image uploads
const blogImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/blog-images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const blogImageUpload = multer({ storage: blogImageStorage });

// Add this endpoint for image uploads
app.post(
  "/api/upload-blog-image",
  blogImageUpload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({
      url: `/uploads/blog-images/${req.file.filename}`,
    });
  }
);

// Make sure to serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const profileImageStorage = multer.memoryStorage(); // Store in memory for database storage
const profileImageUpload = multer({
  storage: profileImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG files are allowed'), false);
    }
  }
});





// 5. Get profile image endpoint
app.get("/api/profile/image/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.profileImage || !user.profileImage.data) {
      return res.status(404).json({ error: "Profile image not found" });
    }

    // Convert binary data to buffer
    const imgBuffer = Buffer.from(user.profileImage.data.buffer);

    res.set({
      'Content-Type': user.profileImage.contentType,
      'Content-Length': imgBuffer.length,
      'Cache-Control': 'public, max-age=86400' // Cache for 1 day
    });

    res.send(imgBuffer);
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ error: "Failed to fetch profile image" });
  }
});



// ---------------- Routes ---------------- //

const adminAuth = [
  checkBlacklist,
  async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(403).json({ error: "User not found" });
      }
      if (user.isBlocked) {
        return res.status(403).json({ error: "Account is blocked" });
      }

      // Check if user is admin or root
      if (!["admin", "root"].includes(user.role)) {
        return res.status(403).json({ error: "Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token", details: error.message });
    }
  },
];


const userAuth = [
  checkBlacklist,
  async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(403).json({ error: "User not found" });
      }
      if (user.isBlocked) {
        return res.status(403).json({ error: "Account is blocked" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token", details: error.message });
    }
  },
];


const hasProfileImage = (user) => {
  return user.profileImage && user.profileImage.data && user.profileImage.data.length > 0;
};

app.post("/api/profile/upload-image", userAuth, profileImageUpload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Save image data to user document
    user.profileImage = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname
    };

    await user.save();

    res.json({
      message: "Profile image uploaded successfully",
      imageId: user._id,
      hasProfileImage: true // Add this line
    });
  } catch (error) {
    console.error("Profile image upload error:", error);
    res.status(500).json({ error: "Failed to upload profile image" });
  }
});


app.delete("/api/profile/image", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profileImage = undefined;
    await user.save();

    res.json({
      message: "Profile image deleted successfully",
      hasProfileImage: false // Add this line
    });
  } catch (error) {
    console.error("Error deleting profile image:", error);
    res.status(500).json({ error: "Failed to delete profile image" });
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

    // 2. Check if account is blocked
    if (user.isBlocked) {
      return res.status(403).json({ error: "Account is blocked" });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // 4. Verify admin role
    if (!["admin", "root"].includes(user.role)) {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // 5. Create JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6. Send response
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        hasProfileImage: hasProfileImage(user) // Add this line
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

    // Prevent blocking root admin
    if (user.role === "root") {
      return res.status(403).json({ error: "Cannot block root administrator" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    // Add token to blacklist if blocking
    if (user.isBlocked) {
      const token = req.headers.authorization.split(" ")[1];
      tokenBlacklist.add(token);
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Make sure this route is defined in your server.js
app.patch("/api/admin/users/:id/role", adminAuth, async (req, res) => {
  try {
    const requestingUser = req.user;
    const targetUserId = req.params.id;
    const { role } = req.body;

    // Only root admin can change roles
    if (requestingUser.role !== "root") {
      return res
        .status(403)
        .json({ error: "Only root administrator can change roles" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) return res.status(404).json({ error: "User not found" });
    if (targetUser.role === "root") {
      return res
        .status(403)
        .json({ error: "Cannot modify root administrator role" });
    }

    // Validate new role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    targetUser.role = role;
    await targetUser.save();

    res.json({
      message: `User role updated to ${role}`,
      user: {
        id: targetUser._id,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign-Up Route
app.post("/api/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    gender,
    country,
    dateOfBirth,
    educationalLevel, // Default value
    fieldOfStudy,
    professionalStatus, // Default value
    emailNotifications,
    timeZone
  } = req.body;

  try {
    // Validate all required fields
    if (!firstName || !lastName || !email || !password || !country || !dateOfBirth) {
      return res.status(400).json({ error: "All required fields must be completed" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }


    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Signup request received:", req.body);

    // Create and save new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      phoneNumber,
      gender,
      country,
      dateOfBirth,
      educationalLevel,
      fieldOfStudy,
      professionalStatus,
      emailNotifications,
      timeZone,
    });
    await user.save();
    await logActivity(user._id, user.email, 'user_registered', {
      firstName: user.firstName,
      lastName: user.lastName
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your gmail address
        pass: process.env.GMAIL_PASS, // your gmail app password
      },
    });
    const verifyUrl = `http://localhost:8080/api/verify-email?token=${verificationToken}&email=${email}`;
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Please verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Welcome to virtual Lab!</h2>
        <p>Thank you for signing up. We're excited to have you on board.</p>
        <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
        <p style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
      </p>
        <p>If the button above doesn't work, you can also verify your email by copying and pasting the following link into your browser:</p>
        <p style="word-break: break-all;"><a href="${verifyUrl}">${verifyUrl}</a></p>
      <hr>
        <p style="font-size: 0.9em; color: #777;">If you did not create an account with virtual Lab, please disregard this message.</p>
        <p style="font-size: 0.9em; color: #777;">This verification link will expire in 24 hours for your security.</p>
      </div>
`,
    });

    await logActivity(user._id, user.email, 'user_registered', {
      firstName: user.firstName,
      lastName: user.lastName
    });
    console.log("User created successfully:", user);
    res.status(201).json({ success: true }); // Just return success
  } catch (err) {
    console.error("Error during signup:", err);
    if (err.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// Email Verification Route
app.get("/api/verify-email", async (req, res) => {
  const { token, email } = req.query;
  try {
    const user = await User.findOne({ email, verificationToken: token });
    if (!user) {
      return res.status(400).send("Invalid verification link.");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.send("Email verified successfully! You can now log in.");
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).send("Server error.");
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

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.lastActive = new Date();
    user.loginCount += 1;
    user.lastLogin = new Date();

    await user.save();
    await logActivity(user._id, user.email, 'user_logged_in');
    res.status(200).json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        hasProfileImage: hasProfileImage(user) // Add this line

      },
      token,
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//reset password request route
app.post("/api/request-reset-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = resetToken;
    await user.save();

    // Send reset email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p style="font-size: 16px; color: #555;">
          You recently requested to reset your password for your Virtual Lab account. Click the button below to proceed:
        </p>
        <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Password
        </a>
        </div>
        <p style="font-size: 14px; color: #555;">
         Or copy and paste the following link into your browser if the button doesn't work:
        </p>
        <p style="word-break: break-all; color: #007BFF;">${resetUrl}</p>
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 13px; color: #999;">
          If you didn’t request a password reset, you can safely ignore this email—your password will not be changed.
        </p>
        <p style="font-size: 13px; color: #999;">
          This link will expire in 30 minutes for your security.
        </p>
        <p style="font-size: 13px; color: #999;">
          Need help? Contact our support team or reply to this email.
        </p>
      </div>
  `,
    });

    res.json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error in password reset request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reset Password Route
app.post("/api/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const user = await User.findOne({ email, verificationToken: token });
    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });

    user.password = newPassword;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Fetch User Profile by Email
app.get("/api/profile", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        hasProfileImage: hasProfileImage(user) // Add this line
      }
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.get("/api/report/users", adminAuth, async (req, res) => {
  try {
    const format = req.query.format || "pdf";
    const users = await User.find()
      .select("-password -verificationToken")
      .lean();

    const headers = [
      { key: "firstName", label: "First Name", width: 15 },
      { key: "lastName", label: "Last Name", width: 15 },
      { key: "email", label: "Email", width: 30 },
      { key: "role", label: "Role", width: 10 },
      { key: "createdAt", label: "Created At", width: 20 },
      { key: "isBlocked", label: "Blocked", width: 10 },
    ];

    const data = users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt).toLocaleString(),
      isBlocked: user.isBlocked ? "Yes" : "No",
    }));

    await generateReport(res, data, headers, "users-report", format);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate report", details: error.message });
  }
});

// Content Report
app.get("/api/report/content", adminAuth, async (req, res) => {
  try {
    const format = req.query.format || "pdf";
    const topics = await Topic.find().lean();

    const headers = [
      { key: "chapterId", label: "Chapter ID", width: 10 },
      { key: "chapterTitle", label: "Chapter Title", width: 25 },
      { key: "title", label: "Topic Title", width: 25 },
      { key: "topicId", label: "Topic ID", width: 15 },
      { key: "createdAt", label: "Created At", width: 20 },
    ];

    const data = topics.map((topic) => ({
      ...topic,
      createdAt: new Date(topic.createdAt).toLocaleString(),
    }));

    await generateReport(res, data, headers, "content-report", format);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate report", details: error.message });
  }
});

// Quiz Report
app.get("/api/report/quiz", adminAuth, async (req, res) => {
  try {
    const format = req.query.format || "pdf";
    const quizzes = await Quiz.find().lean();

    const headers = [
      { key: "chapterId", label: "Chapter ID", width: 10 },
      { key: "question", label: "Question", width: 40 },
      { key: "options", label: "Options", width: 30 },
      { key: "answer", label: "Answer", width: 20 },
    ];

    const data = quizzes.map((quiz) => ({
      ...quiz,
      options: quiz.options.join(", "),
    }));

    await generateReport(res, data, headers, "quiz-report", format);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate report", details: error.message });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch blogs", details: error.message });
  }
});

app.put("/api/blogs/:id", async (req, res) => {
  try {
    const { title, author, content, image } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        author,
        content,
        excerpt:
          content.replace(/\n/g, " ").slice(0, 120) +
          (content.length > 120 ? "..." : ""),
        image,
      },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    await logActivity(req.user._id, req.user.email, 'blog_updated', {
      blogId: req.params.id,
      title: blog.title,
      changes: req.body
    });

    res.json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update blog", details: error.message });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: Number(req.params.id) });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch blog", details: error.message });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Update an existing blog
app.put("/api/blogs/:id", async (req, res) => {
  try {
    const { title, author, content, image } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, author, content, image },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    await logActivity(req.user._id, req.user.email, 'blog_updated', {
      blogId: req.params.id,
      title: blog.title,
      changes: req.body
    });
    res.json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update blog", details: error.message });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: Number(req.params.id) });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch blog", details: error.message });
  }
});

app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    await logActivity(req.user._id, req.user.email, 'blog_deleted', {
      blogId: req.params.id,
      title: blog.title
    });

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete blog", details: error.message });
  }
});

// Blogs Report
app.get("/api/report/blogs", adminAuth, async (req, res) => {
  try {
    const format = req.query.format || "pdf";
    const blogs = await Blog.find().lean();

    const headers = [
      { key: "title", label: "Title", width: 30 },
      { key: "author", label: "Author", width: 20 },
      { key: "createdAt", label: "Created At", width: 20 },
      { key: "excerpt", label: "Excerpt", width: 40 },
    ];

    const data = blogs.map((blog) => ({
      ...blog,
      createdAt: new Date(blog.createdAt).toLocaleString(),
      excerpt: blog.excerpt || blog.content.substring(0, 100) + "...",
    }));

    await generateReport(res, data, headers, "blogs-report", format);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate report", details: error.message });
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
      const user = await User.findOne({ email });

      await logActivity(user._id, user.email, 'quiz_attempted', {
        quizId,
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
      });

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
// In your /api/update-progress endpoint
app.post("/api/update-progress", async (req, res) => {
  const { email, topicId } = req.body;

  try {
    // First check if topic exists
    const topicExists = await Topic.exists({ topicId });
    if (!topicExists) {
      return res.status(400).json({ error: "Topic does not exist" });
    }

    // Use updateOne with upsert to prevent duplicates
    await UserProgress.updateOne(
      { email, topicId },
      { $set: { completed: true } },
      { upsert: true }
    );

    const user = await User.findOne({ email });
    const topic = await Topic.findOne({ topicId });

    await logActivity(user._id, user.email, 'topic_completed', {
      topicId,
      topicTitle: topic?.title || 'Unknown',
      chapterTitle: topic?.chapterTitle || 'Unknown'
    });

    res.status(200).json({ message: "Progress updated successfully" });
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
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
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
// app.get("/api/quizzes/:chapterId", async (req, res) => {
//   try {
//     const chapterId = parseInt(req.params.chapterId, 10);
//     const questions = await Quiz.find({ chapterId });
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch quiz questions" });
//   }
// });

app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch quizzes", details: error.message });
  }
});

// Get all questions for a chapter
app.get("/api/quizzes/:chapterId", async (req, res) => {
  try {
    const questions = await Quiz.find({ chapterId: req.params.chapterId });
    res.json(questions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch questions", details: error.message });
  }
});

app.get("/api/quizs/all", async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions); //  Send array directly
  } catch (err) {
    console.error("Error fetching quizzes:", err); // 🔍 Add this for debugging
    res.status(500).json({ error: "Failed to fetch quiz questions" });
  }
});

// POST add a new quiz question
app.post("/api/quizs", async (req, res) => {
  try {
    const { chapterId, question, options, answer } = req.body;
    if (!chapterId || !question || !options || !answer) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const quiz = new Quiz({ chapterId, question, options, answer });
    await quiz.save();
    await logActivity(req.user._id, req.user.email, 'quiz_created', {
      quizId: quiz._id,
      chapterId: quiz.chapterId,
      question: quiz.question
    });
    res.status(201).json(quiz);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add question", details: error.message });
  }
});

// PUT update a quiz question
app.put("/api/quizzes/:id", async (req, res) => {
  try {
    const { chapterId, question, options, answer } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { chapterId, question, options, answer },
      { new: true }
    );
    if (!quiz) return res.status(404).json({ error: "Question not found" });
    await logActivity(req.user._id, req.user.email, 'quiz_updated', {
      quizId: req.params.id,
      changes: req.body
    });
    res.json(quiz);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update question", details: error.message });
  }
});

app.get('/api/debug/quiz-results', async (req, res) => {
  const results = await QuizResult.find().populate('quizId');
  res.json(results);
});

// DELETE a quiz question
app.delete("/api/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Question not found" });
    await logActivity(req.user._id, req.user.email, 'quiz_deleted', {
      quizId: req.params.id
    });
    res.json({ message: "Question deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete question", details: error.message });
  }
});

// Fetch markdown content for a topic by topicId
app.get("/api/docs/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;

    const topic = await Topic.findOne({ topicId });
    if (!topic) {
      return res.status(404).send("Topic not found");
    }
    const mdFullPath = path.join(__dirname, topic.markdownPath);

    if (!fs.existsSync(mdFullPath)) {
      return res.status(404).send("Markdown file not found");
    }

    const markdown = fs.readFileSync(mdFullPath, "utf-8");
    res.type("text/markdown").send(markdown);
  } catch (err) {
    console.error("Error fetching markdown:", err);
    res.status(500).send("Internal server error");
  }
});

// Add this endpoint for saving markdown content
app.put("/api/topics/:id", upload.none(), async (req, res) => {
  console.log("Raw body received:", req.body);
  try {
    const { id } = req.params;
    const { title, chapterId, content } = req.body;

    const topic = await Topic.findOne({ topicId: id });
    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    // Update title and chapterId
    topic.title = title;
    topic.chapterId = Number(chapterId);

    // Save updated topic
    await topic.save();

    await logActivity(req.user._id, req.user.email, 'topic_updated', {
      topicId: id,
      changes: {
        title: req.body.title,
        chapterId: req.body.chapterId
      }
    });

    // Write markdown content to file
    if (topic.markdownPath) {
      const fullPath = path.join(__dirname, topic.markdownPath);
      fs.writeFileSync(fullPath, content || "# Empty Content");
    }

    res.json(topic);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: "Failed to update topic",
      details: error.message,
    });
  }
});

app.get("/api/activity-logs", adminAuth, async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const activities = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email role');

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Failed to fetch activity logs" });
  }
});

// Fetch all topics/chapters from the database
// Updated /api/topics endpoint
// Fetch all topics/chapters from the database
// Updated /api/topics endpoint
app.get("/api/topics", async (req, res) => {
  try {
    const topics = await Topic.find(
      {},
      { "images.data": 0, "video.data": 0 }
    ).sort({ chapterId: 1, topicId: 1 });

    // Group topics by chapter
    const chaptersMap = new Map();
    topics.forEach((topic) => {
      const key = `${topic.chapterId}-${topic.chapterTitle}`;
      if (!chaptersMap.has(key)) {
        chaptersMap.set(key, {
          chapterId: topic.chapterId,
          chapter: topic.chapterTitle,
          topics: [],
        });
      }
      chaptersMap.get(key).topics.push({
        id: topic.topicId,
        title: topic.title,
        markdownPath: topic.markdownPath,
        videoPath: topic.videoPath || null,
        images: topic.images || [],
      });
    });

    // Convert to array and sort by chapterId
    const chapters = Array.from(chaptersMap.values()).sort(
      (a, b) => a.chapterId - b.chapterId
    );

    res.json(chapters);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({
      error: "Failed to fetch topics",
      details: err.message,
    });
  }
});

app.post("/api/chapters", async (req, res) => {
  try {
    const { chapterId, chapterTitle } = req.body;
    // Create a placeholder topic when creating a new chapter
    const topicId = `chapter_${chapterId}_1_placeholder`;
    const newTopic = new Topic({
      chapterId,
      chapterTitle,
      topicId,
      title: "New Topic",
      markdownPath: `/docs/chapter_${chapterId}/placeholder.md`,
    });
    await newTopic.save();
    await logActivity(req.user._id, req.user.email, 'chapter_created', {
      chapterId,
      chapterTitle
    });
    res.status(201).json({ chapterId, chapterTitle });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create chapter", details: error.message });
  }
});

app.put("/api/chapters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { chapterTitle } = req.body;

    // Convert to number
    const chapterId = parseInt(id, 10);

    await Topic.updateMany({ chapterId }, { $set: { chapterTitle } });
    await logActivity(req.user._id, req.user.email, 'chapter_updated', {
      chapterId,
      newTitle: chapterTitle
    });

    res.json({ chapterId, chapterTitle });
  } catch (err) {
    console.error("Error updating chapter:", err);
    res.status(500).json({ error: "Failed to update chapter" });
  }
});

// Topic CRUD Endpoints
app.post(
  "/api/topics",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "images", maxCount: 15 },
  ]),
  async (req, res) => {
    try {
      const { chapterId, chapterTitle, topicId, title, markdownPath } =
        req.body;
      const videoFile = req.files["video"]?.[0];
      const imageFiles = req.files["images"] || [];

      // You can optionally move the uploaded files, rename them, or store their paths
      const videoPath = videoFile ? videoFile.path : null;
      const imagePaths = imageFiles.map((file) => file.path); // array of paths

      const newTopic = new Topic({
        chapterId,
        chapterTitle,
        topicId,
        title,
        markdownPath,
        videoPath,
        imagePaths, // Optional: add this to your schema if needed
      });

      await newTopic.save();
      await logActivity(req.user._id, req.user.email, 'topic_created', {
        topicId: newTopic.topicId,
        title: newTopic.title,
        chapterId: newTopic.chapterId
      });
      res.status(201).json(newTopic);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create topic" });
    }
  }
);

app.delete("/api/topics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Topic ID is required" });

    const result = await Topic.findOneAndDelete({ topicId: id });
    if (!result) return res.status(404).json({ error: "Topic not found" });

    await logActivity(req.user._id, req.user.email, 'topic_deleted', {
      topicId: req.params.id
    });
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete topic", details: error.message });
  }
});

app.get("/api/image/:topicId/:filename", async (req, res) => {
  try {
    const { topicId, filename } = req.params;
    const topic = await Topic.findOne({ topicId });

    if (!topic || !topic.images) return res.status(404).send("Image not found");

    const image = topic.images.find((img) => img.filename === filename);
    if (!image) return res.status(404).send("Image file not found");

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (err) {
    console.error("Error serving image:", err);
    res.status(500).send("Internal server error");
  }
});

app.get("/api/video/:topicId", async (req, res) => {
  const { topicId } = req.params;
  const topic = await Topic.findOne({ topicId });

  if (!topic || !topic.videoPath)
    return res.status(404).send("Video not found");

  const videoFullPath = path.join(__dirname, topic.videoPath);
  if (!fs.existsSync(videoFullPath))
    return res.status(404).send("Video file not found");

  const stat = fs.statSync(videoFullPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoFullPath, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(videoFullPath).pipe(res);
  }
});

// Delete chapter and all its topics
app.delete("/api/chapters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const chapterId = parseInt(id, 10);

    if (isNaN(chapterId)) {
      return res.status(400).json({ error: "Invalid chapter ID" });
    }

    // Delete all topics in this chapter first
    const deleteResult = await Topic.deleteMany({ chapterId });

    console.log(
      `Deleted ${deleteResult.deletedCount} topics for chapter ${chapterId}`
    );
    await logActivity(req.user._id, req.user.email, 'chapter_deleted', {
      chapterId: parseInt(req.params.id, 10)
    });
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting chapter:", err);
    res.status(500).json({
      error: "Failed to delete chapter",
      details: err.message,
    });
  }
});

// Add to server.js
// Add to server.js
// Updated dashboard API endpoint with better debugging and data fetching
// User Statistics Endpoint
app.get('/api/dashboard/user-stats', adminAuth, async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      lastActive: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const newUsers = await User.countDocuments({
      createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const roleDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $project: { role: "$_id", count: 1, _id: 0 } }
    ]);

    const educationLevel = await User.aggregate([
      { $match: { educationalLevel: { $ne: "" } } },
      { $group: { _id: "$educationalLevel", count: { $sum: 1 } } }
    ]);

    const professionalStatus = await User.aggregate([
      { $match: { professionalStatus: { $ne: "" } } },
      { $group: { _id: "$professionalStatus", count: { $sum: 1 } } }
    ]);

    // Average progress calculation
    const allProgress = await UserProgress.aggregate([
      { $match: { completed: true } },
      { $group: { _id: "$email", completed: { $sum: 1 } } }
    ]);
    const avgProgress = allProgress.length > 0
      ? Math.round(allProgress.reduce((sum, p) => sum + p.completed, 0) / allProgress.length)
      : 0;

    res.json({
      totalUsers,
      activeUsers,
      newUsers,
      roleDistribution,
      educationLevel: Object.fromEntries(educationLevel.map(e => [e._id, e.count])) || {},
      professionalStatus: Object.fromEntries(professionalStatus.map(p => [p._id, p.count])) || {},
      avgProgress
    });

  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics', details: error.message });
  }
});
// Content Statistics Endpoint
app.get('/api/dashboard/content-stats', adminAuth, async (req, res) => {
  try {
    const chapterIds = await Topic.distinct("chapterId");
    const chapters = chapterIds.length;
    const topics = await Topic.countDocuments();
    const quizzes = await Quiz.countDocuments();
    const blogs = await Blog.countDocuments();

    res.json({
      chapters,
      topics,
      quizzes,
      blogs
    });

  } catch (error) {
    console.error('Content stats error:', error);
    res.status(500).json({ error: 'Failed to fetch content statistics', details: error.message });
  }
});
// Quiz Statistics Endpoint
app.get('/api/dashboard/quiz-stats', adminAuth, async (req, res) => {
  try {
    const quizStats = await QuizResult.aggregate([
      {
        $group: {
          _id: null,
          averageScore: { $avg: { $multiply: [{ $divide: ["$score", "$totalQuestions"] }, 100] } },
          completedQuizzes: { $sum: 1 }
        }
      }
    ]);

    res.json(quizStats[0] || { averageScore: 0, completedQuizzes: 0 });

  } catch (error) {
    console.error('Quiz stats error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz statistics', details: error.message });
  }
});
// Top Contributors Endpoint
app.get('/api/dashboard/top-contributors', adminAuth, async (req, res) => {
  try {
    const currentTopicIds = (await Topic.find({}, 'topicId')).map(t => t.topicId);

    console.log('Fetching top contributors...');

    const topContributors = await UserProgress.aggregate([
      {
        $match: {
          completed: true,
          topicId: { $in: currentTopicIds }
        }
      },
      {
        $group: {
          _id: {
            email: "$email",
            topicId: "$topicId"
          }
        }
      },
      {
        $group: {
          _id: "$_id.email",
          completedTopics: { $sum: 1 }
        }
      },
      { $sort: { completedTopics: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "email",
          as: "user"
        }
      },
      {
        $project: {
          email: "$_id",
          userId: { $arrayElemAt: ["$user._id", 0] },
          name: {
            $concat: [
              { $arrayElemAt: ["$user.firstName", 0] },
              " ",
              { $arrayElemAt: ["$user.lastName", 0] }
            ]
          },
          completedTopics: 1,
          profileImage: {
            $cond: {
              if: { $gt: [{ $size: "$user" }, 0] },
              then: { $arrayElemAt: ["$user.profileImage", 0] },
              else: null
            }
          }
        }
      }
    ]);

    const finalContributors = topContributors.map(contributor => {
      const user = Array.isArray(contributor.user) && contributor.user.length > 0
        ? contributor.user[0]
        : null;

      return {
        email: contributor._id,
        name: user
          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
          : contributor._id,
        completedTopics: contributor.completedTopics,
        profileImage: user?.profileImage
          ? `/api/profile/image/${user._id}`
          : null
      };
    });

    console.log('Final contributors with details:', finalContributors);
    res.json(finalContributors);

  } catch (error) {
    console.error('Top contributors error:', error);
    res.status(500).json({ error: 'Failed to fetch top contributors', details: error.message });
  }
});
// Most Achieved Topics Endpoint
app.get('/api/dashboard/most-achieved-topics', adminAuth, async (req, res) => {
  try {
    const mostAchievedTopics = await UserProgress.aggregate([
      {
        $match: { completed: true }
      },
      {
        $lookup: {
          from: "topics",
          localField: "topicId",
          foreignField: "topicId",
          as: "topic"
        }
      },
      {
        $match: {
          "topic.0": { $exists: true }
        }
      },
      {
        $group: {
          _id: "$topicId",
          completedCount: { $sum: 1 }
        }
      },
      { $sort: { completedCount: -1 } },
      { $limit: 5 }
    ]);

    const topicsWithDetails = await Promise.all(
      mostAchievedTopics.map(async topic => {
        const topicDetails = await Topic.findOne({ topicId: topic._id });
        return {
          topicId: topic._id,
          title: topicDetails?.title || 'Unknown Topic',
          chapterTitle: topicDetails?.chapterTitle || 'Unknown Chapter',
          completedCount: topic.completedCount
        };
      })
    );

    res.json(topicsWithDetails);

  } catch (error) {
    console.error('Most achieved topics error:', error);
    res.status(500).json({ error: 'Failed to fetch most achieved topics', details: error.message });
  }
});
// Quiz Performance Endpoint
app.get('/api/dashboard/quiz-performance', adminAuth, async (req, res) => {
  try {
    const quizPerformance = await QuizResult.aggregate([
      {
        $group: {
          _id: "$quizId",
          averageScore: {
            $avg: {
              $multiply: [
                { $divide: ["$score", "$totalQuestions"] },
                100
              ]
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          chapter: {
            $substr: ["$_id", 7, 1]
          },
          averageScore: { $round: ["$averageScore", 2] },
          count: 1,
          _id: 0
        }
      },
      { $sort: { chapter: 1 } }
    ]);

    res.json(quizPerformance);

  } catch (error) {
    console.error('Quiz performance error:', error);
    res.status(500).json({ error: 'Failed to fetch quiz performance', details: error.message });
  }
});
// Recent Activity Endpoint
app.get('/api/dashboard/recent-activity', adminAuth, async (req, res) => {
  try {
    const showAll = req.query.showAll === 'true';
    const activityLimit = showAll ? 100 : 20;

    const recentActivity = await ActivityLog.find()
      .sort({ timestamp: -1 })
      .limit(activityLimit)
      .populate('userId', 'firstName lastName email');

    const formattedActivities = recentActivity.map(log => {
      let action = '';
      let details = '';

      switch (log.actionType) {
        case 'user_registered':
          action = 'Registered';
          break;
        case 'user_logged_in':
          action = 'Logged in';
          break;
        case 'topic_completed':
          action = 'Completed topic';
          details = log.details?.topicTitle || log.details?.topicId || '';
          break;
        case 'quiz_attempted':
          action = 'Completed quiz';
          details = `Score: ${log.details?.score}/${log.details?.totalQuestions}`;
          break;
        default:
          action = log.actionType;
      }

      return {
        user: log.userId
          ? `${log.userId.firstName} ${log.userId.lastName}`
          : log.userEmail,
        action,
        details,
        timestamp: log.timestamp
      };
    });

    res.json(formattedActivities);

  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity', details: error.message });
  }
});
// Optional: Combined dashboard endpoint for backward compatibility
app.get('/api/dashboard/data', adminAuth, async (req, res) => {
  try {
    const [
      userStats,
      contentStats,
      quizStats,
      topContributors,
      mostAchievedTopics,
      quizPerformance,
      recentActivity
    ] = await Promise.all([
      // Make internal requests to our new endpoints
      fetch(`${req.protocol}://${req.get('host')}/api/dashboard/user-stats`, {
        headers: { 'Authorization': req.headers.authorization }
      }).then(r => r.json()),
      fetch(`${req.protocol}://${req.get('host')}/api/dashboard/content-stats`, {
        headers: { 'Authorization': req.headers.authorization }
      }).then(r => r.json()),
      fetch(`${req.protocol}://${req.get('host')}/api/dashboard/quiz-stats`, {
        headers: { 'Authorization': req.headers.authorization }
      }).then(r => r.json()),
      fetch(`${req.protocol}://${req.get('host')}/api/dashboard/top-contributors`, {
        headers: { 'Authorization': req.headers.authorization }
      }).then(r => r.json()),
      fetch(`${req.protocol}://${req.get('host')}/api/dashboard/most-achieved-topics`, {
        headers: { 'Authorization': req.headers.authorization }
      }).then(r => r.json()),
      fetch(`${req.protocol}://${req.get('host')}/api/dashboard/quiz-performance`, {
        headers: { 'Authorization': req.headers.authorization }
      }).then(r => r.json()),
      fetch(`${req.protocol}://${req.get('host')}/api/dashboard/recent-activity${req.url.includes('showAll') ? '?showAll=true' : ''}`, {
        headers: { 'Authorization': req.headers.authorization }
      }).then(r => r.json())
    ]);

    res.json({
      userStats,
      contentStats,
      quizStats,
      quizPerformance,
      recentActivity,
      topContributors,
      mostAchievedTopics
    });

  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ error: 'Failed to generate dashboard data', details: error.message });
  }
});

// Add this endpoint to your server.js file
app.delete('/api/clean-duplicate-progress', adminAuth, async (req, res) => {
  try {
    console.log('Starting duplicate progress cleanup...');

    // First, identify all duplicate entries
    const duplicates = await UserProgress.aggregate([
      {
        $group: {
          _id: {
            email: "$email",
            topicId: "$topicId"
          },
          count: { $sum: 1 },
          ids: { $push: "$_id" }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    console.log(`Found ${duplicates.length} duplicate progress entries`);

    // Process each duplicate group
    let deletedCount = 0;
    for (const group of duplicates) {
      // Keep the first document and delete the rest
      const idsToDelete = group.ids.slice(1);

      if (idsToDelete.length > 0) {
        const deleteResult = await UserProgress.deleteMany({
          _id: { $in: idsToDelete }
        });

        deletedCount += deleteResult.deletedCount;
        console.log(`Deleted ${deleteResult.deletedCount} duplicates for ${group._id.email} - ${group._id.topicId}`);
      }
    }

    res.json({
      message: 'Duplicate progress cleanup completed',
      duplicateGroupsFound: duplicates.length,
      duplicatesDeleted: deletedCount,
      remainingDuplicates: duplicates.reduce((sum, group) => sum + (group.count - 1), 0) - deletedCount
    });
  } catch (error) {
    console.error('Error during duplicate cleanup:', error);
    res.status(500).json({
      error: 'Failed to clean duplicate progress entries',
      details: error.message
    });
  }
});


// Add this endpoint to clean up orphaned progress records
app.post('/api/clean-orphaned-progress', adminAuth, async (req, res) => {
  try {
    console.log('Cleaning orphaned progress records...');

    // Get all current topic IDs
    const topics = await Topic.find({}, 'topicId');
    const currentTopicIds = topics.map(t => t.topicId);

    // Delete progress records for topics that no longer exist
    const result = await UserProgress.deleteMany({
      topicId: { $nin: currentTopicIds }
    });

    res.json({
      message: 'Orphaned progress cleanup completed',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error cleaning orphaned progress:', error);
    res.status(500).json({
      error: 'Failed to clean orphaned progress',
      details: error.message
    });
  }
});
// Add these debug endpoints to your server to investigate the data

// Debug endpoint to check UserProgress data
app.get('/api/debug/user-progress', adminAuth, async (req, res) => {
  try {
    const totalProgress = await UserProgress.countDocuments();
    const completedProgress = await UserProgress.countDocuments({ completed: true });
    const sampleData = await UserProgress.find().limit(10);
    const uniqueEmails = await UserProgress.distinct('email');

    console.log('UserProgress Debug Info:');
    console.log('- Total records:', totalProgress);
    console.log('- Completed records:', completedProgress);
    console.log('- Unique emails:', uniqueEmails.length);

    res.json({
      totalRecords: totalProgress,
      completedRecords: completedProgress,
      uniqueEmails: uniqueEmails.length,
      emailList: uniqueEmails,
      sampleData: sampleData
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check User data
app.get('/api/debug/users', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const userEmails = await User.distinct('email');
    const sampleUsers = await User.find({}, { firstName: 1, lastName: 1, email: 1 }).limit(10);

    console.log('Users Debug Info:');
    console.log('- Total users:', totalUsers);
    console.log('- User emails count:', userEmails.length);

    res.json({
      totalUsers,
      userEmailsCount: userEmails.length,
      userEmails: userEmails,
      sampleUsers: sampleUsers
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check data alignment
app.get('/api/debug/data-alignment', adminAuth, async (req, res) => {
  try {
    // Get all unique emails from UserProgress
    const progressEmails = await UserProgress.distinct('email');
    const userEmails = await User.distinct('email');

    // Find mismatches
    const progressEmailsNotInUsers = progressEmails.filter(email => !userEmails.includes(email));
    const userEmailsNotInProgress = userEmails.filter(email => !progressEmails.includes(email));

    // Get top contributors raw data
    const topContributorsRaw = await UserProgress.aggregate([
      { $match: { completed: true } },
      { $group: { _id: "$email", completedTopics: { $sum: 1 } } },
      { $sort: { completedTopics: -1 } },
      { $limit: 10 }
    ]);

    console.log('Data Alignment Debug:');
    console.log('- Progress emails not in Users:', progressEmailsNotInUsers);
    console.log('- User emails not in Progress:', userEmailsNotInProgress);
    console.log('- Top contributors raw:', topContributorsRaw);

    res.json({
      progressEmails: progressEmails.length,
      userEmails: userEmails.length,
      progressEmailsNotInUsers,
      userEmailsNotInProgress,
      topContributorsRaw,
      dataAlignmentIssues: progressEmailsNotInUsers.length > 0
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to manually create some test progress data (for testing only)
app.post('/api/debug/create-test-progress', adminAuth, async (req, res) => {
  try {
    // Get some real user emails
    const users = await User.find({}, { email: 1 }).limit(3);

    if (users.length === 0) {
      return res.json({ message: 'No users found to create test data' });
    }

    const testProgress = [];
    const topics = ['topic1', 'topic2', 'topic3', 'topic4', 'topic5'];

    // Create some test progress for existing users
    for (const user of users) {
      const numTopics = Math.floor(Math.random() * 5) + 1; // 1-5 topics
      const userTopics = topics.slice(0, numTopics);

      for (const topicId of userTopics) {
        const existingProgress = await UserProgress.findOne({
          email: user.email,
          topicId: topicId
        });

        if (!existingProgress) {
          testProgress.push({
            email: user.email,
            topicId: topicId,
            completed: true
          });
        }
      }
    }

    if (testProgress.length > 0) {
      await UserProgress.insertMany(testProgress);
    }

    res.json({
      message: 'Test progress created',
      recordsCreated: testProgress.length,
      testProgress
    });
  } catch (error) {
    console.error('Test creation error:', error);
    res.status(500).json({ error: error.message });
  }
});


// Add this to server.js
const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};





// Update topic saving to handle files
topicSchema.pre("save", function (next) {
  if (this.isModified("markdownPath")) {
    const fullPath = path.join(__dirname, this.markdownPath);
    ensureDirectoryExistence(fullPath);

    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, this.content || "# New Topic");
    }
  }
  next();
});

// ---------------- Start Express Server ---------------- //
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});

// Add this at the end of your server file
setInterval(() => {
  // Remove tokens older than 24 hours
  const now = Date.now();
  for (const token of tokenBlacklist) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.exp * 1000 < now) {
        tokenBlacklist.delete(token);
      }
    } catch {
      tokenBlacklist.delete(token);
    }
  }
}, 3600000); // Run every hour

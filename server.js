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
import ExcelJS from 'exceljs';
import PdfPrinter from 'pdfmake';
// import htmlPdf from 'html-pdf';
import path from "path";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { fileURLToPath } from "url";
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Initialize Express App
const app = express();
const PORT = 8080;
// Middleware Setup
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable Cross-Origin Resource Sharing
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


// Add this function to your server
function formatContent(content) {
  // Simple markdown to HTML conversion
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
    .replace(/\n/g, '<br>') // line breaks
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>'); // links
}


const generateReport = async (res, data, headers, fileName, format) => {
  if (format === 'xlsx') {
    // Excel generation
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    worksheet.columns = headers.map(header => ({
      header: header.label,
      key: header.key,
      width: header.width
    }));

    data.forEach(item => worksheet.addRow(item));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } else if (format === 'pdf') {
    // PDF generation
    const fonts = {
      Roboto: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique'
      }
    };

    const printer = new PdfPrinter(fonts);

    // Calculate column widths based on header lengths
    const colWidths = headers.map(h => {
      const headerLength = h.label.length;
      // Base width + extra space for content
      return Math.max(headerLength * 7, 80);
    });

    // Prepare data rows with proper formatting
    const bodyRows = data.map(row =>
      headers.map(h => {
        const value = row[h.key];
        // Format dates and long text
        if (h.key.includes('Date') || h.key.includes('At')) {
          return { text: value, style: 'dateCell' };
        } else if (value.length > 30) {
          return { text: value, style: 'wrapCell' };
        }
        return value;
      })
    );

    const docDefinition = {
      pageOrientation: 'landscape',
      pageMargins: [40, 40, 40, 40], // Increased page width
      content: [
        {
          text: fileName,
          style: 'header',
          margin: [0, 0, 0, 20] // Reduced margin for the title
        },
        {
          table: {
            headerRows: 1,
            widths: colWidths,
            body: [
              headers.map(h => ({
                text: h.label,
                style: 'tableHeader',
                margin: [5, 4, 5, 4] // Add padding to header cells
              })),
              ...bodyRows.map(row =>
                row.map(cell => ({
                  text: typeof cell === 'object' ? cell.text : cell,
                  style: typeof cell === 'object' ? cell.style : 'tableCell',
                  margin: [5, 4, 5, 4] // Add padding to body cells
                }))
              )
            ]
          },
          layout: {
            fillColor: (rowIndex) => rowIndex === 0 ? '#dddddd' : null,
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        tableHeader: {
          bold: true,
          fontSize: 10
        },
        tableCell: {
          fontSize: 9,
          lineHeight: 1.2
        },
        dateCell: {
          fontSize: 9
        },
        wrapCell: {
          fontSize: 8,
          lineHeight: 1.1
        },
        defaultStyle: {
          fontSize: 10
        }
      }
    };


    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}.pdf`);
    pdfDoc.pipe(res);
    pdfDoc.end();
  }
};

// Users Report


// Example for UsersManagement.jsx
const downloadReport = (format) => {
  const url = `http://localhost:8080/api/report/users?format=${format}`;
  window.open(url, '_blank');
};




// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "root"], default: "user" },
  isBlocked: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
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
      return res.status(400).json({ error: "Title, author, and content are required" });
    }

    const blog = new Blog({
      title,
      author,
      content,
      formattedContent: content, // You can format this if needed
      excerpt: content.replace(/\n/g, ' ').slice(0, 120) + (content.length > 120 ? '...' : ''),
      image,
      createdAt: new Date(),
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blog", details: error.message });
  }
});

// Configure multer for image uploads
const blogImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blog-images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const blogImageUpload = multer({ storage: blogImageStorage });

// Add this endpoint for image uploads
app.post('/api/upload-blog-image', blogImageUpload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    url: `/uploads/blog-images/${req.file.filename}`
  });
});

// Make sure to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs", details: error.message });
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
        excerpt: content.replace(/\n/g, ' ').slice(0, 120) + (content.length > 120 ? '...' : ''),
        image
      },
      { new: true }
    );
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog", details: error.message });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: Number(req.params.id) });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog", details: error.message });
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
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog", details: error.message });
  }
});

app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findOne({ id: Number(req.params.id) });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog", details: error.message });
  }
});

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
    res.status(401).json({ error: "Invalid token", details: error.message });
  }
};

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

// Sign-Up Route
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const verificationToken = crypto.randomBytes(32).toString("hex");

    console.log("Signup request received:", req.body);

    // Create and save new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      verificationToken,
      isVerified: false,
    });
    await user.save();

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

    console.log("User created successfully:", user);
    // res.status(201).json({
    //   user: {
    //     id: user._id,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     email: user.email,
    //   },
    //   token: "dummy-token", // Replace with real token (JWT) later
    // });
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

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in." });
    }

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


app.get('/api/report/users', adminAuth, async (req, res) => {
  try {
    const format = req.query.format || 'pdf';
    const users = await User.find().select('-password -verificationToken').lean();

    const headers = [
      { key: 'firstName', label: 'First Name', width: 15 },
      { key: 'lastName', label: 'Last Name', width: 15 },
      { key: 'email', label: 'Email', width: 30 },
      { key: 'role', label: 'Role', width: 10 },
      { key: 'createdAt', label: 'Created At', width: 20 },
      { key: 'isBlocked', label: 'Blocked', width: 10 }
    ];

    const data = users.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt).toLocaleString(),
      isBlocked: user.isBlocked ? 'Yes' : 'No'
    }));

    await generateReport(res, data, headers, 'users-report', format);

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
});

// Content Report
app.get('/api/report/content', adminAuth, async (req, res) => {
  try {
    const format = req.query.format || 'pdf';
    const topics = await Topic.find().lean();

    const headers = [
      { key: 'chapterId', label: 'Chapter ID', width: 10 },
      { key: 'chapterTitle', label: 'Chapter Title', width: 25 },
      { key: 'title', label: 'Topic Title', width: 25 },
      { key: 'topicId', label: 'Topic ID', width: 15 },
      { key: 'createdAt', label: 'Created At', width: 20 }
    ];

    const data = topics.map(topic => ({
      ...topic,
      createdAt: new Date(topic.createdAt).toLocaleString()
    }));

    await generateReport(res, data, headers, 'content-report', format);

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
});

// Quiz Report
app.get('/api/report/quiz', adminAuth, async (req, res) => {
  try {
    const format = req.query.format || 'pdf';
    const quizzes = await Quiz.find().lean();

    const headers = [
      { key: 'chapterId', label: 'Chapter ID', width: 10 },
      { key: 'question', label: 'Question', width: 40 },
      { key: 'options', label: 'Options', width: 30 },
      { key: 'answer', label: 'Answer', width: 20 }
    ];

    const data = quizzes.map(quiz => ({
      ...quiz,
      options: quiz.options.join(', ')
    }));

    await generateReport(res, data, headers, 'quiz-report', format);

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
});

// Blogs Report
app.get('/api/report/blogs', adminAuth, async (req, res) => {
  try {
    const format = req.query.format || 'pdf';
    const blogs = await Blog.find().lean();

    const headers = [
      { key: 'title', label: 'Title', width: 30 },
      { key: 'author', label: 'Author', width: 20 },
      { key: 'createdAt', label: 'Created At', width: 20 },
      { key: 'excerpt', label: 'Excerpt', width: 40 }
    ];

    const data = blogs.map(blog => ({
      ...blog,
      createdAt: new Date(blog.createdAt).toLocaleString(),
      excerpt: blog.excerpt || blog.content.substring(0, 100) + '...'
    }));

    await generateReport(res, data, headers, 'blogs-report', format);

  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
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
    res.status(500).json({ error: "Internal server error", details: error.message });
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
    res.status(500).json({ error: "Failed to fetch quizzes", details: error.message });
  }
});

// Get all questions for a chapter
app.get("/api/quizzes/:chapterId", async (req, res) => {
  try {
    const questions = await Quiz.find({ chapterId: req.params.chapterId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions", details: error.message });
  }
});




app.get("/api/quizs/all", async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions); // ✅ Send array directly
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
    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to add question", details: error.message });
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
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Failed to update question", details: error.message });
  }
});

// DELETE a quiz question
app.delete("/api/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Question not found" });
    res.json({ message: "Question deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete question", details: error.message });
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
app.put("/api/topics/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, chapterId, content } = req.body;

    const chapterIdNum = parseInt(chapterId, 10);

    // First update the markdown file
    const topic = await Topic.findOne({ topicId: id });
    if (topic && topic.markdownPath) {
      const fullPath = path.join(__dirname, topic.markdownPath);
      fs.writeFileSync(fullPath, content);
    }

    // Then update database record
    const updated = await Topic.findOneAndUpdate(
      { topicId: id },
      { title, chapterId: chapterIdNum, content },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Failed to update topic", details: error.message });
  }
});


// Fetch all topics/chapters from the database
// Updated /api/topics endpoint
// Fetch all topics/chapters from the database
// Updated /api/topics endpoint
app.get("/api/topics", async (req, res) => {
  try {
    const topics = await Topic.find({}, { "images.data": 0, "video.data": 0 })
      .sort({ chapterId: 1, topicId: 1 });

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
    const chapters = Array.from(chaptersMap.values())
      .sort((a, b) => a.chapterId - b.chapterId);

    res.json(chapters);
  } catch (err) {
    console.error("Error fetching topics:", err);
    res.status(500).json({
      error: "Failed to fetch topics",
      details: err.message
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
    res.status(201).json({ chapterId, chapterTitle });
  } catch (error) {
    res.status(500).json({ error: "Failed to create chapter", details: error.message });
  }
});

app.put("/api/chapters/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { chapterTitle } = req.body;

    // Convert to number
    const chapterId = parseInt(id, 10);

    await Topic.updateMany(
      { chapterId },
      { $set: { chapterTitle } }
    );

    res.json({ chapterId, chapterTitle });
  } catch (err) {
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
      const { chapterId, chapterTitle, topicId, title, markdownPath } = req.body;
      const videoFile = req.files["video"]?.[0];
      const imageFiles = req.files["images"] || [];

      // You can optionally move the uploaded files, rename them, or store their paths
      const videoPath = videoFile ? videoFile.path : null;
      const imagePaths = imageFiles.map(file => file.path); // array of paths

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

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete topic", details: error.message });
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
  try {
    const { topicId } = req.params;
    const topic = await Topic.findOne({ topicId });

    if (!topic || !topic.videoPath)
      return res.status(404).send("Video not found");

    const videoFullPath = path.join(__dirname, topic.videoPath);
    if (!fs.existsSync(videoFullPath))
      return res.status(404).send("Video file not found");

    res.sendFile(videoFullPath);
  } catch (err) {
    console.error("Error serving video:", err);
    res.status(500).send("Internal server error");
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
        
        console.log(`Deleted ${deleteResult.deletedCount} topics for chapter ${chapterId}`);
        
        res.status(204).send();
    } catch (err) {
        console.error("Error deleting chapter:", err);
        res.status(500).json({ 
            error: "Failed to delete chapter",
            details: err.message 
        });
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

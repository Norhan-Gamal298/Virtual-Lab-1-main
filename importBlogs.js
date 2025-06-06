import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 1. Define the Blog schema
const blogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, required: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
});
const Blog = mongoose.model("Blog", blogSchema);

// 2. Load environment variables from .env file
dotenv.config();

// 3. Connect to MongoDB
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

// 4. Read blogs.json file
const blogsPath = path.join(process.cwd(), "public", "blogs", "blogs.json");
let blogsData = [];
try {
  blogsData = JSON.parse(fs.readFileSync(blogsPath, "utf-8"));
} catch (err) {
  console.error(`Error reading or parsing blogs.json: ${blogsPath}`);
  throw err;
}

// 5. Insert all blogs into the database
(async () => {
  try {
    await Blog.deleteMany({}); // Optional: clear old blogs before import
    await Blog.insertMany(blogsData);
    console.log("All blogs imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error importing blogs:", err);
    process.exit(1);
  }
})();
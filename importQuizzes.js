import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 1. Define the Quiz schema (same as in server.js)
const quizSchema = new mongoose.Schema({
  chapterId: { type: Number, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});
const Quiz = mongoose.model("Quiz", quizSchema);

// Load environment variables from .env file
dotenv.config();

// 2. Connect to MongoDB
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

// 3. Read all quiz files from the quizzes folder
const quizzesDir = path.join(process.cwd(), "public", "quizzes");
const allQuizDocs = [];

fs.readdirSync(quizzesDir)
  .filter((file) => file.endsWith(".json"))
  .sort((a, b) => {
    const [aMain, aSub] = a.match(/\d+/g).map(Number);
    const [bMain, bSub] = b.match(/\d+/g).map(Number);
    return aMain - bMain || (aSub ?? 0) - (bSub ?? 0);
  })

  .forEach((file) => {
    const chapterId = parseInt(file.match(/\d+/)?.[0], 10); // Extract chapter number
    const filePath = path.join(quizzesDir, file);
    try {
      const questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      questions.forEach((q) => {
        allQuizDocs.push({
          chapterId,
          question: q.question,
          options: q.options,
          answer: q.answer,
        });
      });
    } catch (err) {
      console.error(`Error parsing JSON in file: ${filePath}`);
      throw err;
    }
  });

// 4. Insert all quizzes into the database
(async () => {
  try {
    await Quiz.deleteMany({});
    await Quiz.insertMany(allQuizDocs);
    console.log("All quizzes imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error importing quizzes:", err);
    process.exit(1);
  }
})();

/* import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 1. Define the Topic schema
const topicSchema = new mongoose.Schema({
  chapterId: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  markdownPath: { type: String, required: true },
  videoPath: { type: String },
  images: [String],
});
const Topic = mongoose.model("Topic", topicSchema);

// 2. Load environment variables from .env file
dotenv.config();

// 3. Connect to MongoDB
await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("MongoDB connected");

// 4. Read topics.json file
const topicsPath = path.join(process.cwd(), "public", "topics.json");
let topicsData = [];
try {
  topicsData = JSON.parse(fs.readFileSync(topicsPath, "utf-8"));
} catch (err) {
  console.error(`Error reading or parsing topics.json: ${topicsPath}`);
  throw err;
}

// 5. Flatten and prepare topics for insertion, including images and video
const allTopics = [];
for (let chapterIndex = 0; chapterIndex < topicsData.length; chapterIndex++) {
  const chapter = topicsData[chapterIndex];
  const chapterId = chapterIndex + 1;
  const chapterTitle = chapter.chapter;
  for (const topic of chapter.topics) {
    const baseDir = path.join(process.cwd(), "public", "docs", chapterTitle);
    const mdFile = path.basename(topic.path);
    const mdPath = path.join("docs", chapterTitle, mdFile);

    // Video: look for .mp4 with same base name as .md
    const videoBase = mdFile.replace(/\.md$/, ".mp4");
    const videoFullPath = path.join(baseDir, videoBase);
    const videoPath = fs.existsSync(videoFullPath)
      ? path.join("docs", chapterTitle, videoBase)
      : null;

    // Images: all png/jpg/jpeg in the folder that start with topic number (e.g., "1.1")
    const topicPrefix = mdFile.split(" ")[0]; // e.g., "1.1"
    let images = [];
    if (fs.existsSync(baseDir)) {
      images = fs
        .readdirSync(baseDir)
        .filter(
          (f) => f.startsWith(topicPrefix) && /\.(png|jpg|jpeg)$/i.test(f)
        )
        .map((f) => path.join("docs", chapterTitle, f));
    }

    allTopics.push({
      chapterId,
      chapterTitle,
      topicId: topic.id,
      title: topic.title,
      markdownPath: mdPath,
      videoPath,
      images,
    });
  }
}

// 6. Insert all topics into the database
(async () => {
  try {
    await Topic.deleteMany({}); // Optional: clear old topics before import
    await Topic.insertMany(allTopics);
    console.log("All topics (with images and videos) imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error importing topics:", err);
    process.exit(1);
  }
})();
 */
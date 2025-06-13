import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Buffer } from "buffer";

// Define Mongoose Schema
const topicSchema = new mongoose.Schema({
  chapterId: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  topicId: { type: String, required: true },
  title: { type: String, required: true },
  markdownPath: { type: String, required: true }, // e.g. public/docs/Chapter X/title.md
  videoPath: { type: String },
  images: [
    {
      filename: String,
      data: Buffer,
      contentType: String,
    },
  ],
}, { timestamps: true });

const Topic = mongoose.model("Topic", topicSchema);

// Connect to Mongo
dotenv.config();
await mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(" MongoDB connected");

// Root docs directory
const docsDir = path.join(process.cwd(), "public", "docs");

// Get chapter folders
const chapterDirs = fs
  .readdirSync(docsDir)
  .filter((d) => /^Chapter \d+ /.test(d) && fs.statSync(path.join(docsDir, d)).isDirectory())
  .sort((a, b) => {
    const numA = parseInt(a.match(/^Chapter (\d+)/)[1], 10);
    const numB = parseInt(b.match(/^Chapter (\d+)/)[1], 10);
    return numA - numB;
  });

const allTopics = [];

for (let i = 0; i < chapterDirs.length; i++) {
  const chapterDir = chapterDirs[i];
  const chapterId = parseInt(chapterDir.split(" ")[1], 10);
  const chapterTitle = chapterDir.replace(/^Chapter \d+ /, "");
  const baseDir = path.join(docsDir, chapterDir);

  const mdFiles = fs
    .readdirSync(baseDir)
    .filter((f) => f.endsWith(".md") && fs.statSync(path.join(baseDir, f)).isFile() && !/^\d+\.0-/.test(f));

  for (const mdFile of mdFiles) {
    const match = /^(\d+\.\d+)-(.+)\.md$/i.exec(mdFile);
    if (!match) continue;

    const topicNumber = match[1];
    const topicTitle = match[2]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const topicId = `chapter_${chapterId}_${topicNumber.replace(".", "_")}_${match[2]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")}`;

    //  Full markdown path including "public/"
    const mdPath = path.join("public", "docs", chapterDir, mdFile).replace(/\\/g, "/");
    const mdFullPath = path.join(baseDir, mdFile);

    // Read content
    const mdContent = fs.readFileSync(mdFullPath, "utf-8");

    // --- Extract media from markdown ---
    const imageMatches = [...mdContent.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)];
    const videoMatches = [
      ...mdContent.matchAll(/<video[^>]+src=["']([^"']+)["']/gi),
      ...mdContent.matchAll(/<source[^>]+src=["']([^"']+)["']/gi),
    ];

    // --- IMAGES ---
    let images = [];
    for (const m of imageMatches) {
      const imgFile = m[1];
      const imgPath = path.join(baseDir, imgFile);
      if (fs.existsSync(imgPath)) {
        images.push({
          filename: path.basename(imgFile),
          data: fs.readFileSync(imgPath),
          contentType: `image/${imgFile.split(".").pop()}`,
        });
      }
    }

    // --- VIDEO ---
    let videoPath = null;
    if (videoMatches.length > 0) {
      const vidFile = videoMatches[0][1];
      const vidFullPath = path.join(baseDir, vidFile);
      if (fs.existsSync(vidFullPath)) {
        videoPath = path.join("public", "docs", chapterDir, vidFile).replace(/\\/g, "/");
      }
    }

    // Push topic entry
    allTopics.push({
      chapterId,
      chapterTitle,
      topicId,
      title: topicTitle,
      markdownPath: mdPath,
      videoPath,
      images,
    });

    console.log(` Imported topic: ${topicTitle} (chapter ${chapterId})`);
  }
}

// Final DB write
(async () => {
  try {
    await Topic.deleteMany({});
    await Topic.insertMany(allTopics);
    console.log(" All topics imported successfully!");
    process.exit(0);
  } catch (err) {
    console.error(" Error importing topics:", err);
    process.exit(1);
  }
})();

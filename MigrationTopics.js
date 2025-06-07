import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle ES modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI environment variable is required');
    process.exit(1);
}

// Main migration function
async function runMigration() {
    try {
        // Connect to DB with better error handling
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');

        // Define schemas with better validation
        const chapterSchema = new mongoose.Schema({
            chapterId: { type: Number, required: true, unique: true },
            title: { type: String, required: true },
            description: String,
            order: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now }
        });

        const topicSchema = new mongoose.Schema({
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
        });

        const Chapter = mongoose.models.Chapter || mongoose.model('Chapter', chapterSchema);
        const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema);

        // Load and validate topics data
        let topicsData;
        try {
            // Try different possible paths for the topics.json file
            const possiblePaths = [
                path.join(__dirname, '../Virtual-Lab/public/topics.json'),
                path.join(__dirname, './topics.json'),
                path.join(__dirname, '../topics.json'),
                path.join(process.cwd(), 'public/topics.json'),
                path.join(process.cwd(), 'topics.json')
            ];

            let topicsPath = null;
            for (const testPath of possiblePaths) {
                if (fs.existsSync(testPath)) {
                    topicsPath = testPath;
                    break;
                }
            }

            if (!topicsPath) {
                throw new Error('Could not find topics.json file in any expected location');
            }

            console.log(`Loading topics data from: ${topicsPath}`);
            const topicsContent = fs.readFileSync(topicsPath, 'utf8');
            topicsData = JSON.parse(topicsContent);

            if (!Array.isArray(topicsData)) {
                throw new Error('Topics data should be an array');
            }

        } catch (error) {
            console.error('Error loading topics.json:', error.message);
            process.exit(1);
        }

        // Clear existing data with confirmation
        console.log('Clearing existing data...');
        const existingChapters = await Chapter.countDocuments();
        const existingTopics = await Topic.countDocuments();

        if (existingChapters > 0 || existingTopics > 0) {
            console.log(`Found ${existingChapters} chapters and ${existingTopics} topics to delete`);
        }

        await Chapter.deleteMany({});
        await Topic.deleteMany({});
        console.log('Existing data cleared');

        // Migrate data
        console.log(`Starting migration of ${topicsData.length} chapters...`);
        let totalTopicsCreated = 0;

        for (let i = 0; i < topicsData.length; i++) {
            const chapterData = topicsData[i];

            // Validate chapter data structure
            if (!chapterData.chapter || !Array.isArray(chapterData.topics)) {
                console.warn(`Skipping invalid chapter at index ${i}:`, chapterData);
                continue;
            }

            const { chapter, topics } = chapterData;
            const chapterId = i + 1;

            try {
                // Create chapter
                const newChapter = new Chapter({
                    chapterId,
                    title: chapter,
                    order: chapterId
                });
                await newChapter.save();
                console.log(`✓ Created chapter ${chapterId}: "${newChapter.title}"`);

                // Process topics for this chapter
                let topicsCreated = 0;
                for (let j = 0; j < topics.length; j++) {
                    const topicData = topics[j];

                    // Validate topic data structure
                    if (!topicData.id || !topicData.title) {
                        console.warn(`  Skipping invalid topic at index ${j}:`, topicData);
                        continue;
                    }

                    // Try to read content from file if path is provided
                    let content = '';
                    if (topicData.path) {
                        // Try different base paths for the content files
                        const possibleBasePaths = [
                            path.join(__dirname, '../Virtual-Lab/public'),
                            path.join(__dirname, './public'),
                            path.join(__dirname, '../public'),
                            path.join(process.cwd(), 'public')
                        ];

                        let contentFound = false;
                        for (const basePath of possibleBasePaths) {
                            const fullPath = path.join(basePath, topicData.path);
                            if (fs.existsSync(fullPath)) {
                                try {
                                    content = fs.readFileSync(fullPath, 'utf8');
                                    contentFound = true;
                                    break;
                                } catch (readError) {
                                    console.warn(`    Could not read content from ${fullPath}:`, readError.message);
                                }
                            }
                        }

                        if (!contentFound && topicData.path) {
                            console.warn(`    Content file not found for topic "${topicData.title}": ${topicData.path}`);
                        }
                    }

                    // Use fallback content if no file content found
                    if (!content && topicData.content) {
                        content = topicData.content;
                    }

                    try {
                        const newTopic = new Topic({
                            chapterId,
                            topicId: topicData.id,
                            title: topicData.title,
                            content: content || `# ${topicData.title}\n\nContent will be added later.`,
                            order: j + 1,
                            images: [] // Will be populated later when images are uploaded
                        });

                        await newTopic.save();
                        topicsCreated++;
                        totalTopicsCreated++;

                    } catch (topicError) {
                        console.error(`    Error creating topic "${topicData.title}":`, topicError.message);
                    }
                }

                console.log(`  ✓ Created ${topicsCreated} topics for this chapter`);

            } catch (chapterError) {
                console.error(`Error creating chapter "${chapter}":`, chapterError.message);
            }
        }

        // Final summary
        const finalChapterCount = await Chapter.countDocuments();
        const finalTopicCount = await Topic.countDocuments();

        console.log('\n=== Migration Summary ===');
        console.log(`Chapters created: ${finalChapterCount}`);
        console.log(`Topics created: ${finalTopicCount}`);
        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
        console.error(error.stack);
        process.exit(1);
    } finally {
        // Always close the database connection
        try {
            await mongoose.connection.close();
            console.log('Database connection closed');
        } catch (closeError) {
            console.error('Error closing database connection:', closeError);
        }
    }
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, closing database connection...');
    try {
        await mongoose.connection.close();
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
    process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the migration
runMigration();
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
// import { markTopicCompleted } from '../features/auth/authSlice'

import {
    FiChevronLeft,
    FiChevronRight,
    FiChevronUp,
    FiChevronDown,
} from "react-icons/fi";
import { useSelector } from "react-redux";

import VideoNote from "../components/VideoNote"

export default function MarkdownPage() {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [headings, setHeadings] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState({});
    const [currentNote, setCurrentNote] = useState("");
    const videoRef = useRef(null);

    // const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await fetch("/topics.json");
                if (!response.ok) throw new Error("Failed to load chapters");
                const data = await response.json();
                setChapters(data);
            } catch (error) {
                console.error("Error fetching chapters:", error);
            }
        };

        fetchChapters();
    }, []);

    useEffect(() => {
        if (!topicId) {
            setContent("# 404 - Topic Not Found");
            setLoading(false);
            return;
        }

        const fetchMarkdown = async () => {
            try {
                setLoading(true);
                const allTopics = chapters.flatMap(chapter => chapter.topics);
                const topic = allTopics.find(t => t.id === topicId);

                if (!topic) {
                    throw new Error("Topic not found");
                }

                const response = await fetch(`/docs/${topic.path}`);
                if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
                const text = await response.text();

                if (text.toLowerCase().includes("<!doctype html>")) {
                    throw new Error("Received HTML instead of Markdown");
                }

                setContent(text);
                extractHeadings(text);
            } catch (error) {
                console.error("Error loading markdown:", error);
                setContent("# 404 - Topic Not Found");
                setHeadings([]);
            } finally {
                setLoading(false);
            }
        };

        if (chapters.length > 0) {
            fetchMarkdown();
        }
    }, [topicId, chapters]);

    const allTopics = chapters.flatMap(chapter => chapter.topics);
    const currentIndex = allTopics.findIndex(topic => topic.id === topicId);
    const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;






    const extractHeadings = (markdown) => {
        const lines = markdown.split("\n");
        const extractedHeadings = [];
        let insideCodeBlock = false;

        for (let line of lines) {
            // Toggle code block state
            if (line.trim().startsWith("```")) {
                insideCodeBlock = !insideCodeBlock;
                continue;
            }

            if (!insideCodeBlock && /^#{1,2}\s/.test(line)) {
                const text = line.replace(/^#+\s/, "").trim();
                const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                extractedHeadings.push({
                    id,
                    text,
                    level: line.startsWith("##") ? 2 : 1,
                });
            }
        }

        setHeadings(extractedHeadings);
    };

    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleNextTopicClick = () => {
        if (user) {
            // Mark topic as completed in backend
            fetch('http://localhost:8080/api/update-progress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,        // user email must be here  // you should have the current chapter ID
                    topicId: topicId          // current topic ID
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Progress updated:', data);
                    // After marking as completed, navigate to the next topic
                    navigate(`/docs/${nextTopic.id}`);
                })
                .catch(error => {
                    console.error('Error updating progress:', error);
                    // Even if error, maybe still allow navigation
                    navigate(`/docs/${nextTopic.id}`);
                });
        } else {
            // If user not logged in, just navigate
            navigate(`/docs/${nextTopic.id}`);
        }
    };









    return (
        <div className="container markdownMain">
            <div className="markdownContainer">
                <div className="flex flex-1 flex-col markdownContentContainer">
                    <div className="prose prose-lg dark:prose-invert markdownContent">
                        {loading ? (
                            // Replace the empty skeleton with:
                            <div className="space-y-6 animate-pulse">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            </div>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                    h1: ({ children }) => {
                                        const text = String(children).trim();
                                        const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                                        return <h1 id={id} className="scroll-mt-24">{children}</h1>;
                                    },
                                    h2: ({ children }) => {
                                        const text = String(children).trim();
                                        const id = text.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
                                        return <h2 id={id} className="scroll-mt-24">{children}</h2>;
                                    },
                                    img: ({ src, alt }) => {
                                        if (!src) return null;

                                        // Handle both possible folder names (photos/ or assets/)
                                        if (src.startsWith("photos/") || src.startsWith("photo/") || src.startsWith("photows/") || src.startsWith("phhotos/")
                                            || src.startsWith("phOotos/") || src.startsWith("photows/")) {
                                            const currentTopic = chapters
                                                .flatMap(ch => ch.topics)
                                                .find(t => t.id === topicId);

                                            if (currentTopic) {
                                                // Extract chapter folder name from the topic's path
                                                const chapterFolder = currentTopic.path.split('/')[0];
                                                // Encode for URL but keep forward slashes
                                                const encodedPath = chapterFolder.replace(/ /g, '%20');
                                                return <img src={`/docs/${encodedPath}/${src}`}
                                                    alt={alt || ""}
                                                    loading="lazy"
                                                    className="max-w-full h-auto my-4 border rounded-lg" />;
                                            }
                                        }

                                        // Fallback for absolute paths or external images
                                        return <img src={src} alt={alt || ""} loading="lazy" />;
                                    },
                                    video: ({ src, ...props }) => {
                                        if (!src) return null;

                                        const currentTopic = chapters
                                            .flatMap(ch => ch.topics)
                                            .find(t => t.id === topicId);

                                        if (currentTopic) {
                                            const chapterFolder = currentTopic.path.split('/')[0];
                                            const encodedPath = chapterFolder.replace(/ /g, '%20');
                                            return (
                                                <div>
                                                    {/* <video
                                                        src={`/docs/${encodedPath}/${src}`}
                                                        controls
                                                        className="my-4 max-w-full rounded-lg border"
                                                        {...props}
                                                    /> */}
                                                    <VideoNote
                                                        videoPath={`/docs/${encodedPath}/${src}`}
                                                        topicId={topicId}
                                                    />
                                                </div>
                                            );
                                        }

                                        // fallback
                                        return <video src={src} controls className="my-4 max-w-full rounded-lg border" {...props} />;
                                    },
                                    iframe: ({ ...props }) => (
                                        <div className="my-4 aspect-video max-w-full rounded-lg overflow-hidden border">
                                            <iframe {...props} className="w-full h-full" allowFullScreen />
                                        </div>
                                    ),
                                    code({ className, children }) {
                                        const language = className?.replace("language-", "");

                                        if (language === "python") {
                                            const codeString = String(children).trim();
                                            const encodedCode = encodeURIComponent(codeString);

                                            return (
                                                <div className="relative mb-4">
                                                    <pre>
                                                        <code className={className}>{children}</code>
                                                    </pre>
                                                    <div className="mt-2">
                                                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                                                            onClick={() => navigate(`/terminal-page?code=${encodedCode}`, { state: { fromLesson: true } })}>Try it yourself</button>
                                                        <div className="text-sm mt-1 text-gray-600 dark:text-gray-400">
                                                            Note: You'll be able to upload required files in the terminal
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        if (language === "matlab") {
                                            return (
                                                <div className="relative mb-4">
                                                    <pre><code className={className}>{children}</code></pre>
                                                    <div className="mt-2">
                                                        <a
                                                            href="https://www.mathworks.com/products/matlab-online.html"
                                                            target="_blank"
                                                            rel="noopener noreferrer nofollow"
                                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                                        >
                                                            Try on MATLAB Online
                                                        </a>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return <pre><code className={className}>{children}</code></pre>

                                    }
                                }}
                            >
                                {content}
                            </ReactMarkdown>

                        )}
                    </div>

                    {!loading && (
                        <nav className="paginationButtons mt-4 grid gap-2 grid-cols-2">
                            {prevTopic ? (
                                <a
                                    onClick={() => navigate(`/docs/${prevTopic.id}`)}
                                    className="border border-[#606770] hover:border-[#845097] rounded-[0.4rem] cursor-pointer paginationNavLink paginationNavLinkPrev p-4"
                                >
                                    <div>Previous</div>
                                    <div className="paginationLabel break-normal text-[#845097] font-bold">
                                        {prevTopic.title}
                                    </div>
                                </a>
                            ) : <div />}

                            {nextTopic ? (
                                <a
                                    onClick={handleNextTopicClick}
                                    className="border border-[#606770] hover:border-[#845097] rounded-[0.4rem] text-right cursor-pointer paginationNavLink paginationNavLinkNext p-4"
                                >
                                    <div>Next</div>
                                    <div className="paginationLabel break-normal text-[#845097] font-bold">
                                        {nextTopic.title}
                                    </div>
                                </a>
                            ) : <div />}
                        </nav>
                    )}
                </div>

                {!loading && headings.length > 0 && (
                    <div className="markdownTableContainer">
                        <div className="markdownTable">
                            <ul>
                                {headings.map((heading, index) => (
                                    <li key={`${heading.id}-${index}`} className={`ml-${heading.level === 2 ? "4 pl-2" : "2"} py-1 text-sm`}>
                                        <button
                                            onClick={() => handleScrollTo(heading.id)}
                                            className="text-left w-full hover:text-blue-500 focus:outline-none"
                                            aria-label={`Jump to ${heading.text}`}
                                        >
                                            {heading.text}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

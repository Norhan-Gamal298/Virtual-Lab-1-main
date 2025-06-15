import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiBook, FiFileText } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from 'react-router-dom';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const resultsRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch chapters and topics from backend
    useEffect(() => {
        const fetchChapters = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:8080/api/topics");
                if (!response.ok) throw new Error("Failed to load chapters");
                const data = await response.json();

                // Sort chapters by chapter ID
                const sortedChapters = data.sort((a, b) => {
                    const numA = a.chapterId || parseInt(a.chapter.match(/^\d+/)?.[0] || "0", 10);
                    const numB = b.chapterId || parseInt(b.chapter.match(/^\d+/)?.[0] || "0", 10);
                    return numA - numB;
                });

                setChapters(sortedChapters);
            } catch (error) {
                console.error("Error fetching chapters:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && chapters.length === 0) {
            fetchChapters();
        }
    }, [isOpen, chapters.length]);

    // Search functionality
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const searchQuery = query.toLowerCase();
        const searchResults = [];

        chapters.forEach(chapter => {
            // Search in chapter titles
            if (chapter.chapter.toLowerCase().includes(searchQuery)) {
                searchResults.push({
                    type: 'chapter',
                    id: `chapter_${chapter.chapterId}`,
                    title: chapter.chapter,
                    chapterId: chapter.chapterId,
                    matchType: 'Chapter'
                });
            }

            // Search in topics
            if (chapter.topics) {
                const sortedTopics = [...chapter.topics].sort((a, b) => {
                    const getParts = (t) => {
                        const match = t.id.match(/^chapter_(\d+)_(\d+)_(\d+)_/);
                        return match
                            ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
                            : [0, 0, 0];
                    };
                    const [a1, a2, a3] = getParts(a);
                    const [b1, b2, b3] = getParts(b);
                    return a1 - b1 || a2 - b2 || a3 - b3;
                });

                sortedTopics.forEach(topic => {
                    if (topic.title.toLowerCase().includes(searchQuery)) {
                        searchResults.push({
                            type: 'topic',
                            id: topic.id,
                            title: topic.title,
                            chapterTitle: chapter.chapter,
                            chapterId: chapter.chapterId,
                            matchType: 'Topic'
                        });
                    }
                });
            }
        });

        setResults(searchResults);
        setShowResults(searchResults.length > 0);

    }, [query, chapters]);

    const handleResultClick = (result) => {
        if (result.type === 'chapter') {
            // Navigate to first topic of the chapter
            const chapter = chapters.find(ch => ch.chapterId === result.chapterId);
            if (chapter && chapter.topics && chapter.topics.length > 0) {
                const sortedTopics = [...chapter.topics].sort((a, b) => {
                    const getParts = (t) => {
                        const match = t.id.match(/^chapter_(\d+)_(\d+)_(\d+)_/);
                        return match
                            ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
                            : [0, 0, 0];
                    };
                    const [a1, a2, a3] = getParts(a);
                    const [b1, b2, b3] = getParts(b);
                    return a1 - b1 || a2 - b2 || a3 - b3;
                });
                navigate(`/docs/${sortedTopics[0].id}`);
            }
        } else {
            // Navigate to specific topic
            navigate(`/docs/${result.id}`);
        }

        setShowResults(false);
        setQuery("");
        onClose(true);
    };

    // Clear search when location changes
    useEffect(() => {
        setShowResults(false);
        setQuery("");
        setResults([]);
    }, [location.pathname]);

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setShowResults(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-start justify-center pt-24 bg-black/90 backdrop-blur h-screen"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#F9FAFB] dark:bg-[#0a0a0a] dark:text-white rounded-[10px] w-[500px] max-w-full p-6 pb-0"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <FiSearch size={22} />
                            <input
                                type="text"
                                placeholder="Search chapters and topics..."
                                className="bg-transparent border-none outline-none text-lg w-full"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus
                            />
                            <button
                                onClick={clearSearch}
                                className="dark:text-white hover:text-gray-300 transition-colors"
                            >
                                <IoCloseCircle size={26} />
                            </button>
                        </div>

                        <div className="h-[1px] dark:bg-white bg-[#0f0f0f] opacity-10 mb-4"></div>

                        {loading && (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                <span className="ml-3 text-gray-400">Loading...</span>
                            </div>
                        )}

                        <motion.div
                            className="overflow-auto scrollbar-none"
                            style={{ scrollbarWidth: 'none' }}
                            ref={resultsRef}
                            initial={false}
                            animate={{
                                height: showResults ? "300px" : "0px",
                                opacity: showResults ? 1 : 0,
                            }}
                            transition={{ type: "spring", duration: 0.3 }}
                        >
                            {results.length > 0 ? (
                                <ul className="flex flex-col gap-1 pb-4">
                                    {results.map((result, index) => (
                                        <li key={`${result.id}-${index}`}>
                                            <button
                                                onClick={() => handleResultClick(result)}
                                                className="w-full p-3 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-colors duration-200 text-left flex items-center gap-3"
                                            >
                                                <div className="flex-shrink-0">
                                                    {result.type === 'chapter' ? (
                                                        <FiBook size={18} className="text-blue-400" />
                                                    ) : (
                                                        <FiFileText size={18} className="text-green-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[#1F2937] dark:text-[#F3F4F6] font-medium truncate">
                                                        {result.title}
                                                    </div>
                                                    {result.type === 'topic' && (
                                                        <div className="text-gray-400 text-sm truncate">
                                                            {result.chapterTitle}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <span className="text-xs bg-white/10 px-2 py-1 rounded">
                                                        {result.matchType}
                                                    </span>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : query.trim() && !loading && (
                                <div className="flex items-center justify-center py-8 text-gray-400">
                                    No results found for "{query}"
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
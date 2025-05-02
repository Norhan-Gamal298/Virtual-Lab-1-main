
import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { IoCloseCircle } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from 'react-router-dom';


const SearchModal = ({ isOpen, onClose }) => {

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [topics, setTopics] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const resultsRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopics = async () => {
            const res = await fetch("/topics.json");
            const data = await res.json();
            setTopics(data);
        };
        fetchTopics();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const allTopics = topics.flatMap(chapter => chapter.topics);

        const filtered = allTopics.filter((topic) =>
            topic.title.toLowerCase().includes(query.toLowerCase())
        );

        setResults(filtered);
        setShowResults(filtered.length > 0);

    }, [query, topics])

    const handleResultsShow = (id) => {
        navigate(`/docs/${id}`);
        setShowResults(false);
        setQuery("");
        onClose(true)
    };

    useEffect(() => {
        setShowResults(false);
        setQuery("");
        setResults([]);
    }, [location.pathname]);


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
                        className="bg-[#0a0a0a] text-white rounded-[10px] w-[500px] max-w-full p-6 pb-0"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <FiSearch size={22} />
                            <input
                                type="text"
                                placeholder="Search Docs..."
                                className="bg-transparent border-none outline-none text-lg w-full"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button onClick={() => { setQuery("") }} className="text-white">
                                <IoCloseCircle size={26} />
                            </button>
                        </div>
                        <div className="h-[1px] bg-white opacity-10 mb-4"></div>
                        <motion.ul
                            className="flex flex-col gap-1 overflow-auto scrollbar-none"
                            style={styles.dialog}
                            ref={resultsRef}
                            initial={false}
                            animate={{
                                height: showResults ? "300px" : "0px",
                                opacity: showResults ? 1 : 0,
                            }}
                            transition={{ type: "spring", duration: 1.3 }}
                        >
                            {results.map((result) => (
                                <li
                                    key={result.id}
                                    onClick={() => handleResultsShow(result.id)}
                                    className="p-3 hover:bg-white/5 rounded-lg cursor-pointer"
                                >
                                    {result.title}
                                </li>
                            ))}
                        </motion.ul>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const styles = {
    dialog: {
        scrollbarWidth: 'none'
    }
}


export default SearchModal;

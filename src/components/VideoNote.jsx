import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const VideoNote = React.memo(({ videoPath, topicId, userEmail }) => {
    const [currentNote, setCurrentNote] = useState("");
    const [notes, setNotes] = useState([]);
    const videoRef = useRef(null);

    // to fixed backend URL for API requests
    const API_BASE = "http://localhost:8080";

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await axios.get(`${API_BASE}/api/notes`, {
                    params: { userEmail, topicId },
                });
                setNotes(response.data.notes || []);
            } catch (error) {
                console.error("Error fetching notes:", error);
                setNotes([]);
            }
        };
        fetchNotes();
    }, [topicId, userEmail]);

    const handleAddNote = async () => {
        if (!videoRef.current || !currentNote.trim()) return;

        const timestamp = Math.floor(videoRef.current.currentTime);
        const newNote = { time: timestamp, text: currentNote.trim() };

        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);

        console.log({
            userEmail,
            topicId,
            videoSrc: videoPath,
            notes: updatedNotes,
        });

        try {
            // Save notes to the backend
            await axios.post(`${API_BASE}/api/notes`, {
                userEmail,
                topicId,
                videoSrc: videoPath,
                notes: updatedNotes,
            });
        } catch (error) {
            console.error("Error saving notes:", error);
        }

        setCurrentNote("");
    };

    const handleDeleteNote = async (indexToDelete) => {
        const updatedNotes = notes.filter((_, index) => index !== indexToDelete);
        setNotes(updatedNotes);

        try {
            // Update notes in the backend
            await axios.post(`${API_BASE}/api/notes`, {
                userEmail,
                topicId,
                videoSrc: videoPath,
                notes: updatedNotes,
            });
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    const handleTimestampClick = (timestamp) => {
        if (videoRef.current) {
            videoRef.current.currentTime = timestamp;
            videoRef.current.play();
        }
    };

    // ...imports and state (unchanged)

    return (
        <div className="my-6 space-y-6">
            <video
                ref={videoRef}
                src={videoPath}
                controls
                className="w-full rounded-xl shadow-md bg-neutral-900"
                title="Video player - Notes are timestamped to the current position"
            />

            {/* Note Input Section */}
            <div className="relative">
                <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="✍️ Take a note while watching the video..."
                    className="w-full p-4 bg-[#E5E7EB] dark:bg-[#1E1E1E] text-sm rounded-lg border border-[#E5E7EB] dark:border-[#323232] text-gray-800 dark:text-gray-100 min-h-[130px] resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#7C3AED] transition"
                />
                <button
                    onClick={handleAddNote}
                    className="absolute bottom-4 right-4 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg shadow transition-all disabled:opacity-50"
                    title="Add note at current video timestamp"
                    disabled={!currentNote.trim()}
                >
                    + Add Note
                </button>
            </div>

            {/* Notes Display Section */}
            <div className="space-y-3">
                {notes.length === 0 ? (
                    <div className="text-center py-3 text-gray-500 dark:text-gray-400">
                        No notes yet. Start taking notes while watching the video!
                    </div>
                ) : (
                    notes.map((note, idx) => (
                        <div
                            key={idx}
                            className="group flex justify-between items-start gap-4 p-4 bg-[#E5E7EB] dark:bg-[#1E1E1E] border border-[#E5E7EB] dark:border-[#323232] rounded-lg shadow-sm hover:shadow transition-all"
                            title={`Note at ${new Date(note.time * 1000).toISOString().substr(14, 5)}`}
                        >
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-gray-800 dark:text-gray-100 text-sm">{note.text}</p>
                                <span
                                    onClick={() => handleTimestampClick(note.time)}
                                    className="inline-block w-fit cursor-pointer text-xs px-2 py-1 bg-blue-100 dark:bg-purple-800 text-blue-800 dark:text-white rounded-md hover:brightness-105 transition"
                                    title="Click to jump to timestamp"
                                >
                                    ⏱ {new Date(note.time * 1000).toISOString().substr(14, 5)}
                                </span>
                            </div>
                            <button
                                onClick={() => handleDeleteNote(idx)}
                                className="text-gray-400 hover:text-red-500 transition-opacity duration-200 opacity-0 group-hover:opacity-100 text-xl font-bold"
                                title="Delete note"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

});

export default VideoNote;
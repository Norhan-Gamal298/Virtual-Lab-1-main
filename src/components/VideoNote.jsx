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

    return (
        <div className="my-4">
            <video
                ref={videoRef}
                src={videoPath}
                controls
                className="max-w-full rounded-lg border border-neutral-border bg-neutral-surface"
            />

            <div className="mt-4">
                <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Write your note here..."
                    className="w-full p-2 border border-neutral-border bg-neutral-surface text-neutral-text-primary rounded mb-2"
                />
                <button
                    onClick={handleAddNote}
                    className="bg-primary hover:bg-primary-hover text-primary-text-on-primary px-4 py-2 rounded transition"
                >
                    Add Note
                </button>
            </div>

            <div className="mt-4 space-y-2">
                {notes.map((note, idx) => (
                    <div
                        key={idx}
                        className="p-2 text-sm group flex justify-between items-center bg-neutral-surface rounded-[12px] border border-neutral-border"
                    >
                        <div className="flex items-center w-full justify-between">
                            <p className="m-0 text-md text-neutral-text-primary">
                                {note.text}
                            </p>
                            <strong className="mr-5 text-neutral-text-secondary">
                                {new Date(note.time * 1000).toISOString().substr(14, 5)}
                            </strong>
                        </div>
                        <button
                            onClick={() => handleDeleteNote(idx)}
                            className="text-error hover:bg-neutral-background px-2 py-1 rounded transition"
                            title="Delete note"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default VideoNote;

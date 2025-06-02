import React, { useState, useEffect, useRef } from "react";

const VideoNote = React.memo(({ videoPath, topicId }) => {
    const [currentNote, setCurrentNote] = useState("");
    const [notes, setNotes] = useState([]);
    const videoRef = useRef(null);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("videoNotes") || "{}");
        if (saved[topicId]) setNotes(saved[topicId]);
    }, [topicId]);

    const handleAddNote = () => {
        if (!videoRef.current || !currentNote.trim()) return;

        const timestamp = Math.floor(videoRef.current.currentTime);
        const newNote = { time: timestamp, text: currentNote.trim() };

        const updatedNotes = [...notes, newNote];
        setNotes(updatedNotes);

        const allNotes = JSON.parse(localStorage.getItem("videoNotes") || "{}");
        allNotes[topicId] = updatedNotes;
        localStorage.setItem("videoNotes", JSON.stringify(allNotes));

        setCurrentNote("");
    };

    const handleDeleteNote = (indexToDelete) => {
        const updatedNotes = notes.filter((_, index) => index !== indexToDelete);
        setNotes(updatedNotes);

        const allNotes = JSON.parse(localStorage.getItem("videoNotes") || "{}");
        allNotes[topicId] = updatedNotes;
        localStorage.setItem("videoNotes", JSON.stringify(allNotes));
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
                            <p className="m-0 text-md text-neutral-text-primary">{note.text}</p>
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

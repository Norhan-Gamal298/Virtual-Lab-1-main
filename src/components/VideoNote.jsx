
import React, { useState, useEffect, useMemo, useRef } from "react";
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
            <video ref={videoRef} src={videoPath} controls className="max-w-full rounded-lg border" />

            <div className="mt-4">
                <textarea
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Write your note here..."
                    className="w-full p-2 border rounded mb-2"
                />
                <button
                    onClick={handleAddNote}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Note
                </button>
            </div>

            <div className="mt-4">
                {notes.map((note, idx) => (
                    <div key={idx} className="p-2 border-b text-sm group flex justify-between items-center bg-[#1f1f1f] rounded-[12px] border-none mb-2">
                        <div className="flex items-center w-full justify-between">

                            <p className="m-0 text-md">{note.text}</p>
                            <strong className="mr-5">{new Date(note.time * 1000).toISOString().substr(14, 5)}</strong>
                        </div>
                        <button
                            onClick={() => handleDeleteNote(idx)}
                            className="text-red-500 opacity-100 group-hover:opacity-100 transition-opacity px-2 py-1 hover:bg-[#2E2E2E] rounded"
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

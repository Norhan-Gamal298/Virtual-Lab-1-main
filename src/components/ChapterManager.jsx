import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { SortableItem } from './SortableItem';

const ChapterManager = () => {
    const [chapters, setChapters] = useState([]);
    const [newChapter, setNewChapter] = useState({ title: '', description: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchChapters();
    }, []);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/chapters');

            // Ensure we always have an array
            const chaptersData = response.data;
            setChapters(Array.isArray(chaptersData) ? chaptersData : []);
        } catch (error) {
            console.error('Error fetching chapters:', error);
            setError('Failed to load chapters');
            setChapters([]); // Ensure chapters is always an array
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newChapter.title.trim()) {
            setError('Chapter title is required');
            return;
        }
        try {
            await axios.post('/api/admin/chapters', newChapter, { // lowercase 'c'
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setNewChapter({ title: '', description: '' });
            fetchChapters();
        } catch (error) {
            console.error('Error creating chapter:', error);
            setError('Failed to create chapter');
        }
    };

    const handleUpdate = async (id, updates) => {
        try {
            await axios.put(`/api/admin/chapters/${id}`, updates, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchChapters();
        } catch (error) {
            console.error('Error updating chapter:', error);
            setError('Failed to update chapter');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/chapters/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchChapters();
        } catch (error) {
            console.error('Error deleting chapter:', error);
            setError('Failed to delete chapter');
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.chapterId !== over.chapterId) {
            setChapters((prevChapters) => {
                // Ensure prevChapters is an array
                const chaptersArray = Array.isArray(prevChapters) ? prevChapters : [];

                const oldIndex = chaptersArray.findIndex(chapter => chapter.chapterId === active.chapterId);
                const newIndex = chaptersArray.findIndex(chapter => chapter.chapterId === over.chapterId);

                if (oldIndex === -1 || newIndex === -1) {
                    return chaptersArray; // Return unchanged if indices not found
                }

                const reorderedChapters = arrayMove(chaptersArray, oldIndex, newIndex);

                // Update order in database
                const orderMap = {};
                reorderedChapters.forEach((chap, index) => {
                    orderMap[chap._id] = index + 1;
                });

                axios.post('/api/admin/reorder/chapters', { orderMap }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }).catch(error => {
                    console.error('Error reordering chapters:', error);
                    setError('Failed to reorder chapters');
                });

                return reorderedChapters;
            });
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg">Loading chapters...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{error}</p>
                <button
                    onClick={fetchChapters}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Ensure chapters is always an array before rendering
    const chaptersArray = Array.isArray(chapters) ? chapters : [];

    return (
        <div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-3">Create New Chapter</h2>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Chapter Title"
                        value={newChapter.title}
                        onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                        className="flex-1 p-2 border rounded"
                    />
                    <button
                        onClick={handleCreate}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={!newChapter.title.trim()}
                    >
                        Create
                    </button>
                </div>
            </div>

            {chaptersArray.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No chapters found. Create your first chapter above.
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={chaptersArray.map(chapter => chapter.chapterId)}
                        strategy={verticalListSortingStrategy}
                    >
                        {chaptersArray.map(chapter => (
                            <SortableItem key={chapter.chapterId} id={chapter.chapterId}>
                                <div className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-lg">{chapter.title}</h3>
                                            {chapter.description && (
                                                <p className="text-sm text-gray-600 mt-2">{chapter.description}</p>
                                            )}
                                            <div className="text-xs text-gray-500 mt-2">
                                                Order: {chapter.order} | ID: {chapter.chapterId}
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => {
                                                    const newTitle = prompt('New title:', chapter.title);
                                                    if (newTitle && newTitle !== chapter.title) {
                                                        handleUpdate(chapter.chapterId, { title: newTitle });
                                                    }
                                                }}
                                                className="text-blue-500 hover:text-blue-700 px-2 py-1 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Are you sure you want to delete "${chapter.title}"?`)) {
                                                        handleDelete(chapter.chapterId);
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700 px-2 py-1 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </SortableItem>
                        ))}
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
};

export default ChapterManager;
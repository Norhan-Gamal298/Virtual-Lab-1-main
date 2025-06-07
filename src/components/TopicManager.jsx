import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
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


const TopicManager = () => {


    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState('');
    const [topics, setTopics] = useState([]);
    const [newTopic, setNewTopic] = useState({
        title: '',
        content: '',
        topicId: ''
    });
    const [editingTopic, setEditingTopic] = useState(null);
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

    useEffect(() => {
        if (selectedChapter) {
            fetchTopics();
        } else {
            setTopics([]); // Clear topics when no chapter selected
        }
    }, [selectedChapter]);

    const fetchChapters = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('/api/chapters');

            // Ensure we always have an array
            const chaptersData = response.data;
            const chaptersArray = Array.isArray(chaptersData) ? chaptersData : [];
            setChapters(chaptersArray);

            // Set first chapter as selected if none selected and chapters exist
            if (chaptersArray.length > 0 && !selectedChapter) {
                setSelectedChapter(chaptersArray[0]._id);
            }
        } catch (error) {
            console.error('Error fetching chapters:', error);
            setError('Failed to load chapters');
            setChapters([]); // Ensure chapters is always an array
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async () => {
        if (!selectedChapter) return;

        try {
            setError(null);
            const response = await axios.get(`/api/topics?chapterId=${selectedChapter}`);

            // Ensure we always have an array
            const topicsData = response.data;
            setTopics(Array.isArray(topicsData) ? topicsData : []);
        } catch (error) {
            console.error('Error fetching topics:', error);
            setError('Failed to load topics');
            setTopics([]); // Ensure topics is always an array
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result.split(',')[1];
            const markdownImage = `![${file.name}](data:${file.type};base64,${base64})`;

            setNewTopic(prev => ({
                ...prev,
                content: prev.content + '\n' + markdownImage
            }));
        };

        reader.readAsDataURL(file);
    };

    const handleCreate = async () => {
        if (!selectedChapter || !newTopic.title.trim() || !newTopic.topicId.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setError(null);
            await axios.post('/api/admin/topics', {
                ...newTopic,
                chapterId: selectedChapter
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            setNewTopic({ title: '', content: '', topicId: '' });
            fetchTopics();
        } catch (error) {
            console.error('Error creating topic:', error);
            setError('Failed to create topic');
        }
    };
    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/admin/topics/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            fetchTopics();
        } catch (error) {
            setError('Failed to delete topic');
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.topicId !== over.topicId) {
            setTopics((prevTopics) => {
                // Ensure prevTopics is an array
                const topicsArray = Array.isArray(prevTopics) ? prevTopics : [];

                const oldIndex = topicsArray.findIndex(topic => topic.topicId === active.topicId);
                const newIndex = topicsArray.findIndex(topic => topic.topicId === over.topicId);

                if (oldIndex === -1 || newIndex === -1) {
                    return topicsArray; // Return unchanged if indices not found
                }

                const reorderedTopics = arrayMove(topicsArray, oldIndex, newIndex);

                // Update order in database
                const orderMap = {};
                reorderedTopics.forEach((topic, index) => {
                    orderMap[topic.topicId] = index + 1;
                });

                axios.post('/api/admin/reorder/topics', {
                    chapterId: selectedChapter,
                    orderMap
                }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }).catch(error => {
                    console.error('Error reordering topics:', error);
                    setError('Failed to reorder topics');
                });

                return reorderedTopics;
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

    // Ensure arrays are always arrays
    const chaptersArray = Array.isArray(chapters) ? chapters : [];
    const topicsArray = Array.isArray(topics) ? topics : [];

    return (
        <div>
            {/* Error Display */}
            {error && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p>{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Chapter Selection */}
            <div className="mb-4">
                <label className="block mb-2 font-medium">Select Chapter:</label>
                {chaptersArray.length === 0 ? (
                    <div className="text-gray-500 italic">No chapters available. Please create chapters first.</div>
                ) : (
                    <select
                        value={selectedChapter}
                        onChange={(e) => setSelectedChapter(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    >
                        <option value="">Choose a chapter...</option>
                        {chaptersArray.map(chapter => (
                            <option key={chapter._id} value={chapter._id}>
                                {chapter.title}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* Topic Creation Form */}
            {selectedChapter && !editingTopic && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Create New Topic</h2>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Topic ID (e.g., chapter_1_1)"
                            value={newTopic.topicId}
                            onChange={(e) => setNewTopic({ ...newTopic, topicId: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Topic Title"
                            value={newTopic.title}
                            onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                        <textarea
                            placeholder="Markdown Content"
                            value={newTopic.content}
                            onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                            className="w-full p-2 border rounded min-h-[200px] font-mono"
                        />
                        <div>
                            <label className="block mb-2">Upload Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="mb-2"
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            disabled={!newTopic.title.trim() || !newTopic.topicId.trim()}
                        >
                            Create Topic
                        </button>
                    </div>
                </div>
            )}

            {/* Topics List */}
            {selectedChapter && (
                <div>
                    <h2 className="text-xl font-semibold mb-3">Topics</h2>
                    {topicsArray.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No topics found for this chapter. Create your first topic above.
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={topicsArray.map(topic => topic.topicId)}
                                strategy={verticalListSortingStrategy}
                            >
                                {topicsArray.map(topic => (
                                    <SortableItem key={topic.topicId} id={topic.topicId}>
                                        <div className="mb-4 p-4 border rounded-lg bg-white shadow-sm">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-lg">{topic.title}</h3>
                                                    <div className="text-xs text-gray-500 mt-2">
                                                        Topic ID: {topic.topicId} | Order: {topic.order}
                                                    </div>
                                                    {topic.content && (
                                                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
                                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                                                {topic.content.substring(0, 200)}
                                                                {topic.content.length > 200 ? '...' : ''}
                                                            </ReactMarkdown>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        onClick={() => setEditingTopic(topic)}
                                                        className="text-blue-500 hover:text-blue-700 px-2 py-1 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(topic.topicId)}
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
            )}
        </div>
    );
};

export default TopicManager;
import React, { useState, useEffect, useRef } from 'react';
import {
    Plus,
    Edit,
    Trash2,
    Save,
    X,
    ChevronUp,
    ChevronDown,
    FileText,
    Folder,
    Upload,
    Download,
    Eye,
    EyeOff
} from 'lucide-react';

// Simple Markdown Editor Component
const MarkdownEditor = ({ value, onChange, placeholder = "Enter markdown content..." }) => {
    const [isPreview, setIsPreview] = useState(false);
    const textareaRef = useRef(null);

    const insertMarkdown = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Reset cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 0);
    };

    const renderMarkdown = (markdown) => {
        // Simple markdown to HTML conversion for preview
        return markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^\)]+)\)/gim, '<a href="$2">$1</a>')
            .replace(/!\[([^\]]*)\]\(([^\)]+)\)/gim, '<img alt="$1" src="$2" style="max-width: 100%; height: auto;" />')
            .replace(/```([^`]+)```/gim, '<pre style="background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto;"><code>$1</code></pre>')
            .replace(/`([^`]+)`/gim, '<code style="background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px;">$1</code>')
            .replace(/\n/gim, '<br>');
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex items-center gap-2 flex-wrap">
                <button
                    type="button"
                    onClick={() => insertMarkdown('# ', '')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('## ', '')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 font-bold"
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 italic"
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('[', '](url)')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    title="Link"
                >
                    Link
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('![', '](image-url)')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    title="Image"
                >
                    Img
                </button>
                <button
                    type="button"
                    onClick={() => insertMarkdown('```\n', '\n```')}
                    className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                    title="Code Block"
                >
                    Code
                </button>
                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={() => setIsPreview(!isPreview)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 flex items-center gap-1"
                    >
                        {isPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                        {isPreview ? 'Edit' : 'Preview'}
                    </button>
                </div>
            </div>

            {/* Editor/Preview */}
            <div className="min-h-96">
                {isPreview ? (
                    <div
                        className="p-4 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
                    />
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-96 p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed"
                        style={{ minHeight: '400px' }}
                    />
                )}
            </div>
        </div>
    );
};

const Content = () => {
    const [chapters, setChapters] = useState([]);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('chapters');

    // Modal states
    const [showChapterModal, setShowChapterModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [editingChapter, setEditingChapter] = useState(null);
    const [editingTopic, setEditingTopic] = useState(null);

    // Form states
    const [chapterForm, setChapterForm] = useState({ id: '', title: '', order: 1 });
    const [topicForm, setTopicForm] = useState({
        id: '',
        title: '',
        chapterId: '',
        content: '',
        videoFile: null,
        images: []
    });

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    // Update loadData function
    // Updated loadData function
    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/topics');
            if (!response.ok) throw new Error('Failed to load data');

            const data = await response.json();

            // Create chapter list directly from API response
            const chapterList = data.map(ch => ({
                id: `chapter-${ch.chapterId}`,
                chapterId: ch.chapterId,
                title: ch.chapter,  // Use 'chapter' property instead of 'chapterTitle'
                order: ch.chapterId
            })).sort((a, b) => a.order - b.order);

            // Create topics list
            const allTopics = data.flatMap(ch =>
                ch.topics.map(t => ({
                    ...t,
                    id: t.id,
                    chapterId: ch.chapterId,
                    chapterTitle: ch.chapter,  // Use 'chapter' property
                    title: t.title || 'Untitled Topic',
                    videoPath: t.videoPath || null,
                    images: t.images || []
                }))
            );

            setChapters(chapterList);
            setTopics(allTopics);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    /* const extractChapterNumber = (chapterTitle) => {
        const match = chapterTitle.match(/^(\d+)/);
        return match ? parseInt(match[1]) : 0;
    }; */

    // Chapter operations
    const handleAddChapter = () => {
        setChapterForm({ id: '', title: '', order: chapters.length + 1 });
        setEditingChapter(null);
        setShowChapterModal(true);
    };

    const handleEditChapter = (chapter) => {
        setChapterForm(chapter);
        setEditingChapter(chapter);
        setShowChapterModal(true);
    };

    const handleSaveChapter = async () => {
        try {
            const url = editingChapter
                ? `/api/chapters/${editingChapter.id}`
                : '/api/chapters';

            const method = editingChapter ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chapterId: chapterForm.order,
                    chapterTitle: chapterForm.title
                })
            });

            if (!response.ok) throw new Error('Failed to save chapter');

            loadData();  // Refresh data
            setShowChapterModal(false);
        } catch (error) {
            console.error('Error saving chapter:', error);
        }
    };

    const handleDeleteChapter = async (chapterId) => {
        if (window.confirm('Are you sure you want to delete this chapter and all its topics?')) {
            setChapters(chapters.filter(ch => ch.id !== chapterId));
            setTopics(topics.filter(topic => topic.chapterId !== chapterId));
        }
    };

    const moveChapter = (chapterId, direction) => {
        const index = chapters.findIndex(ch => ch.id === chapterId);
        if (
            (direction === 'up' && index > 0) ||
            (direction === 'down' && index < chapters.length - 1)
        ) {
            const newChapters = [...chapters];
            const targetIndex = direction === 'up' ? index - 1 : index + 1;
            [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];

            // Update order
            newChapters.forEach((ch, i) => {
                ch.order = i + 1;
            });

            setChapters(newChapters);
        }
    };

    // Topic operations
    const handleAddTopic = (chapterId = null) => {
        // Ensure we have a valid chapter ID
        const validChapterId = chapterId || (chapters.length > 0 ? chapters[0].id : null);

        if (!validChapterId) {
            alert('Please create a chapter first');
            return;
        }

        setTopicForm({
            id: '',
            title: '',
            chapterId: validChapterId,
            content: '# New Topic\n\nStart writing your content here...',
            videoFile: null,
            images: []
        });
        setEditingTopic(null);
        setShowTopicModal(true);
    };

    const handleEditTopic = async (topic) => {
        try {
            // Load the markdown content
            const response = await fetch(`/api/docs/${topic.id}`);
            const content = await response.text();

            setTopicForm({
                ...topic,
                content: content
            });
            setEditingTopic(topic);
            setShowTopicModal(true);
        } catch (error) {
            console.error('Error loading topic content:', error);
        }
    };

    const handleSaveTopic = async () => {
        try {
            // Get the chapter title
            const chapter = chapters.find(ch => ch.id === topicForm.chapterId);

            if (!chapter) {
                throw new Error('Invalid chapter selected');
            }

            const payload = {
                ...topicForm,
                chapterTitle: chapter.title,
                chapterId: chapter.id // Ensure chapterId is included
            };

            const url = editingTopic
                ? `/api/topics/${editingTopic.id}`
                : '/api/topics';

            const method = editingTopic ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Failed to save topic');

            loadData();
            setShowTopicModal(false);
        } catch (error) {
            console.error('Error saving topic:', error);
            alert(`Error: ${error.message}`); // Show user-friendly error
        }
    };

    const handleDeleteTopic = async (topicId) => {
        if (window.confirm('Are you sure you want to delete this topic?')) {
            setTopics(topics.filter(topic => topic.id !== topicId));
        }
    };

    const handleFileUpload = (event, type) => {
        const files = Array.from(event.target.files);

        if (type === 'video') {
            setTopicForm({ ...topicForm, videoFile: files[0] });
        } else if (type === 'images') {
            setTopicForm({ ...topicForm, images: [...topicForm.images, ...files] });
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Content Management</h1>
                <div className="text-center py-8">Loading...</div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Content Management</h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-300 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('chapters')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'chapters'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Folder className="inline w-4 h-4 mr-1" />
                        Chapters
                    </button>
                    <button
                        onClick={() => setActiveTab('topics')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'topics'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <FileText className="inline w-4 h-4 mr-1" />
                        Topics
                    </button>
                </nav>
            </div>

            {/* Chapters Tab */}
            {activeTab === 'chapters' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Chapters</h2>
                        <button
                            onClick={handleAddChapter}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Chapter
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Topics
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {chapters.map((chapter) => (
                                    <tr key={`chapter-${chapter.id}`}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex items-center gap-1">
                                                {chapter.order}
                                                <div className="flex flex-col">
                                                    <button
                                                        onClick={() => moveChapter(chapter.id, 'up')}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <ChevronUp size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveChapter(chapter.id, 'down')}
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <ChevronDown size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {chapter.title}
                                        </td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {topics.filter(topic => topic.chapterId === chapter.id).length} topics
                                        </td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAddTopic(chapter.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Add Topic"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditChapter(chapter)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit Chapter"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteChapter(chapter.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete Chapter"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Topics Tab */}
            {activeTab === 'topics' && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Topics</h2>
                        <button
                            onClick={() => handleAddTopic()}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add Topic
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Chapter
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Has Video
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Images
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {topics.map((topic) => (
                                    <tr key={`topic-${topic.id}`}> {/* Add key here */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {topic.chapterTitle}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {topic.title}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {topic.videoPath ? 'Yes' : 'No'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {topic.images?.length || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleEditTopic(topic)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit Topic"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTopic(topic.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete Topic"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Chapter Modal */}
            {showChapterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingChapter ? 'Edit Chapter' : 'Add Chapter'}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={chapterForm.title}
                                    onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    placeholder="Chapter title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order
                                </label>
                                <input
                                    type="number"
                                    value={chapterForm.order}
                                    onChange={(e) => setChapterForm({ ...chapterForm, order: parseInt(e.target.value) })}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowChapterModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChapter}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <Save size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Topic Modal */}
            {showTopicModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingTopic ? 'Edit Topic' : 'Add Topic'}
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={topicForm.title}
                                        onChange={(e) => setTopicForm({ ...topicForm, title: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        placeholder="Topic title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chapter
                                    </label>
                                    <select
                                        value={topicForm.chapterId}
                                        onChange={(e) => setTopicForm({ ...topicForm, chapterId: e.target.value })}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                        required
                                    >
                                        {chapters.length === 0 ? (
                                            <option disabled value="">No chapters available</option>
                                        ) : (
                                            chapters.map((chapter) => (
                                                <option key={chapter.id} value={chapter.id}>
                                                    {chapter.title}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content (Markdown)
                                </label>
                                <MarkdownEditor
                                    value={topicForm.content}
                                    onChange={(content) => setTopicForm({ ...topicForm, content })}
                                    placeholder="Enter your markdown content..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Video File
                                    </label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={(e) => handleFileUpload(e, 'video')}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                    {topicForm.videoFile && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Selected: {topicForm.videoFile.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Images
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFileUpload(e, 'images')}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                    />
                                    {topicForm.images.length > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            {topicForm.images.length} image(s) selected
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => setShowTopicModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveTopic}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                            >
                                <Save size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Content;
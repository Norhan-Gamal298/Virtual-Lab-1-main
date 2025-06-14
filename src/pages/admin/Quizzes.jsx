import React, { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, Save, X, BookOpen, HelpCircle, CheckCircle, Search, Filter } from "lucide-react";

const initialForm = {
    chapterId: "",
    question: "",
    options: ["", "", "", ""],
    answer: "",
    chapterTitle: "",
};

export default function QuizQuestionsAdmin() {
    const [questions, setQuestions] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterChapter, setFilterChapter] = useState("");
    const [showForm, setShowForm] = useState(false);

    // Fetch all questions
    useEffect(() => {
        fetch("http://localhost:8080/api/quizs/all")
            .then(res => res.json())
            .then(data => {
                setQuestions(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error("Failed to fetch questions:", err));
    }, []);

    // Get unique chapters for filter
    const uniqueChapters = [...new Set(questions.map(q => q.chapterId))];

    // Filter questions based on search and chapter
    const filteredQuestions = questions.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.chapterTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesChapter = !filterChapter || q.chapterId === filterChapter;
        return matchesSearch && matchesChapter;
    });

    // Handle form input
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle options input
    const handleOptionChange = (idx, value) => {
        const newOptions = [...form.options];
        newOptions[idx] = value;
        setForm({ ...form, options: newOptions });
    };

    // Add or update question
    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        if (editingId) {
            // Update
            fetch(`http://localhost:8080/api/quizzes/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
                .then(res => res.json())
                .then(updated => {
                    setQuestions(questions.map(q => (q._id === editingId ? updated : q)));
                    handleCancel();
                })
                .catch(err => console.error("Failed to update question:", err));
        } else {
            // Add
            fetch("http://localhost:8080/api/quizs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })
                .then(res => res.json())
                .then(newQ => {
                    setQuestions([newQ, ...questions]);
                    handleCancel();
                })
                .catch(err => console.error("Failed to add question:", err));
        }
    };

    // Edit question
    const handleEdit = q => {
        setForm({
            chapterId: q.chapterId,
            question: q.question,
            options: q.options,
            answer: q.answer,
            chapterTitle: q.chapterTitle || "",
        });
        setEditingId(q._id);
        setShowForm(true);
    };

    // Cancel form
    const handleCancel = () => {
        setForm(initialForm);
        setEditingId(null);
        setShowForm(false);
    };

    // Delete question
    const handleDelete = id => {
        if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) return;

        fetch(`http://localhost:8080/api/quizzes/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => setQuestions(questions.filter(q => q._id !== id)))
            .catch(err => console.error("Failed to delete question:", err));
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <HelpCircle className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
                                <p className="text-slate-600 mt-1">Create and manage quiz questions</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Question</span>
                        </button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
                                <Edit3 className="h-5 w-5 text-blue-600" />
                                <span>{editingId ? "Edit Question" : "Add New Question"}</span>
                            </h2>
                            <button
                                onClick={handleCancel}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                            >
                                <X className="h-5 w-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Chapter ID
                                    </label>
                                    <input
                                        className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-lg transition-all duration-200"
                                        name="chapterId"
                                        placeholder="e.g., CH001"
                                        value={form.chapterId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Chapter Title
                                    </label>
                                    <input
                                        className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-lg transition-all duration-200"
                                        name="chapterTitle"
                                        placeholder="Chapter title (optional)"
                                        value={form.chapterTitle}
                                        onChange={handleChange}
                                    />
                                </div> */}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Question
                                </label>
                                <textarea
                                    className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-lg transition-all duration-200 resize-none"
                                    name="question"
                                    placeholder="Enter your question here..."
                                    value={form.question}
                                    onChange={handleChange}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Answer Options
                                </label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {form.options.map((opt, idx) => (
                                        <div key={idx} className="relative">
                                            <input
                                                className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 pl-12 rounded-lg transition-all duration-200"
                                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                                value={opt}
                                                onChange={e => handleOptionChange(idx, e.target.value)}
                                                required
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Correct Answer
                                </label>
                                <select
                                    className="w-full border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 px-4 py-3 rounded-lg transition-all duration-200"
                                    name="answer"
                                    value={form.answer}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select the correct answer</option>
                                    {form.options.map((opt, idx) => (
                                        opt && <option key={idx} value={opt}>{String.fromCharCode(65 + idx)}: {opt}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{editingId ? "Update Question" : "Add Question"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-lg transition-colors duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {/* <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <select
                                className="pl-10 pr-8 py-3 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 bg-white"
                                value={filterChapter}
                                onChange={(e) => setFilterChapter(e.target.value)}
                            >
                                <option value="">All Chapters</option>
                                {uniqueChapters.map(chapter => (
                                    <option key={chapter} value={chapter}>Chapter {chapter}</option>
                                ))}
                            </select>
                        </div> */}
                    </div>
                </div>

                {/* Questions List */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="p-6 border-b border-slate-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <span>Questions ({filteredQuestions.length})</span>
                            </h2>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-200">
                        {filteredQuestions.length === 0 ? (
                            <div className="p-8 text-center">
                                <HelpCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                <p className="text-slate-500 text-lg">No questions found</p>
                                <p className="text-slate-400 mt-2">
                                    {questions.length === 0 ? "Start by adding your first question" : "Try adjusting your search or filter"}
                                </p>
                            </div>
                        ) : (
                            filteredQuestions.map((q, index) => (
                                <div key={q._id} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Chapter {q.chapterId}
                                                </span>
                                                {q.chapterTitle && (
                                                    <span className="text-sm text-slate-600">{q.chapterTitle}</span>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-900 mb-3">{q.question}</h3>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <button
                                                onClick={() => handleEdit(q)}
                                                className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                title="Edit question"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q._id)}
                                                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                title="Delete question"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                        {q.options.map((opt, i) => (
                                            <div
                                                key={i}
                                                className={`flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 ${opt === q.answer
                                                    ? 'border-green-200 bg-green-50'
                                                    : 'border-slate-200 bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${opt === q.answer
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-slate-300 text-slate-700'
                                                    }`}>
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className={`flex-1 ${opt === q.answer ? 'font-medium text-green-900' : 'text-slate-700'}`}>
                                                    {opt}
                                                </span>
                                                {opt === q.answer && (
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center space-x-2 text-sm text-slate-500">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>Correct Answer: <span className="font-medium text-green-700">{q.answer}</span></span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
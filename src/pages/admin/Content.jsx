import React, { useState, useEffect, useRef } from "react";
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
  EyeOff,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

// Simple Markdown Editor Component
const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Enter markdown content...",
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef(null);

  const insertMarkdown = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      before +
      selectedText +
      after +
      value.substring(end);

    onChange(newText);

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const renderMarkdown = (markdown) => {
    // Simple markdown to HTML conversion for preview
    return markdown
      .replace(
        /^# (.*$)/gim,
        "<h1 class='dark:text-white text-[#1f1f1f]'>$1</h1>"
      )
      .replace(
        /^## (.*$)/gim,
        "<h2 class='dark:text-white text-[#1f1f1f]'>$1</h2>"
      )
      .replace(
        /^### (.*$)/gim,
        "<h3 class='dark:text-white text-[#1f1f1f]'>$1</h3>"
      )
      .replace(
        /\*\*(.*)\*\*/gim,
        "<strong class='dark:text-white text-[#1f1f1f]'>$1</strong>"
      )
      .replace(
        /\*(.*)\*/gim,
        "<em class='dark:text-white text-[#1f1f1f]'>$1</em>"
      )
      .replace(
        /\[([^\]]+)\]\(([^\)]+)\)/gim,
        '<a href="$2" class="text-blue-500 hover:underline">$1</a>'
      )
      .replace(
        /!\[([^\]]*)\]\(([^\)]+)\)/gim,
        '<img alt="$1" src="$2" class="max-w-full h-auto rounded-lg my-2" />'
      )
      .replace(
        /```([^`]+)```/gim,
        '<pre class="dark:bg-[#2a2a2a] bg-gray-100 p-4 rounded-lg overflow-x-auto my-2"><code class="dark:text-gray-300 text-gray-800">$1</code></pre>'
      )
      .replace(
        /`([^`]+)`/gim,
        '<code class="dark:bg-[#2a2a2a] bg-gray-100 px-2 py-1 rounded text-sm dark:text-gray-300 text-gray-800">$1</code>'
      )
      .replace(/\n/gim, "<br>");
  };

  return (
    <div className="border dark:border-[#3a3a3a] border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="dark:bg-[#2a2a2a] bg-gray-100 border-b dark:border-[#3a3a3a] border-gray-300 p-2 flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => insertMarkdown("# ", "")}
          className="px-2 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 dark:text-gray-300 text-gray-800"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("## ", "")}
          className="px-2 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 dark:text-gray-300 text-gray-800"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("**", "**")}
          className="px-2 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 dark:text-gray-300 text-gray-800 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("*", "*")}
          className="px-2 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 dark:text-gray-300 text-gray-800 italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("[", "](url)")}
          className="px-2 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 dark:text-gray-300 text-gray-800"
          title="Link"
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("![", "](image-url)")}
          className="px-2 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 dark:text-gray-300 text-gray-800"
          title="Image"
        >
          Img
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown("```\n", "\n```")}
          className="px-2 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 dark:text-gray-300 text-gray-800"
          title="Code Block"
        >
          Code
        </button>
        <div className="ml-auto">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="px-3 py-1 text-sm border dark:border-[#3a3a3a] border-gray-300 rounded dark:hover:bg-[#3a3a3a] hover:bg-gray-200 flex items-center gap-1 dark:text-gray-300 text-gray-800"
          >
            {isPreview ? <EyeOff size={14} /> : <Eye size={14} />}
            {isPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="min-h-96">
        {isPreview ? (
          <div
            className="p-4 prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-96 p-4 border-none outline-none resize-none font-mono text-sm leading-relaxed dark:bg-[#1f1f1f] bg-white dark:text-gray-300 text-gray-800"
            style={{ minHeight: "400px" }}
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
  const [activeTab, setActiveTab] = useState("chapters");

  // Modal states
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);

  // Form states
  const [chapterForm, setChapterForm] = useState({
    id: "",
    title: "",
    order: 1,
  });
  const [topicForm, setTopicForm] = useState({
    id: "",
    title: "",
    chapterId: "",
    content: "",
    videoFile: null,
    images: [],
  });

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/topics");
      if (!response.ok) throw new Error("Failed to load data");

      const chaptersData = await response.json();

      // Process chapters data
      const processedChapters = chaptersData.map((chapter) => ({
        id: `chapter-${chapter.chapterId}`,
        chapterId: chapter.chapterId,
        title: chapter.chapter,
        order: chapter.chapterId,
        topicsCount: chapter.topics.length,
      }));

      // Process all topics
      const allTopics = chaptersData.flatMap((chapter) =>
        chapter.topics.map((topic) => ({
          ...topic,
          id: topic.id,
          chapterId: chapter.chapterId,
          chapterTitle: chapter.chapter,
          title: topic.title || "Untitled Topic",
          videoPath: topic.videoPath || null,
          images: topic.images || [],
        }))
      );

      setChapters(processedChapters);
      setTopics(allTopics);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Chapter operations
  const handleAddChapter = () => {
    setChapterForm({ id: "", title: "", order: chapters.length + 1 });
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
        ? `${API_BASE_URL}/api/chapters/${editingChapter.chapterId}`
        : `${API_BASE_URL}/api/chapters`;

      const method = editingChapter ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: chapterForm.order,
          chapterTitle: chapterForm.title,
        }),
      });

      if (!response.ok) throw new Error("Failed to save chapter");

      loadData();
      setShowChapterModal(false);
    } catch (error) {
      console.error("Error saving chapter:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    try {
      // Extract numeric ID from "chapter-13" format
      const chapterIdNum = parseInt(chapterId.replace("chapter-", ""));

      if (isNaN(chapterIdNum)) {
        throw new Error("Invalid chapter ID");
      }

      if (
        !window.confirm(
          "Are you sure you want to delete this chapter and all its topics?"
        )
      ) {
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/chapters/${chapterIdNum}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add if using auth
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete chapter");
      }

      // Update UI state after successful deletion
      setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
      setTopics((prev) =>
        prev.filter((topic) => parseInt(topic.chapterId) !== chapterIdNum)
      );
    } catch (error) {
      console.error("Error deleting chapter:", error);
      alert(`Deletion failed: ${error.message}`);
    }
  };

  const moveChapter = (chapterId, direction) => {
    const index = chapters.findIndex((ch) => ch.id === chapterId);
    if (
      (direction === "up" && index > 0) ||
      (direction === "down" && index < chapters.length - 1)
    ) {
      const newChapters = [...chapters];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newChapters[index], newChapters[targetIndex]] = [
        newChapters[targetIndex],
        newChapters[index],
      ];

      // Update order
      newChapters.forEach((ch, i) => {
        ch.order = i + 1;
      });

      setChapters(newChapters);
    }
  };

  // Topic operations
  const handleAddTopic = (chapterId = null) => {
    const validChapterId =
      chapterId || (chapters.length > 0 ? chapters[0].id : null);

    if (!validChapterId) {
      alert("Please create a chapter first");
      return;
    }

    setTopicForm({
      id: "",
      title: "",
      chapterId: validChapterId,
      content: "# New Topic\n\nStart writing your content here...",
      videoFile: null,
      images: [],
    });
    setEditingTopic(null);
    setShowTopicModal(true);
  };

  const handleEditTopic = async (topic) => {
    try {
      const response = await fetch(`/api/docs/${topic.id}`);
      if (!response.ok) throw new Error("Failed to load content");
      const content = await response.text();

      setTopicForm({
        ...topic,
        chapterId: topic.chapterId,
        content: content,
        videoFile: null, // Reset video file for editing
        images: topic.images || [],
      });
      setEditingTopic(topic);
      setShowTopicModal(true);
    } catch (error) {
      console.error("Error loading topic content:", error);
    }
  };

const handleSaveTopic = async () => {
  try {
    // 1. Validate
    if (!topicForm.chapterId || !topicForm.title) {
      throw new Error("Chapter and title are required");
    }

    // 2. Prepare form data
    const formData = new FormData();
    formData.append("title", topicForm.title);
    formData.append("chapterId", topicForm.chapterId.toString());
    formData.append("content", topicForm.content || "");

    // 3. For existing topics, use their ID
    const topicId = editingTopic?.id;
    if (!topicId) throw new Error("Missing topic ID for update");

    // 4. Debug logs
    console.log("Sending update for topic:", topicId);
    console.log("FormData entries:", Array.from(formData.entries()));

    // 5. Make request
    const response = await fetch(`http://localhost:8080/api/topics/${topicId}`, {
      method: "PUT",
      body: formData,
      // Don't set Content-Type header - browser will do it automatically for FormData
    });

    // 6. Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Server response:", errorData);
      throw new Error(errorData.error || "Failed to save topic");
    }

    // 7. Success
    loadData();
    setShowTopicModal(false);
    alert("Topic updated successfully!");
  } catch (error) {
    console.error("Save error:", error);
    alert(`Error: ${error.message}`);
  }
};

  const handleDeleteTopic = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Add if using auth
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete topic");
      }

      // Update UI state after successful deletion
      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));

      // Show success message
      alert("Topic deleted successfully");
    } catch (error) {
      console.error("Error deleting topic:", error);
      alert(`Deletion failed: ${error.message}`);
    }
  };

  const handleFileUpload = (event, type) => {
    const files = Array.from(event.target.files);

    if (type === "video") {
      setTopicForm({ ...topicForm, videoFile: files[0] });
    } else if (type === "images") {
      setTopicForm({ ...topicForm, images: [...topicForm.images, ...files] });
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 dark:text-white text-[#1f1f1f]">
          Content Management
        </h1>
        <div className="text-center py-8 dark:text-gray-400 text-gray-600">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 dark:text-white text-[#1f1f1f]">
        Content Management
      </h1>

      {/* Tab Navigation */}
      <div className="border-b dark:border-[#3a3a3a] border-gray-300 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("chapters")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "chapters"
                ? "border-indigo-500 dark:text-white text-[#1f1f1f]"
                : "border-transparent dark:text-gray-400 text-gray-500 hover:dark:text-gray-300 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Folder className="inline w-4 h-4 mr-1" />
            Chapters
          </button>
          <button
            onClick={() => setActiveTab("topics")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "topics"
                ? "border-indigo-500 dark:text-white text-[#1f1f1f]"
                : "border-transparent dark:text-gray-400 text-gray-500 hover:dark:text-gray-300 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <FileText className="inline w-4 h-4 mr-1" />
            Topics
          </button>
        </nav>
      </div>

      {/* Chapters Tab */}
      {activeTab === "chapters" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white text-[#1f1f1f]">
              Chapters
            </h2>
            <button
              onClick={handleAddChapter}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Chapter
            </button>
          </div>

          <div className="dark:bg-[#1f1f1f] bg-white rounded-lg shadow overflow-hidden border dark:border-[#3a3a3a] border-gray-200">
            <table className="w-full">
              <thead className="dark:bg-[#2a2a2a] bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Topics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-[#3a3a3a] divide-gray-200">
                {chapters.map((chapter) => (
                  <tr
                    key={`chapter-${chapter.chapterId}`}
                    className="dark:hover:bg-[#2a2a2a] hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-gray-900">
                      <div className="flex items-center gap-1">
                        {chapter.order}
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveChapter(chapter.id, "up")}
                            className="dark:text-gray-400 text-gray-500 hover:dark:text-gray-300 hover:text-gray-700"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            onClick={() => moveChapter(chapter.id, "down")}
                            className="dark:text-gray-400 text-gray-500 hover:dark:text-gray-300 hover:text-gray-700"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white text-[#1f1f1f]">
                      {chapter.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400 text-gray-500">
                      {chapter.topicsCount} topics
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAddTopic(chapter.id)}
                          className="text-green-600 hover:text-green-800 dark:hover:text-green-400"
                          title="Add Topic"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleEditChapter(chapter)}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                          title="Edit Chapter"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
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
      {activeTab === "topics" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold dark:text-white text-[#1f1f1f]">
              Topics
            </h2>
            <button
              onClick={() => handleAddTopic()}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Topic
            </button>
          </div>

          <div className="dark:bg-[#1f1f1f] bg-white rounded-lg shadow overflow-hidden border dark:border-[#3a3a3a] border-gray-200">
            <table className="w-full">
              <thead className="dark:bg-[#2a2a2a] bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Chapter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Has Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-[#3a3a3a] divide-gray-200">
                {topics.map((topic) => (
                  <tr
                    key={`topic-${topic.id}`}
                    className="dark:hover:bg-[#2a2a2a] hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400 text-gray-500">
                      {topic.chapterTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white text-[#1f1f1f]">
                      {topic.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400 text-gray-500">
                      {topic.videoPath ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-400 text-gray-500">
                      {topic.images?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTopic(topic)}
                          className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400"
                          title="Edit Topic"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
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
          <div className="dark:bg-[#1f1f1f] bg-white rounded-lg p-6 w-full max-w-md border dark:border-[#3a3a3a] border-gray-200">
            <h3 className="text-lg font-semibold mb-4 dark:text-white text-[#1f1f1f]">
              {editingChapter ? "Edit Chapter" : "Add Chapter"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) =>
                    setChapterForm({ ...chapterForm, title: e.target.value })
                  }
                  className="w-full border dark:border-[#3a3a3a] border-gray-300 rounded-lg px-3 py-2 dark:bg-[#2a2a2a] bg-white dark:text-gray-300 text-gray-800"
                  placeholder="Chapter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={chapterForm.order}
                  onChange={(e) =>
                    setChapterForm({
                      ...chapterForm,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full border dark:border-[#3a3a3a] border-gray-300 rounded-lg px-3 py-2 dark:bg-[#2a2a2a] bg-white dark:text-gray-300 text-gray-800"
                  min="1"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowChapterModal(false)}
                className="px-4 py-2 dark:text-gray-300 text-gray-600 border dark:border-[#3a3a3a] border-gray-300 rounded-lg dark:hover:bg-[#3a3a3a] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChapter}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
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
          <div className="dark:bg-[#1f1f1f] bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border dark:border-[#3a3a3a] border-gray-200">
            <h3 className="text-lg font-semibold mb-4 dark:text-white text-[#1f1f1f]">
              {editingTopic ? "Edit Topic" : "Add Topic"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={topicForm.title}
                    onChange={(e) =>
                      setTopicForm({ ...topicForm, title: e.target.value })
                    }
                    className="w-full border dark:border-[#3a3a3a] border-gray-300 rounded-lg px-3 py-2 dark:bg-[#2a2a2a] bg-white dark:text-gray-300 text-gray-800"
                    placeholder="Topic title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Chapter
                  </label>
                  <select
                    value={topicForm.chapterId || ""}
                    onChange={(e) =>
                      setTopicForm({ ...topicForm, chapterId: e.target.value })
                    }
                    className="w-full border dark:border-[#3a3a3a] border-gray-300 rounded-lg px-3 py-2 dark:bg-[#2a2a2a] bg-white dark:text-gray-300 text-gray-800"
                    required
                  >
                    {chapters.map((chapter) => (
                      <option
                        key={chapter.id}
                        value={chapter.chapterId} // Use the numeric ID here
                      >
                        {chapter.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                  Content (Markdown)
                </label>
                <MarkdownEditor
                  value={topicForm.content}
                  onChange={(content) =>
                    setTopicForm({ ...topicForm, content })
                  }
                  placeholder="Enter your markdown content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Video File
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, "video")}
                    className="w-full border dark:border-[#3a3a3a] border-gray-300 rounded-lg px-3 py-2 dark:bg-[#2a2a2a] bg-white dark:text-gray-300 text-gray-800"
                  />
                  {topicForm.videoFile && (
                    <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
                      Selected: {topicForm.videoFile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium dark:text-gray-300 text-gray-700 mb-1">
                    Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, "images")}
                    className="w-full border dark:border-[#3a3a3a] border-gray-300 rounded-lg px-3 py-2 dark:bg-[#2a2a2a] bg-white dark:text-gray-300 text-gray-800"
                  />
                  {topicForm.images.length > 0 && (
                    <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">
                      {topicForm.images.length} image(s) selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowTopicModal(false)}
                className="px-4 py-2 dark:text-gray-300 text-gray-600 border dark:border-[#3a3a3a] border-gray-300 rounded-lg dark:hover:bg-[#3a3a3a] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTopic}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
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

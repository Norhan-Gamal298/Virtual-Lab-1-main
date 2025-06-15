import React, { useEffect, useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { FiEdit, FiPlus, FiX } from "react-icons/fi";

const initialForm = {
  title: "",
  author: "",
  content: "",
  image: "",
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8080/api/blogs/${editingId}`
      : "http://localhost:8080/api/blogs";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (editingId) {
          setBlogs(blogs.map((b) => (b._id === editingId ? data : b)));
        } else {
          setBlogs([data, ...blogs]);
        }
        setForm(initialForm);
        setEditingId(null);
      });
  };

  const handleEdit = (blog) => {
    setForm(blog);
    setEditingId(blog._id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Form */}
      <div className="dark:bg-[#1f1f1f] bg-white rounded-2xl p-8 mb-12 shadow-xl border dark:border-[#3a3a3a] border-gray-200">
        <h2 className="dark:text-white text-[#1f1f1f] text-3xl font-bold mb-6 flex items-center gap-2">
          {editingId ? <FiEdit /> : <FiPlus />}
          {editingId ? "Edit Blog" : "Add New Blog"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            name="title"
            placeholder="Blog Title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg dark:bg-[#2a2a2a] bg-gray-100 dark:text-white text-[#1f1f1f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border dark:border-[#3a3a3a] border-gray-300"
            required
          />
          <input
            name="author"
            placeholder="Author Name"
            value={form.author}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg dark:bg-[#2a2a2a] bg-gray-100 dark:text-white text-[#1f1f1f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border dark:border-[#3a3a3a] border-gray-300"
            required
          />
          <input
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg dark:bg-[#2a2a2a] bg-gray-100 dark:text-white text-[#1f1f1f] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 border dark:border-[#3a3a3a] border-gray-300"
          />
          <div data-color-mode="dark">
            <MDEditor
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              height={400}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition font-medium"
            >
              {editingId ? "Update Blog" : "Add Blog"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm);
                  setEditingId(null);
                }}
                className="dark:bg-[#3a3a3a] bg-gray-200 dark:hover:bg-[#4a4a4a] hover:bg-gray-300 dark:text-white text-[#1f1f1f] px-5 py-2 rounded-lg transition font-medium flex items-center gap-2"
              >
                <FiX />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Blog List */}
      <h2 className="text-2xl dark:text-white text-[#1f1f1f] font-semibold mb-6">All Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="relative dark:bg-[#1f1f1f] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group border dark:border-[#3a3a3a] border-gray-200"
          >
            {blog.image && (
              <div className="relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => handleEdit(blog)}
                  className="absolute top-3 right-3 text-white bg-black/50 backdrop-blur-md p-2 rounded-full hover:bg-black/70 transition"
                  title="Edit blog"
                >
                  <FiEdit size={16} />
                </button>
              </div>
            )}
            <div className="p-5 flex flex-col h-full">
              <h3 className="dark:text-white text-[#1f1f1f] text-xl font-semibold mb-2">
                {blog.title}
              </h3>
              <p className="dark:text-gray-400 text-gray-600 text-sm mb-4 line-clamp-3">
                {blog.content?.replace(/\n/g, ' ').slice(0, 200) +
                  (blog.content?.length > 200 ? "..." : "")}
              </p>
              <div className="flex justify-between items-center mt-auto text-sm dark:text-gray-400 text-gray-500">
                <span className="font-medium">{blog.author}</span>
                <span className="text-xs opacity-70">• Posted recently</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
import React, { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

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
    <div className="p-6">
      {/* Form */}
      <div className="bg-gray-900 rounded-xl p-6 mb-10 shadow-md max-w-3xl mx-auto">
        <h2 className="text-white text-2xl font-bold mb-4">
          {editingId ? "Edit Blog" : "Add Blog"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            name="author"
            placeholder="Author"
            value={form.author}
            onChange={handleChange}
            required
          />
          <input
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
          />
          <textarea
            className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400"
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
          />
          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
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
                className="text-white px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Blog Cards */}
      <h2 className="text-2xl text-white font-semibold mb-6">All Blogs</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="relative bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
          >
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
            )}
            <button
              onClick={() => handleEdit(blog)}
              className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 p-2 rounded-full transition"
              title="Edit blog"
            >
              <FiEdit size={16} />
            </button>
            <div className="p-4 flex flex-col h-full ">
              <div>
                <h3 className="text-white text-lg font-semibold">
                  {blog.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1 mb-3">
                  {blog.content.length > 100
                    ? blog.content.slice(0, 100) + "..."
                    : blog.content}
                </p>
              </div>
              <div className="flex justify-between items-center ">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <span className="font-medium">{blog.author}</span>
                  <span className="text-xs">• Posted recently</span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;

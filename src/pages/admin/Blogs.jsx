import React, { useEffect, useState } from "react";

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

  // Fetch blogs from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/blogs")
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update blog
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update
      fetch(`http://localhost:8080/api/blogs/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((updated) => {
          setBlogs(blogs.map((b) => (b._id === editingId ? updated : b)));
          setForm(initialForm);
          setEditingId(null);
        });
    } else {
      // Add
      fetch("http://localhost:8080/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
        .then((res) => res.json())
        .then((newBlog) => {
          setBlogs([newBlog, ...blogs]);
          setForm(initialForm);
        });
    }
  };

  // Edit blog
  const handleEdit = (blog) => {
    setForm({
      title: blog.title,
      author: blog.author,
      content: blog.content,
      image: blog.image,
    });
    setEditingId(blog._id);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white dark:bg-gray-900">
      <h2 className="text-2xl font-bold mb-4">
        {editingId ? "Edit Blog" : "Add Blog"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          className="w-full border px-3 py-2 rounded"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          name="author"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />
        <textarea
          className="w-full border px-3 py-2 rounded"
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Blog" : "Add Blog"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 rounded bg-gray-300"
            onClick={() => {
              setForm(initialForm);
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-xl font-bold mb-2">All Blogs</h2>
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded p-4 bg-white dark:bg-gray-900"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">{blog.title}</h3>
              <button
                className="text-indigo-600 underline"
                onClick={() => handleEdit(blog)}
              >
                Edit
              </button>
            </div>
            <div className="text-sm text-gray-500 mb-2">By {blog.author}</div>
            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full max-h-40 object-cover mb-2 rounded"
              />
            )}
            <div>
              {blog.content.slice(0, 120)}
              {blog.content.length > 120 && "..."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;

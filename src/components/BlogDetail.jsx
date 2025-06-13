import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function BlogDetail() {
  console.log("BlogDetail component rendered");
  const { id } = useParams();
  console.log("BlogDetail id param:", id);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching blog with id:", id);
    fetch(`http://localhost:8080/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched data:", data);
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found.</div>;

  return (
    <div>
      <h1>{blog.title}</h1>
      <p>By {blog.author}</p>
      {blog.image && <img src={blog.image} alt={blog.title} />}
      <div>{blog.content}</div>
    </div>
  );
}

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // <--- Import Framer Motion
import blogsData from '../../public/blogs/blogs.json';

export default function BlogDetail() {
  const { id } = useParams();
  const blog = blogsData.find((post) => post.id === parseInt(id));


  const formatPostTime = (createdAt) => {
    const now = new Date();
    const postDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Posted just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `Posted ${diffInMinutes} min${diffInMinutes === 1 ? '' : 's'} ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Posted ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `Posted ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;

    const options = { year: 'numeric', month: 'short' };
    return `Posted on ${postDate.toLocaleDateString('en-US', options)}`;
  };

  if (!blog) {
    return (
      <motion.div
        className="p-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-semibold">Blog not found.</h2>
        <Link to="/blogs" className="mt-4 inline-block text-blue-500 hover:underline">
          ← Back to Blogs
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">

      {/* Animated Title */}
      <motion.h1
        className="text-3xl sm:text-5xl font-bold mb-6 leading-tight poppins-bold text-[#EFF6FF]"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {blog.title}
      </motion.h1>

      {/* Animated Meta */}
      <motion.div
        className="text-gray-500 text-sm sm:text-base mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        By <span className="font-semibold">{blog.author}</span> • {formatPostTime(blog.createdAt)}
      </motion.div>

      {/* Animated Image */}
      {blog.image && (
        <motion.div
          className="flex justify-center mb-8"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full sm:w-[90%] max-h-[400px] object-cover rounded-2xl shadow-md"
          />
        </motion.div>
      )}

      {/* Animated Content */}
      <motion.div
        className="prose prose-lg max-w-none poppins-regular mb-8 text-[#EFF6FF]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {blog.content}
      </motion.div>

      {/* Back Link */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <Link
          to="/blogs"
          className="inline-block text-[#EFF6FF] hover:text-gray-400 font-medium transition duration-200"
        >
          ← Back to Blogs
        </Link>
      </motion.div>

    </div>
  );
}

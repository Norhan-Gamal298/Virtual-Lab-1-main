import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CgProfile } from "react-icons/cg";

// Skeleton Loading Component
const BlogSkeleton = () => {
    return (
        <div className="w-full h-full border border-[#3a3a3a] rounded-lg overflow-hidden bg-[#F9FAFB] dark:bg-[#1e1e1e] flex flex-col">
            {/* Image Skeleton */}
            <div className="w-full h-48 sm:h-56 bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse"></div>

            <div className="flex flex-col gap-3 p-6 flex-grow">
                {/* Title Skeleton */}
                <div className="h-6 w-3/4 bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse rounded"></div>

                {/* Content Skeleton */}
                <div className="space-y-2">
                    <div className="h-4 w-full bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse rounded"></div>
                    <div className="h-4 w-5/6 bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse rounded"></div>
                    <div className="h-4 w-4/5 bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse rounded"></div>
                </div>

                {/* Author Skeleton */}
                <div className="flex items-center gap-3 mt-auto pt-3 border-t border-[#3a3a3a]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse"></div>
                    <div className="min-w-0 flex-1">
                        <div className="h-4 w-1/2 bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse rounded mb-1"></div>
                        <div className="h-3 w-1/3 bg-gradient-to-r from-[#f0f0f0] dark:from-[#2a2a2a] to-[#e0e0e0] dark:to-[#333333] animate-pulse rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Blogs() {
    const [blogsData, setBlogsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch("http://localhost:8080/api/blogs")
            .then(res => res.json())
            .then(data => {
                setBlogsData(data);
                setIsLoading(false);
            })
            .catch(() => {
                setBlogsData([]);
                setIsLoading(false);
            });
    }, []);

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

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto min-h-screen">
            <h1 className="text-3xl md:text-3xl text-[#1F2937] dark:text-[#CBD5E1] mb-8 poppins-bold">Latest Blog Posts</h1>

            {isLoading ? (
                <div className="blogs-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.1,
                                duration: 0.5,
                                type: 'spring',
                                stiffness: 100
                            }}
                        >
                            <BlogSkeleton />
                        </motion.div>
                    ))}
                </div>
            ) : blogsData.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-[#CBD5E1]">No blog posts available yet.</p>
                </div>
            ) : (
                <div className="blogs-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogsData.map((post, index) => (
                        <Link to={`/blogs/${post.id}`} key={post.id} className="group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.5,
                                    type: 'spring',
                                    stiffness: 100
                                }}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                                }}
                                className="w-full h-full border border-[#3a3a3a] rounded-lg cursor-pointer overflow-hidden bg-[#F9FAFB] dark:bg-[#1e1e1e] hover:border-[#4a4a4a] transition-all duration-300 flex flex-col"
                            >
                                {post.image && (
                                    <div className="overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-48 sm:h-56! object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col gap-3 p-6 flex-grow">
                                    <h3 className="poppins-regular text-xl font-medium text-[#1F2937] dark:text-[#F3F4F6] line-clamp-2 group-hover:dark:text-[#ffffff] transition-colors duration-200">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-[#4B5563] dark:text-[#D1D5DB] line-clamp-3">
                                        {post.content.replace(/\n/g, ' ').slice(0, 120) + (post.content.length > 120 ? '...' : '')}
                                    </p>
                                    <div className='flex items-center gap-3 mt-auto pt-3 border-t border-[#3a3a3a]'>
                                        <div className="flex-shrink-0">
                                            <CgProfile size={32} className="text-[#1F2937] dark:text-[#CBD5E1]" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className='text-base font-medium text-[#1F2937] dark:text-[#CBD5E1] truncate'>{post.author}</h4>
                                            <span className='text-xs text-[#4B5563] dark:text-[#a1a1a1]'>{formatPostTime(post.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
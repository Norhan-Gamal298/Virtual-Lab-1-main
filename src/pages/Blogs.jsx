import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CgProfile } from "react-icons/cg";

export default function Blogs() {
    const [blogsData, setBlogsData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/blogs")
            .then(res => res.json())
            .then(data => setBlogsData(data))
            .catch(() => setBlogsData([]));
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
        <div className="blogs-container flex flex-wrap gap-6">
            {blogsData.map((post, index) => (
                <Link to={`/blogs/${post.id}`} key={post.id}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
                        whileHover={{ scale: 1.05 }}
                        className="w-[360px] border border-[#3a3a3a] rounded-[10px] cursor-pointer overflow-hidden bg-[#1f1f1f]"
                    >
                        {post.image && <img src={post.image} alt={post.title} className="w-full h-[240px] object-cover" />}
                        <div className="flex flex-col gap-3 mt-4 px-7 py-2 h-[180px]">
                            <div className="poppins-regular text-[22px] leading-6 line-clamp-2">{post.title}</div>
                            <div className="text-[14px] text-[#CBD5E1] line-clamp-3">
                                {post.content.replace(/\n/g, ' ').slice(0, 120) + (post.content.length > 120 ? '...' : '')}
                            </div>
                        </div>
                        <div className='authorIdentity my-2 flex items-center gap-3 px-7 py-1'>
                            <CgProfile size={40} />
                            <div>
                                <h4 className='text-[17px] text-[#ffffff]'>{post.author}</h4>
                                <span className='text-[14px]'>{formatPostTime(post.createdAt)}</span>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
// components/FeedbackTable.jsx
import React from 'react';
import { FiStar, FiMessageSquare, FiCalendar, FiUser, FiBook } from 'react-icons/fi';

const FeedbackTable = ({ feedback }) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#2d2d2d]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-[#2d2d2d]">
                <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <FiUser className="inline mr-1" /> User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <FiBook className="inline mr-1" /> Topic
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <FiStar className="inline mr-1" /> Rating
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <FiMessageSquare className="inline mr-1" /> Feedback
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <FiCalendar className="inline mr-1" /> Date
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#1f1f1f] divide-y divide-gray-200 dark:divide-[#2d2d2d]">
                    {feedback.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {item.email}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                {item.topicTitle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    {/* <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                        ({item.rating}/5)
                                    </span> */}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                {item.message || 'No feedback message'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {item.formattedDate}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FeedbackTable;
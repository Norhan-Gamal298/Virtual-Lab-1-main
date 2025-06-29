import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiUsers, FiBook, FiAward, FiActivity, FiTrendingUp, FiBarChart2, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import defaultAvatar from "../../assets/default-avatar.png";

const Dashboard = () => {
    const [showAllActivities, setShowAllActivities] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        userStats: {},
        contentStats: {},
        quizStats: {},
        topContributors: [],
        mostAchievedTopics: [],
        quizPerformance: [],
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data from server
    // Dashboard.jsx
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [
                    userStats,
                    contentStats,
                    quizStats,
                    topContributors,
                    mostAchievedTopics,
                    quizPerformance,
                    recentActivity
                ] = await Promise.all([
                    fetchWithAuth('/api/dashboard/user-stats'),
                    fetchWithAuth('/api/dashboard/content-stats'),
                    fetchWithAuth('/api/dashboard/quiz-stats'),
                    fetchWithAuth('/api/dashboard/top-contributors'),
                    fetchWithAuth('/api/dashboard/most-achieved-topics'),
                    fetchWithAuth('/api/dashboard/quiz-performance'),
                    fetchWithAuth(`/api/dashboard/recent-activity?showAll=${showAllActivities}`)
                ]);

                // Process responses and set state
                setDashboardData({
                    userStats: {
                        ...userStats,
                        roleDistribution: userStats.roleDistribution || [],
                        educationLevel: userStats.educationLevel || {},
                        professionalStatus: userStats.professionalStatus || {},
                        avgProgress: userStats.avgProgress || 0
                    },
                    contentStats: contentStats || {},
                    quizStats: quizStats || { averageScore: 0, completedQuizzes: 0 },
                    topContributors: topContributors || [],
                    mostAchievedTopics: mostAchievedTopics || [],
                    quizPerformance: quizPerformance || [],
                    recentActivity: recentActivity || []
                });
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showAllActivities]);

    // Helper function
    const fetchWithAuth = async (url) => {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return response.json();
    };

    // Colors for charts (aligned with sidebar indigo theme)
    const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];
    const BAR_COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'];

    // Card variants for animations
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    // User role distribution chart
    const RoleDistributionChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={dashboardData.userStats.roleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="role"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                    {dashboardData.userStats.roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value) => [`${value} users`, 'Count']}
                    contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        backgroundColor: 'var(--tooltip-bg)',
                        color: 'var(--tooltip-text)'
                    }}
                />
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ paddingTop: '20px' }}
                />
            </PieChart>
        </ResponsiveContainer>
    );

    // Top Contributors Component
    const TopContributors = ({ contributors }) => {
        if (!contributors || contributors.length === 0) {
            return (
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d]">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Top Contributors</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Users with most completed topics</p>
                    </div>
                    <div className="p-6 text-center">
                        <div className="flex flex-col items-center justify-center py-8">
                            <FiUsers className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                                No contributor data available
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Users will appear here once they complete topics
                            </p>
                        </div>
                    </div>
                </motion.div>
            );
        }

        return (
            <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d]">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Top Contributors</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Users with most completed topics</p>
                </div>
                <div className="p-6">
                    <ul className="divide-y divide-gray-200 dark:divide-[#2d2d2d]">
                        {contributors.map((contributor, index) => (
                            <li key={index} className="py-4 flex items-center">
                                <div className="flex-shrink-0">
                                    {contributor.profileImage ? (
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={`/api/profile/image/${contributor.userId || contributor._id}`}
                                            alt={contributor.name}
                                            onError={(e) => {
                                                e.target.src = defaultAvatar;
                                                e.target.onerror = null;
                                            }}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {contributor.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                        {contributor.email || 'No email'}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                                        {contributor.completedTopics} topics
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        );
    };

    // Most Achieved Topics Component
    const MostAchievedTopics = ({ topics }) => {
        return (
            <motion.div
                variants={cardVariants}
                className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
            >
                <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d]">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Most Achieved Topics</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Topics completed by most users</p>
                </div>
                <div className="p-6">
                    <ul className="divide-y divide-gray-200 dark:divide-[#2d2d2d]">
                        {topics.map((topic, index) => (
                            <li key={index} className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {topic.title}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                            {topic.chapterTitle}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                                            {topic.completedCount} completions
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        );
    };

    // Content stats chart
    const ContentStatsChart = () => (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={[
                    { name: 'Chapters', count: dashboardData.contentStats.chapters },
                    { name: 'Topics', count: dashboardData.contentStats.topics },
                    { name: 'Quizzes', count: dashboardData.contentStats.quizzes },
                    { name: 'Blogs', count: dashboardData.contentStats.blogs },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--chart-text)' }}
                    axisLine={{ stroke: 'var(--chart-text)' }}
                />
                <YAxis
                    tick={{ fill: 'var(--chart-text)' }}
                    axisLine={{ stroke: 'var(--chart-text)' }}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        backgroundColor: 'var(--tooltip-bg)',
                        color: 'var(--tooltip-text)'
                    }}
                />
                <Bar
                    dataKey="count"
                    radius={[4, 4, 0, 0]}
                >
                    {[
                        { name: 'Chapters', count: dashboardData.contentStats.chapters },
                        { name: 'Topics', count: dashboardData.contentStats.topics },
                        { name: 'Quizzes', count: dashboardData.contentStats.quizzes },
                        { name: 'Blogs', count: dashboardData.contentStats.blogs },
                    ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );

    // Recent activity table
    const RecentActivityTable = () => (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-[#2d2d2d] transition-all duration-300">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-[#2d2d2d]">
                <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Action
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Details
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#1f1f1f] divide-y divide-gray-200 dark:divide-[#2d2d2d]">
                    {dashboardData.recentActivity.map((activity, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {activity.user}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {activity.action}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                {activity.details}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                {new Date(activity.timestamp).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Quiz performance chart
    const QuizPerformanceChart = () => {
        if (!dashboardData) {
            return (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
            );
        }

        if (!dashboardData.quizPerformance || dashboardData.quizPerformance.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64 p-6 text-center">
                    <FiBarChart2 className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                        No quiz performance data
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Quiz data will appear here once users complete quizzes
                    </p>
                </div>
            );
        }
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={dashboardData.quizPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                    <XAxis
                        dataKey="chapter"
                        tick={{ fill: 'var(--chart-text)' }}
                        axisLine={{ stroke: 'var(--chart-text)' }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: 'var(--chart-text)' }}
                        axisLine={{ stroke: 'var(--chart-text)' }}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}%`, 'Average Score']}
                        contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            backgroundColor: 'var(--tooltip-bg)',
                            color: 'var(--tooltip-text)'
                        }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar
                        dataKey="averageScore"
                        name="Average Score"
                        fill="#6366f1"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    // Loading state
    if (loading || !dashboardData.userStats || !dashboardData.contentStats) {
        return (
            <div className="min-h-screen w-full p-6 bg-gray-50 dark:bg-[#1a1a1a]">
                <div className="flex justify-center items-center h-screen">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen w-full p-6 bg-gray-50 dark:bg-[#1a1a1a]">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 rounded-md" role="alert">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Error loading dashboard</h3>
                                <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-800/50 hover:bg-red-200 dark:hover:bg-red-800/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full p-6 ">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] p-6 mb-6"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                            <FiBarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                                Insights and analytics about your platform's performance
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] p-6 border-l-4 border-l-indigo-500"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                                <FiUsers className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {dashboardData.userStats.totalUsers}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`flex items-center ${dashboardData.userStats.newUsers > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {dashboardData.userStats.newUsers > 0 ? (
                                    <FiTrendingUp className="h-4 w-4 mr-1" />
                                ) : null}
                                +{dashboardData.userStats.newUsers} this week
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] p-6 border-l-4 border-l-indigo-400"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                                <FiActivity className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Active Learners</h3>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {dashboardData.userStats.activeUsers}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            {dashboardData.userStats.avgProgress}% average progress
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] p-6 border-l-4 border-l-indigo-300"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                                <FiBook className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Content Items</h3>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {dashboardData.contentStats.topics}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            {dashboardData.contentStats.chapters} chapters • {dashboardData.contentStats.quizzes} quizzes
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] p-6 border-l-4 border-l-indigo-200"
                    >
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                                <FiAward className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Avg. Quiz Score</h3>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {dashboardData.quizStats.averageScore}%
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            {dashboardData.quizStats.completedQuizzes} quizzes completed
                        </div>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6"
                >
                    <TopContributors contributors={dashboardData.topContributors} />
                    <MostAchievedTopics topics={dashboardData.mostAchievedTopics} />

                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d]">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">User Distribution</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Breakdown of users by role</p>
                        </div>
                        <div className="p-6">
                            <RoleDistributionChart />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d]">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Content Overview</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Platform content statistics</p>
                        </div>
                        <div className="p-6">
                            <ContentStatsChart />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d]">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Quiz Performance</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Average scores by chapter</p>
                        </div>
                        <div className="p-6">
                            <QuizPerformanceChart />
                        </div>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
                    >
                        <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d]">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">User Demographics</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Education and professional status</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">EDUCATION LEVEL</h4>
                                    <ul className="space-y-3">
                                        {Object.entries(dashboardData.userStats.educationLevel).map(([level, count]) => (
                                            <li key={level} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{level}</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{count} users</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">PROFESSIONAL STATUS</h4>
                                    <ul className="space-y-3">
                                        {Object.entries(dashboardData.userStats.professionalStatus).map(([status, count]) => (
                                            <li key={status} className="flex justify-between items-center">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{count} users</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Recent Activity */}
                {/* Recent Activity */}
                <motion.div
                    variants={cardVariants}
                    className="bg-white dark:bg-[#1f1f1f] rounded-lg shadow-sm border border-gray-200 dark:border-[#2d2d2d] overflow-hidden"
                >
                    <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2d2d2d] flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Activity</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Latest actions on the platform</p>
                        </div>
                        <button
                            type="button"  // Add this to ensure it's treated as a button, not submit
                            onClick={(e) => {
                                e.preventDefault();  // Prevent default behavior
                                setShowAllActivities(!showAllActivities);
                            }}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            {showAllActivities ? 'Show Less' : 'View All'}
                        </button>
                    </div>
                    <div className="p-6">
                        <RecentActivityTable />
                    </div>
                </motion.div>
            </div>

            <style jsx global>{`
                :root {
                    --tooltip-bg: white;
                    --tooltip-text: #374151;
                    --chart-grid: #e5e7eb;
                    --chart-text: #6b7280;
                }
                
                .dark {
                    --tooltip-bg: #1f1f1f;
                    --tooltip-text: #d1d5db;
                    --chart-grid: #2d2d2d;
                    --chart-text: #9ca3af;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
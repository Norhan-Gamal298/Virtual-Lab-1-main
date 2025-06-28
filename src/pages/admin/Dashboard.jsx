import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiUsers, FiBook, FiAward, FiActivity, FiTrendingUp, FiBarChart2, FiUser } from 'react-icons/fi';
const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data from server
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/dashboard/data', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch dashboard data');

                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Colors for charts (adapted for dark mode)
    const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const BAR_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

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
                <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200">
                        <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">Top Contributors</h3>
                        <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">No contributor data available</p>
                    </div>
                    <div className="p-6 text-center dark:text-gray-400 text-gray-500">
                        No users have completed topics yet
                    </div>
                </div>
            );
        }

        return (
            <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200">
                    <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">Top Contributors</h3>
                    <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">Users with most completed topics</p>
                </div>
                <div className="p-6">
                    <ul className="divide-y dark:divide-[#3a3a3a] divide-gray-200">
                        {contributors.map((contributor, index) => (
                            <li key={index} className="py-4 flex items-center">
                                <div className="flex-shrink-0">
                                    {contributor.profileImage ? (
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={contributor.profileImage}
                                            alt={contributor.name}
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1 min-w-0">
                                    <p className="text-sm font-medium dark:text-white text-gray-900 truncate">
                                        {contributor.name}
                                    </p>
                                    <p className="text-sm dark:text-gray-400 text-gray-500 truncate">
                                        {contributor.email || 'No email'}
                                    </p>
                                </div>
                                <div className="ml-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                                        {contributor.completedTopics} topics
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    // Most Achieved Topics Component
    const MostAchievedTopics = ({ topics }) => {
        return (
            <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200">
                    <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">Most Achieved Topics</h3>
                    <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">Topics completed by most users</p>
                </div>
                <div className="p-6">
                    <ul className="divide-y dark:divide-[#3a3a3a] divide-gray-200">
                        {topics.map((topic, index) => (
                            <li key={index} className="py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium dark:text-white text-gray-900 truncate">
                                            {topic.title}
                                        </p>
                                        <p className="text-sm dark:text-gray-400 text-gray-500 truncate">
                                            {topic.chapterTitle}
                                        </p>
                                    </div>
                                    <div className="ml-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                            {topic.completedCount} completions
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
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
                <CartesianGrid strokeDasharray="3 3" className="dark:stroke-[#3a3a3a] stroke-gray-300" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: 'currentColor' }}
                    className="dark:text-gray-400 text-gray-600"
                    axisLine={{ stroke: 'currentColor' }}
                />
                <YAxis
                    tick={{ fill: 'currentColor' }}
                    className="dark:text-gray-400 text-gray-600"
                    axisLine={{ stroke: 'currentColor' }}
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
        <div className="overflow-x-auto rounded-lg border dark:border-[#3a3a3a] border-gray-200 transition-all duration-300">
            <table className="min-w-full divide-y dark:divide-[#3a3a3a] divide-gray-200">
                <thead className="dark:bg-[#1f1f1f] bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                            User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                            Activity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium dark:text-gray-400 text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                    </tr>
                </thead>
                <tbody className="dark:bg-[#2a2a2a] bg-white divide-y dark:divide-[#3a3a3a] divide-gray-200 transition-all duration-300">
                    {dashboardData.recentActivity.map((activity, index) => (
                        <tr key={index} className="dark:hover:bg-[#3a3a3a] hover:bg-gray-50 transition-colors duration-300">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white text-gray-900">
                                {activity.user}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-gray-500">
                                {activity.action}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm dark:text-gray-300 text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Quiz performance chart
    const QuizPerformanceChart = () => {
        if (!dashboardData.quizPerformance || dashboardData.quizPerformance.length === 0) {
            return (
                <div className="flex items-center justify-center h-full">
                    <p className="dark:text-gray-400 text-gray-500">No quiz performance data available</p>
                </div>
            );
        }
        return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={dashboardData.quizPerformance}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="dark:stroke-[#3a3a3a] stroke-gray-300" />
                    <XAxis
                        dataKey="chapter"
                        tick={{ fill: 'currentColor' }}
                        className="dark:text-gray-400 text-gray-600"
                        axisLine={{ stroke: 'currentColor' }}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{ fill: 'currentColor' }}
                        className="dark:text-gray-400 text-gray-600"
                        axisLine={{ stroke: 'currentColor' }}
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
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                    />
                    <Bar
                        dataKey="averageScore"
                        name="Average Score"
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        );
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen w-full p-6">
                <div className="flex justify-center items-center h-screen">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 dark:text-gray-300 text-gray-600">Loading dashboard data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen w-full p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="dark:bg-red-900/30 bg-red-50 border-l-4 border-red-500 p-4 rounded-md" role="alert">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium dark:text-red-300 text-red-800">Error loading dashboard</h3>
                                <div className="mt-2 text-sm dark:text-red-200 text-red-700">
                                    <p>{error}</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md dark:text-red-200 text-red-700 dark:bg-red-800/50 bg-red-100 dark:hover:bg-red-800/70 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
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
        <div className="min-h-screen w-full p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 p-6 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                            <FiBarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold dark:text-white text-gray-900">Dashboard Overview</h1>
                            <p className="mt-1 dark:text-gray-400 text-gray-600">
                                Insights and analytics about your platform's performance
                            </p>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 p-6 border-l-4 border-l-indigo-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                                <FiUsers className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium dark:text-gray-400 text-gray-500">Total Users</h3>
                                <p className="text-2xl font-semibold dark:text-white text-gray-900">
                                    {dashboardData.userStats.totalUsers}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className={`flex items-center ${dashboardData.userStats.newUsers > 0 ? 'text-green-600 dark:text-green-400' : 'dark:text-gray-400 text-gray-500'}`}>
                                {dashboardData.userStats.newUsers > 0 ? (
                                    <FiTrendingUp className="h-4 w-4 mr-1" />
                                ) : null}
                                +{dashboardData.userStats.newUsers} this week
                            </span>
                        </div>
                    </div>

                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 p-6 border-l-4 border-l-green-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                                <FiActivity className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium dark:text-gray-400 text-gray-500">Active Learners</h3>
                                <p className="text-2xl font-semibold dark:text-white text-gray-900">
                                    {dashboardData.userStats.activeUsers}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm dark:text-gray-400 text-gray-500">
                            {dashboardData.userStats.avgProgress}% average progress
                        </div>
                    </div>

                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 p-6 border-l-4 border-l-purple-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                                <FiBook className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium dark:text-gray-400 text-gray-500">Content Items</h3>
                                <p className="text-2xl font-semibold dark:text-white text-gray-900">
                                    {dashboardData.contentStats.topics}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm dark:text-gray-400 text-gray-500">
                            {dashboardData.contentStats.chapters} chapters • {dashboardData.contentStats.quizzes} quizzes
                        </div>
                    </div>

                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 p-6 border-l-4 border-l-yellow-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300">
                                <FiAward className="h-6 w-6" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium dark:text-gray-400 text-gray-500">Avg. Quiz Score</h3>
                                <p className="text-2xl font-semibold dark:text-white text-gray-900">
                                    {dashboardData.quizStats.averageScore}%
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 text-sm dark:text-gray-400 text-gray-500">
                            {dashboardData.quizStats.completedQuizzes} quizzes completed
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <TopContributors contributors={dashboardData.topContributors} />
                    <MostAchievedTopics topics={dashboardData.mostAchievedTopics} />

                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200">
                            <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">User Distribution</h3>
                            <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">Breakdown of users by role</p>
                        </div>
                        <div className="p-6">
                            <RoleDistributionChart />
                        </div>
                    </div>

                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200">
                            <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">Content Overview</h3>
                            <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">Platform content statistics</p>
                        </div>
                        <div className="p-6">
                            <ContentStatsChart />
                        </div>
                    </div>

                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200">
                            <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">Quiz Performance</h3>
                            <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">Average scores by chapter</p>
                        </div>
                        <div className="p-6">
                            <QuizPerformanceChart />
                        </div>
                    </div>

                    <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200">
                            <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">User Demographics</h3>
                            <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">Education and professional status</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500 mb-3">EDUCATION LEVEL</h4>
                                    <ul className="space-y-3">
                                        {Object.entries(dashboardData.userStats.educationLevel).map(([level, count]) => (
                                            <li key={level} className="flex justify-between items-center">
                                                <span className="text-sm dark:text-gray-300 text-gray-700">{level}</span>
                                                <span className="text-sm font-medium dark:text-white text-gray-900">{count} users</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium dark:text-gray-400 text-gray-500 mb-3">PROFESSIONAL STATUS</h4>
                                    <ul className="space-y-3">
                                        {Object.entries(dashboardData.userStats.professionalStatus).map(([status, count]) => (
                                            <li key={status} className="flex justify-between items-center">
                                                <span className="text-sm dark:text-gray-300 text-gray-700">{status}</span>
                                                <span className="text-sm font-medium dark:text-white text-gray-900">{count} users</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="dark:bg-[#2a2a2a] bg-white rounded-xl shadow-sm border dark:border-[#3a3a3a] border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b dark:border-[#3a3a3a] border-gray-200 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium leading-6 dark:text-white text-gray-900">Recent Activity</h3>
                            <p className="mt-1 text-sm dark:text-gray-400 text-gray-500">Latest actions on the platform</p>
                        </div>
                        <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                            View All
                        </button>
                    </div>
                    <div className="p-6">
                        <RecentActivityTable />
                    </div>
                </div>
            </div>

            <style jsx>{`
                :root {
                    --tooltip-bg: white;
                    --tooltip-text: #374151;
                }
                
                .dark {
                    --tooltip-bg: #2a2a2a;
                    --tooltip-text: #d1d5db;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
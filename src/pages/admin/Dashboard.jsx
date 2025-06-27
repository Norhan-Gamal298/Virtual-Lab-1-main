import React, { useState, useEffect } from 'react';
import {
    Users as UsersIcon,
    Book as BookIcon,
    FileText as FileTextIcon,
    CheckCircle as CheckCircleIcon,
    XCircle as XCircleIcon,
    Activity as ActivityIcon,
    Clock as ClockIcon
} from 'react-feather';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// StatCard Component
const StatCard = ({ title, value, icon, change, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 border-gray-200 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="text-2xl font-bold mt-1 dark:text-white">{value}</h3>
                    {change && (
                        <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">{change}</p>
                    )}
                </div>
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                    {icon}
                </div>
            </div>
        </div>
    );
};

// ActivityLog Component
const ActivityLog = ({ items }) => {
    if (!items || items.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No recent activity
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <ActivityIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium dark:text-white">
                            {item.action}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.details}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            {new Date(item.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Dashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        activeUsers: 0,
        blockedUsers: 0,
        chapters: 0,
        topics: 0,
        quizzes: 0,
        blogs: 0,
        recentActivity: []
    });

    const [userGrowth, setUserGrowth] = useState([]);
    const [contentDistribution, setContentDistribution] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all required data
                const [
                    userStatsResponse,
                    userRegistrationsResponse,
                    contentEngagementResponse,
                    recentActivityResponse
                ] = await Promise.all([
                    fetch('/api/user-stats'),
                    fetch('/api/user-registrations'),
                    fetch('/api/content-engagement'),
                    fetch('/api/recent-activity')
                ]);

                // Check for errors
                const errors = [];
                if (!userStatsResponse.ok) errors.push('Failed to fetch user statistics');
                if (!userRegistrationsResponse.ok) errors.push('Failed to fetch user registrations');
                if (!contentEngagementResponse.ok) errors.push('Failed to fetch content engagement');
                if (!recentActivityResponse.ok) errors.push('Failed to fetch recent activity');

                if (errors.length > 0) {
                    throw new Error(errors.join(', '));
                }

                // Parse responses
                const [
                    userStats,
                    userRegistrations,
                    contentEngagement,
                    recentActivity
                ] = await Promise.all([
                    userStatsResponse.json(),
                    userRegistrationsResponse.json(),
                    contentEngagementResponse.json(),
                    recentActivityResponse.json()
                ]);

                // Process user growth data for chart
                const growthData = userRegistrations.map(item => ({
                    date: item._id,
                    count: item.count
                })).sort((a, b) => new Date(a.date) - new Date(b.date));

                setUserGrowth(growthData);

                // Process content distribution
                const distributionData = [
                    { name: 'Chapters', value: contentEngagement.chapters || 0 },
                    { name: 'Topics', value: contentEngagement.topics || 0 },
                    { name: 'Quizzes', value: contentEngagement.quizzes || 0 },
                    { name: 'Blogs', value: contentEngagement.blogs || 0 }
                ];
                setContentDistribution(distributionData);

                // Set stats
                setStats({
                    users: userStats.totalUsers || 0,
                    activeUsers: userStats.activeUsers || 0,
                    blockedUsers: userStats.blockedUsers || 0,
                    chapters: contentEngagement.chapters || 0,
                    topics: contentEngagement.topics || 0,
                    quizzes: contentEngagement.quizzes || 0,
                    blogs: contentEngagement.blogs || 0,
                    recentActivity: recentActivity || []
                });

            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Prepare chart data
    const userGrowthData = {
        labels: userGrowth.map(item => item.date),
        datasets: [
            {
                label: 'New Users',
                data: userGrowth.map(item => item.count),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                tension: 0.1
            }
        ]
    };

    const contentDistributionData = {
        labels: contentDistribution.map(item => item.name),
        datasets: [
            {
                data: contentDistribution.map(item => item.value),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.7)',
                    'rgba(79, 70, 229, 0.7)',
                    'rgba(129, 140, 248, 0.7)',
                    'rgba(165, 180, 252, 0.7)'
                ],
                borderColor: [
                    'rgba(99, 102, 241, 1)',
                    'rgba(79, 70, 229, 1)',
                    'rgba(129, 140, 248, 1)',
                    'rgba(165, 180, 252, 1)'
                ],
                borderWidth: 1
            }
        ]
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-bold">Error loading dashboard</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value={stats.users}
                    icon={<UsersIcon size={20} />}
                    change={`${Math.round((stats.users / (stats.users + 10)) * 100)}% of target`}
                />
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers}
                    icon={<CheckCircleIcon size={20} />}
                    change={`${Math.round((stats.activeUsers / stats.users) * 100)}% active`}
                />
                <StatCard
                    title="Blocked Users"
                    value={stats.blockedUsers}
                    icon={<XCircleIcon size={20} />}
                    change={`${Math.round((stats.blockedUsers / stats.users) * 100)}% of total`}
                />
                <StatCard
                    title="Content Items"
                    value={stats.topics}
                    icon={<BookIcon size={20} />}
                    change={`${stats.chapters} chapters`}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">User Growth</h3>
                    <div className="h-64">
                        <Line
                            data={userGrowthData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 dark:text-white">Content Distribution</h3>
                    <div className="h-64">
                        <Pie
                            data={contentDistributionData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700 border-gray-200">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h3>
                <ActivityLog items={stats.recentActivity} />
            </div>
        </div>
    );
};

export default Dashboard;
import React, { useState } from 'react';
import { ChevronDown, Search, Book, Users, Settings, HelpCircle, BookOpen, BarChart3 } from 'lucide-react';

const Faq = () => {
    const [openItems, setOpenItems] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');

    const faqData = [
        {
            category: 'platform',
            icon: <Book className="w-5 h-5" />,
            question: "What is the Virtual Lab platform?",
            answer: "It's an interactive online platform that simulates real-life lab experiences. It helps you understand scientific concepts and techniques through virtual experiments, guided lessons, and quizzes."
        },
        {
            category: 'platform',
            icon: <Users className="w-5 h-5" />,
            question: "Who can use the platform?",
            answer: "The platform is designed for university students, especially those in science or engineering courses that involve lab work."
        },
        {
            category: 'platform',
            icon: <Settings className="w-5 h-5" />,
            question: "Do I need to install anything?",
            answer: "No, it's a web-based application. You only need a browser and an internet connection."
        },
        {
            category: 'lessons',
            icon: <BookOpen className="w-5 h-5" />,
            question: "How do I start a new experiment or lesson?",
            answer: "From the sidebar, go to the Chapters and Topics tab, choose a chapter, and select a topic to begin."
        },
        {
            category: 'lessons',
            icon: <Book className="w-5 h-5" />,
            question: "How are the lessons structured?",
            answer: "Each lesson includes: A brief theoretical introduction, Step-by-step simulation, Interactive tasks, and A summary and review."
        },
        {
            category: 'lessons',
            icon: <HelpCircle className="w-5 h-5" />,
            question: "What if I don't understand something in the lesson?",
            answer: "You can: Revisit the lesson, Use tooltips and popups for definitions, or Check the FAQ or support section."
        },
        {
            category: 'experiments',
            icon: <Settings className="w-5 h-5" />,
            question: "Can I perform experiments like in a real lab?",
            answer: "Yes! Simulations are designed to mimic real lab behavior. You can adjust variables, observe changes, and repeat experiments."
        },
        {
            category: 'experiments',
            icon: <BarChart3 className="w-5 h-5" />,
            question: "Will my progress be saved if I leave in the middle?",
            answer: "Yes, your progress is saved automatically, and you can resume where you left off."
        },
        {
            category: 'quizzes',
            icon: <BookOpen className="w-5 h-5" />,
            question: "Where can I find quizzes?",
            answer: "Switch to the Quizzes tab in the sidebar and select the chapter quiz you want to take."
        },
        {
            category: 'quizzes',
            icon: <HelpCircle className="w-5 h-5" />,
            question: "How many questions are in each quiz?",
            answer: "Each quiz has 5–10 multiple-choice questions, randomized from a question bank."
        },
        {
            category: 'quizzes',
            icon: <BarChart3 className="w-5 h-5" />,
            question: "Can I retake a quiz?",
            answer: "Yes, you can retake quizzes as many times as you like. Each attempt may give different questions."
        },
        {
            category: 'quizzes',
            icon: <BarChart3 className="w-5 h-5" />,
            question: "Will I see my quiz results?",
            answer: "Yes, after submitting, you'll see: Your score, Correct answers, and Detailed feedback."
        },
        {
            category: 'progress',
            icon: <BarChart3 className="w-5 h-5" />,
            question: "Can I see my progress?",
            answer: "Yes, your learning progress, completed chapters, and quiz scores are tracked and viewable in your profile."
        },
        {
            category: 'progress',
            icon: <BarChart3 className="w-5 h-5" />,
            question: "Can I export my results?",
            answer: "Currently, only admins/teachers can export student progress, but you can view it on your dashboard anytime."
        },
        {
            category: 'account',
            icon: <Users className="w-5 h-5" />,
            question: "How do I create an account?",
            answer: "Your account may be created by your course instructor. If self-registration is enabled, just sign up using your email and student ID."
        },
        {
            category: 'account',
            icon: <Settings className="w-5 h-5" />,
            question: "I forgot my password. What should I do?",
            answer: "Click on \"Forgot Password?\" at the login page to reset it."
        },
        {
            category: 'account',
            icon: <Users className="w-5 h-5" />,
            question: "Can I update my personal details?",
            answer: "Yes, go to your profile and click Edit Profile to update your name, email, or password."
        },
        {
            category: 'support',
            icon: <Settings className="w-5 h-5" />,
            question: "The simulation isn't working. What can I do?",
            answer: "Try the following: Refresh the page, Use a supported browser (e.g., Chrome or Firefox), Clear your browser cache, or Ensure JavaScript is enabled."
        },
        {
            category: 'support',
            icon: <HelpCircle className="w-5 h-5" />,
            question: "I found a bug. How can I report it?",
            answer: "Use the Contact Support button or send feedback through the form in your profile."
        },
        {
            category: 'support',
            icon: <Users className="w-5 h-5" />,
            question: "Can I show this to my teacher or supervisor?",
            answer: "Absolutely. The platform is built to enhance your coursework. Teachers can track student activity, add custom content, and monitor progress."
        }
    ];

    const categories = [
        { id: 'all', name: 'All Questions', icon: <HelpCircle className="w-4 h-4" /> },
        { id: 'platform', name: 'Platform Basics', icon: <Book className="w-4 h-4" /> },
        { id: 'lessons', name: 'Lessons & Learning', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'experiments', name: 'Experiments', icon: <Settings className="w-4 h-4" /> },
        { id: 'quizzes', name: 'Quizzes', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'progress', name: 'Progress Tracking', icon: <BarChart3 className="w-4 h-4" /> },
        { id: 'account', name: 'Account Management', icon: <Users className="w-4 h-4" /> },
        { id: 'support', name: 'Support & Troubleshooting', icon: <HelpCircle className="w-4 h-4" /> }
    ];

    const toggleItem = (index) => {
        setOpenItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const filteredFAQs = faqData.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen poppins-regular">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#612EBE] rounded-full mb-6">
                        <HelpCircle className="w-8 h-8 text-[#fff]" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl max-w-2xl mx-auto">
                        Everything you need to know about the Virtual Lab platform
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ">
                        <Search className="h-5 w-5 dark:text-[#612EBE]" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search questions..."
                        className="block w-full pl-10 pr-3 py-4 rounded-xl leading-5 border border-[#E5E7EB] dark:border-[#292929] bg-[#F9FAFB] dark:bg-[#0f0f0f] placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[#612ebe] focus:border-transparent transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Category Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="border border-[#E5E7EB] dark:border-[#292929]  rounded-xl shadow-sm p-6 sticky top-6">
                            <h3 className="text-lg font-semibold mb-4">Categories</h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveCategory(category.id)}
                                        className={`w-full flex items-center space-x-3 border border-[transparent] px-3 py-2 rounded-lg text-left transition-all duration-200 ${activeCategory === category.id
                                            ? 'bg-[#F3E8FF] text-[#612EBE] border border-[#612EBE]'
                                            : 'hover:bg-[#F3E8FF] hover:text-gray-900'
                                            }`}
                                    >
                                        {category.icon}
                                        <span className="text-sm font-regular">{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="lg:col-span-3">
                        <div className="space-y-4">
                            {filteredFAQs.length > 0 ? (
                                filteredFAQs.map((item, index) => (
                                    <div
                                        key={index}
                                        className="rounded-xl shadow-sm border border-[#E5E7EB] dark:border-[#292929] bg-[#F9FAFB] dark:bg-[#0f0f0f] overflow-hidden transition-all duration-200 hover:shadow-md"
                                    >
                                        <button
                                            onClick={() => toggleItem(index)}
                                            className="w-full px-6 py-5 text-left flex items-center justify-between dark:hover:bg-[#1f1f1f] transition-colors duration-200"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0 dark:text-[#fff]">
                                                    {item.icon}
                                                </div>
                                                <h3 className="text-lg font-light dark:text-[#fff] pr-4">
                                                    {item.question}
                                                </h3>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <ChevronDown
                                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openItems[index] ? 'transform rotate-180' : ''
                                                        }`}
                                                />
                                            </div>
                                        </button>

                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openItems[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            <div className="px-6 pb-5">
                                                <div className="pt-2 border-t border-[#3d3d3d]">
                                                    <p className="dark:text-[#D1D5DB] leading-relaxed mt-3">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                        <Search className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No questions found
                                    </h3>
                                    <p className="text-gray-600">
                                        Try adjusting your search or category filter
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Support CTA */}
                <div className="mt-16 bg-gradient-to-r from-[#8434f5] to-[#5d2bb5] rounded-2xl p-8 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Still have questions?
                        </h2>
                        <p className="text-blue-100 mb-6">
                            Our support team is here to help you get the most out of the Virtual Lab platform
                        </p>
                        <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors duration-200 shadow-sm">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Faq;
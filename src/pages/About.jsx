import React from 'react'

import about_img from "../assets/about_main_img.png"
import ayaImg from "../assets/team/ayaImg.jpg"
import mahmoudImg from "../assets/team/mahmoudImg.jpg"
import martinImg from "../assets/team/martinImg.jpg"
import omarImg from "../assets/team/omarImg.jpg"
import yousefImg from "../assets/team/yousefImg.jpg"
import norhanImg from "../assets/team/norhanImg.jpg"
import ahmedImg from "../assets/team/ahmedImg.JPG"
import sayedImg from "../assets/team/sayedImg.jpg"

import { RxCode } from "react-icons/rx";
import { LuPresentation } from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";
import { AiFillExperiment } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";

const teamMembers = [
    {
        name: "Ahmed Omar",
        role: "Frontend Team",
        image: ahmedImg,
    },
    {
        name: "Martin Maged",
        role: "Frontend Team",
        image: martinImg,
    },
    {
        name: "Mohamed El-Sayed",
        role: "Frontend Team",
        image: sayedImg,
    },
    {
        name: "Norhan Gamal",
        role: "Backend Team",
        image: norhanImg,
    },
    {
        name: "Youssef Ahmed",
        role: "Backend Team",
        image: yousefImg,
    },
    {
        name: "Omar Samir",
        role: "Material Formatting",
        image: omarImg,
    },
    {
        name: "Mahmoud Ramadan",
        role: "Material Formatting",
        image: mahmoudImg,
    },
    {
        name: "Aya Pasha",
        role: "Material Formatting",
        image: ayaImg,
    }
];

const About = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleDocsClick = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/topics");
            if (!response.ok) throw new Error("Failed to fetch topics");
            const data = await response.json();

            const sortedChapters = [...data].sort((a, b) => {
                const numA = parseInt(a.chapter?.match(/^\d+/)?.[0] || "0", 10);
                const numB = parseInt(b.chapter?.match(/^\d+/)?.[0] || "0", 10);
                return numA - numB;
            });

            const allTopics = sortedChapters.flatMap((chapter) =>
                [...chapter.topics].sort((a, b) => {
                    const getParts = (t) => {
                        const match = t.id.match(/^chapter_(\d+)_(\d+)_(\d+)_/);
                        return match
                            ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
                            : [0, 0, 0];
                    };
                    const [a1, a2, a3] = getParts(a);
                    const [b1, b2, b3] = getParts(b);
                    return a1 - b1 || a2 - b2 || a3 - b3;
                })
            );

            if (allTopics.length > 0) {
                navigate(`/docs/${allTopics[0].id}`);
            } else {
                alert("No topics available.");
            }
        } catch (error) {
            console.error("Error loading docs:", error);
        }
    };

    return (
        <div className="min-h-screen dark:from-[#0a0a0a] dark:via-[#1a0a1a] dark:to-[#0a0a1a] relative px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 mx-auto poppins-regular">

            {/* Background Pattern Overlay */}
            <div className="absolute inset-0 opacity-30 dark:opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-100/20 to-transparent dark:via-purple-900/10"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 sm:gap-12 mb-16 sm:mb-24">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-[#612EBE] via-[#8434f5] to-[#5d2bb5] bg-clip-text text-transparent">
                            Who We Are at Virtual Lab
                        </h1>
                        <p className="text-base sm:text-lg mb-6 text-gray-700 dark:text-gray-300">
                            Empowering learners to explore the world of Image Processing & Computer Vision through innovative virtual experiences.
                        </p>
                        <div className="flex justify-center md:justify-start">
                            <button
                                onClick={handleDocsClick}
                                className="bg-gradient-to-r from-[#612EBE] to-[#8434f5] text-white px-8 py-4 rounded-xl hover:from-[#5d2bb5] hover:to-[#612EBE] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto text-center font-semibold"
                            >
                                Start Learning
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="w-full rounded-xl flex items-center justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#612EBE] to-[#8434f5] rounded-[1rem] blur-xl opacity-30"></div>
                                <img
                                    className="relative w-[600px] max-w-md sm:max-w-lg rounded-[1rem] shadow-2xl border border-white/20"
                                    src={about_img}
                                    alt="Virtual Lab About"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-24">
                    <div className="bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/30 p-6 sm:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#612EBE] to-[#8434f5] rounded-full flex items-center justify-center mr-4">
                                <HiOutlineLightBulb className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Democratize access to high-quality image processing education through cutting-edge virtual laboratory experiences.
                        </p>
                    </div>
                    <div className="bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/30 p-6 sm:p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#8434f5] to-[#5d2bb5] rounded-full flex items-center justify-center mr-4">
                                <AiFillExperiment className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Our Vision</h2>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            Bridge the gap between theory and real-world applications, creating the next generation of computer vision experts.
                        </p>
                    </div>
                </div>

                {/* What Makes Us Unique */}
                <div className="mb-16 sm:mb-24">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left text-gray-900 dark:text-white">
                        What Makes Virtual Lab
                        <span className="bg-gradient-to-r from-[#612EBE] to-[#8434f5] bg-clip-text text-transparent"> Unique</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            {
                                icon: (<RxCode size={32} className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" />),
                                title: "Hands-on Labs",
                                desc: "With OpenCV/MATLAB",
                                gradient: "from-blue-500 to-purple-600"
                            },
                            {
                                icon: (<LuPresentation size={32} className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" />),
                                title: "Expert-led Sessions",
                                desc: "Live & recorded",
                                gradient: "from-purple-500 to-pink-600"
                            },
                            {
                                icon: (<HiOutlineLightBulb size={32} className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" />),
                                title: "Real-world Cases",
                                desc: "Projects & challenges",
                                gradient: "from-pink-500 to-red-500"
                            },
                            {
                                icon: (<AiFillExperiment size={32} className="sm:w-10 sm:h-10 lg:w-12 lg:h-12" />),
                                title: "Virtual Experiments",
                                desc: "Interactive simulations",
                                gradient: "from-indigo-500 to-purple-600"
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="group bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/30 p-6 sm:p-8 lg:p-12 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                        <div className="text-white">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div id="team" className="mb-16 sm:mb-24">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left text-gray-900 dark:text-white">
                        Meet the
                        <span className="bg-gradient-to-r from-[#612EBE] to-[#8434f5] bg-clip-text text-transparent"> Team</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {teamMembers.map((member, idx) => (
                            <div key={idx} className="group bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-800/30 p-4 sm:p-6 rounded-xl text-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                                {member.image && (
                                    <div className="relative mb-4">
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#612EBE] to-[#8434f5] rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="relative w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto border-4 border-white/50 dark:border-gray-800/50 group-hover:border-purple-300 dark:group-hover:border-purple-700 transition-all duration-300"
                                        />
                                    </div>
                                )}
                                <h3 className="text-base sm:text-lg text-gray-900 dark:text-white font-semibold mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-[#612EBE] dark:text-[#8434f5] text-sm sm:text-base font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-[#612EBE] via-[#8434f5] to-[#5d2bb5] rounded-2xl p-8 text-center shadow-2xl">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-purple-100 mb-6 text-lg">
                            Join thousands of students already learning with Virtual Lab
                        </p>
                        <button
                            onClick={handleDocsClick}
                            className="inline-block bg-white text-[#612EBE] font-semibold px-8 py-3 rounded-lg hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Get Started Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About
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
        <div className="backgroundPatterns relative px-32 py-12 mx-auto">

            {/* Hero Section */}
            <div className="flex items-center justify-between gap-12 mb-24">
                <div className="flex-1">
                    <h1 className="text-5xl font-bold mb-4">Who We Are at Virtual Lab</h1>
                    <p className="text-lg mb-6">
                        Empowering learners to explore the world of Image Processing & Computer Vision.
                    </p>
                    <div className="flex gap-4 items-end">
                        <Link onClick={handleDocsClick} className="bg-[#5865F2] text-white px-6 py-3 rounded-xl hover:bg-blue-700">Start Learning</Link>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="w-full rounded-xl flex items-center justify-center">
                        <img className='w-100 rounded-[1rem]' src={about_img} alt="" />
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-2 text-white  gap-8 mb-24">
                <div className="bg-[#1e1f22] p-8 rounded-xl shadow">
                    <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
                    <p>Democratize access to high-quality image processing education.</p>
                </div>
                <div className="bg-[#1e1f22] p-8 rounded-xl shadow">
                    <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
                    <p>Bridge the gap between theory and real-world applications.</p>
                </div>
            </div>

            {/* What Makes Us Unique */}
            <div className="mb-24">
                <h2 className="text-3xl font-bold mb-8">What Makes Virtual Lab Unique</h2>
                <div className="grid grid-cols-4 gap-6">
                    {[
                        { icon: (<RxCode size={42} />), title: "Hands-on Labs", desc: "With OpenCV/MATLAB" },
                        { icon: (<LuPresentation size={42} />), title: "Expert-led Sessions", desc: "Live & recorded" },
                        { icon: (<HiOutlineLightBulb size={42} />), title: "Real-world Cases", desc: "Projects & challenges" },
                        { icon: (<AiFillExperiment size={42} />), title: "Virtual Experiments", desc: "Interactive simulations" }
                    ].map((feature, idx) => (
                        <div key={idx} className="bg-[#1e1f22] text-white p-12 rounded-xl flex shadow hover:shadow-md transition items-center gap-6">
                            {feature.icon}
                            <div className='flex flex-col'>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-white">{feature.desc}</p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* Team Section */}
            <div id="team" className="mb-24">
                <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
                <div className="grid grid-cols-4 gap-6">
                    {teamMembers.map((member, idx) => (
                        <div key={idx} className="bg-[#1e1f22] p-6 rounded-xl text-center">
                            {member.image && (
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                                />
                            )}
                            <h3 className="text-lg text-white font-semibold">{member.name}</h3>
                            <p className="text-gray-500">{member.role}</p>
                        </div>

                    ))}
                </div>
            </div>

            {/* Timeline / Journey Section */}
            {/*             <div className="mb-24 text-white">
                <h2 className="text-3xl font-bold mb-8">Our Journey</h2>
                <div className="flex flex-col gap-6">
                    {["Started in 2023", "First 1000 learners", "Partnered with universities", "Launching AI bootcamps"].map((milestone, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-4 h-4 bg-[#5865F2] rounded-full"></div>
                            <p className="text-white">{milestone}</p>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Call to Action */}
            {/* <div className="text-center bg-[#1e1f22] text-white p-12 rounded-xl">
                <h2 className="text-3xl font-bold mb-4">Join the Mission</h2>
                <p className="text-white mb-6">Become a contributor or sign up for our newsletter to stay updated.</p>
                <button className="bg-[#5865F2] text-white px-8 py-3 rounded-xl hover:bg-blue-700">Get Involved</button>
            </div> */}
            {/* <div>

            </div> */}

        </div>
    );
}


export default About

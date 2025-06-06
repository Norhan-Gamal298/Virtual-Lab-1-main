import React from 'react'

import about_img from "../assets/about_main_img.png"

import { RxCode } from "react-icons/rx";
import { LuPresentation } from "react-icons/lu";
import { HiOutlineLightBulb } from "react-icons/hi";
import { AiFillExperiment } from "react-icons/ai";
import { Link } from 'react-router-dom';

const teamMembers = [
    {
        name: "Ahmed Omar",
        role: "Frontend Team",
    },
    {
        name: "Martin Maged",
        role: "Frontend Team",
    },
    {
        name: "Mohamed El-Sayed",
        role: "Frontend Team",
    }
    ,
    {
        name: "Norhan Gamal",
        role: "Backend Team",
    }
    ,
    {
        name: "Youssef Ahmed",
        role: "Backend Team",
    }
    ,
    {
        name: "Omar Samir",
        role: "Material Presenting",
    }
    ,
    {
        name: "Mahmoud Ramadan",
        role: "Material Presenting",
    }
    ,
    {
        name: "Aya Pasha",
        role: "Backend Team",
    }
];

const About = () => {
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
                        <Link to="/docs/chapter_1_1_what_is_image_processing" className="bg-[#5865F2] text-white px-6 py-3 rounded-xl hover:bg-blue-700">Start Learning</Link>
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

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Your applications with images
const applications = [
    {
        id: 1,
        title: "Medical Imaging",
        description: "Used to analyze X-rays, MRI, and CT scans for disease detection and diagnosis.",
        image: (<svg width="800px" height="800px" viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" baseProfile="full" enable-background="new 0 0 76.00 76.00" xml:space="preserve">
            <path fill="#5865F2" fill-opacity="1" stroke-width="0.2" stroke-linejoin="round" d="M 57.3958,49.0833L 47.5,49.0833L 42.75,63.3333L 40.375,63.3333L 37.6041,26.5209L 34.4375,49.0833L 28.5,49.0833L 22.9583,45.5208L 19,49.0833L 11.0833,49.0833L 11.0833,46.3125L 19,46.3125L 22.9583,42.75L 28.5,46.3125L 31.5883,46.3125L 36.4166,11.4792L 39.1875,11.875L 42.7499,55.0209L 46.3125,46.3125L 57,46.3125L 63.3333,41.1667L 66.5,41.1667L 66.5,43.9375L 63.3333,43.9375L 57.3958,49.0833 Z " />
        </svg>
        )
    },
    {
        id: 2,
        title: "Facial Recognition",
        description: "Helps in identifying individuals for security and authentication.",
        image: (<svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#5865F2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 3H5a2 2 0 0 0-2 2v2m0 10v2a2 2 0 0 0 2 2h2m10 0h2a2 2 0 0 0 2-2v-2m0-10V5a2 2 0 0 0-2-2h-2" /><circle cx="12" cy="9" r="3" stroke="#5865F2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /><path stroke="#5865F2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16c0-2.21-2.239-4-5-4s-5 1.79-5 4" /></svg>)
    },
    {
        id: 3,
        title: "Agriculture",
        description: "Monitors crop health and detects pests using drone-captured images.",
        image: (<svg fill="#5865F2" height="800px" width="800px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 32 32" xml:space="preserve">
            <g>
                <path d="M12,16c-0.4,0-0.7-0.2-0.9-0.5l-6-10C4.9,5.1,5,4.6,5.3,4.3C5.6,4,6.1,3.9,6.5,4.1l10,6c0.3,0.2,0.5,0.5,0.5,0.9
           C17,13.8,14.8,16,12,16z"/>
            </g>
            <path d="M25.8,24.5c-3.1,3-7.2,4.7-11.5,4.7c-0.8,0-1.5-0.1-2.2-0.2c0,0.3-0.1,0.7-0.1,1c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1
       C28,27.9,27.2,25.9,25.8,24.5z"/>
            <path d="M24.5,2.4C22-0.1,16,1.9,10.3,7.3c-0.4,0.4-0.4,1,0,1.4c0.4,0.4,1,0.4,1.4,0c5-4.7,10-6.4,11.4-4.9c1.5,1.5-0.5,7-5.6,12.1
       C12.5,21,7,23,5.5,21.5c-1.3-1.3-0.1-5.8,4.3-10.8c0.4-0.4,0.3-1-0.1-1.4C9.3,8.9,8.6,9,8.3,9.4c-4.9,5.5-6.7,11.1-4.2,13.5
       c2.7,2.7,6.4,4.2,10.2,4.2s7.5-1.5,10.2-4.2C30.2,17.2,30.2,8.1,24.5,2.4z"/>
        </svg>)
    },
    {
        id: 4,
        title: "Autonomous Vehicles",
        description: "Detects objects, lanes, and signs to help self-driving cars navigate safely.",
        image: (<svg fill="#5865F2" width="800px" height="800px" viewBox="0 0 512 512" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><title /><path d="M256,64.6C150.46,64.6,64.6,150.46,64.6,256S150.46,447.4,256,447.4,447.4,361.54,447.4,256,361.54,64.6,256,64.6Zm0,366.8c-96.72,0-175.4-78.68-175.4-175.4S159.28,80.6,256,80.6,431.4,159.28,431.4,256,352.72,431.4,256,431.4ZM392.13,177.77c-43.13-75.07-139.3-101-214.36-57.9C103.54,162.52,77.33,257,118.45,331.7l.1.17c.43.79.87,1.58,1.32,2.36A157,157,0,0,0,392.13,177.77Zm-206.39-44c67.42-38.74,153.78-15.41,192.52,52A139.83,139.83,0,0,1,395.81,274l-86.5-31.48a47.62,47.62,0,0,0-46.73-40.38H249.34a47.62,47.62,0,0,0-46.73,40.38L116.15,274A141.22,141.22,0,0,1,185.74,133.74ZM382.63,318l-72.81-26.5V259.75l83,30.19c-.23.94-.47,1.88-.72,2.81A143.45,143.45,0,0,1,382.63,318Zm-253.29,0a140.56,140.56,0,0,1-10.22-28l83-30.19v31.74Zm7.95,14.14,65.93-24A47.3,47.3,0,0,0,218.91,334,16.93,16.93,0,0,1,225,346.92v46.57A140.67,140.67,0,0,1,137.29,332.11Zm103.75,64c0-.06,0-.13,0-.19v-49a32.9,32.9,0,0,0-11.8-25.16A31.2,31.2,0,0,1,218.1,297.9V248.54a31.47,31.47,0,0,1,31.24-30.39h13.24a31.47,31.47,0,0,1,31.24,30.41c0,.28,0,.56,0,.83V297.9a31.22,31.22,0,0,1-11.12,23.86,32.91,32.91,0,0,0-11.81,25.16v48.51c0,.26,0,.52,0,.78A140.2,140.2,0,0,1,241,396.15Zm85.22-17.89a140.33,140.33,0,0,1-39.37,15.34V346.92A16.94,16.94,0,0,1,293,334a47.3,47.3,0,0,0,15.69-25.87l66,24A140.12,140.12,0,0,1,326.26,378.26ZM286.87,256A30.92,30.92,0,1,0,256,286.93,30.95,30.95,0,0,0,286.87,256ZM256,270.93A14.92,14.92,0,1,1,270.87,256,14.93,14.93,0,0,1,256,270.93Z" /></svg>)
    },
];

const ImageApplications = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const anchorsRef = useRef([]);

    const handleTitleClick = (index) => {
        const anchor = anchorsRef.current[index];
        if (anchor) {
            const rect = anchor.getBoundingClientRect();
            const offsetTop = window.scrollY + rect.top;

            if (Math.abs(window.scrollY - offsetTop) > 10) {
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            setActiveIndex(index);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            const newIndex = Math.floor((scrollY + windowHeight / 2) / windowHeight);
            const clampedIndex = Math.min(Math.max(newIndex, 0), applications.length - 1);

            setActiveIndex(clampedIndex);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="nexus flex">
            {/* Left Text Side */}
            <div className="nexusSticky w-1/2">
                <div className="nexusTop">
                    <div className="perspectiveTransition title textTitleSection">
                        <div className="perspectiveTransition__content">
                            <div className="ink-trap">
                                <h2 className="text-[107px]">
                                    THE POWER OF <br /> IMAGE PROCESSING
                                </h2>
                            </div>
                        </div>
                    </div>
                    <span>What Image Processing can do</span>
                </div>

                <ul className="nexusAttributes">
                    {applications.map((app, i) => (
                        <React.Fragment key={app.id}>
                            <div
                                className={`nexus__scrollAnchor anchor${i}`}
                                ref={(el) => (anchorsRef.current[i] = el)}
                                style={{ top: `${i * 10}vh` }}
                            />
                            <li className={`nexusItem ${i === activeIndex ? "active" : ""}`}>
                                <header
                                    className="nexusItem__header textCaption"
                                    onClick={() => handleTitleClick(i)}
                                >
                                    <div className="nexusItem__number">
                                        {String(app.id).padStart(2, "0")}
                                    </div>
                                    <div className="nexusItem__title">{app.title}</div>
                                </header>

                                <div className="nexusItem__content">
                                    <div className="nexusItem__contentInner">
                                        <div className="nexusItem__progress">
                                            <div
                                                className="nexusItem__progressBar"
                                                style={{
                                                    transform: i === activeIndex ? "scaleY(1)" : "scaleY(0)",
                                                    transition: "transform 0.5s ease"
                                                }}
                                            />
                                        </div>
                                        <p className="nexusItem__description textBody">
                                            {app.description}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </React.Fragment>
                    ))}
                </ul>
            </div>

            {/* Right Image Side */}
            <div className="w-1/2 h-screen sticky top-0 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={applications[activeIndex].id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="w-full h-auto flex justify-center items-center"
                    >
                        {applications[activeIndex].image}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ImageApplications;

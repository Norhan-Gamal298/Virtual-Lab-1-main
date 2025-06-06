import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from "framer-motion";
import showCaseImg from "../assets/showCase-input.jpg";
import snippetImg from "../assets/code snippets.png";

const ImageProcessingShowcase = () => {
    const containerRef = useRef(null);
    const [constraints, setConstraints] = useState({ left: 0, right: 0 });
    const x = useMotionValue(0);
    const clipPath = useTransform(x, (val) => `inset(0 0 0 ${val}px)`);

    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            setConstraints({ left: 0, right: containerWidth });
            x.set(containerWidth / 2); // Start centered
        }
    }, []);

    return (
        <section className="py-20 bg-neutral-background">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <img
                        src={snippetImg}
                        alt="Code Snippet"
                        className="rounded-2xl scale-[1.2]"
                    />
                </motion.div>

                {/* Image Reveal Slider */}
                <div
                    ref={containerRef}
                    className="relative w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-lg border border-neutral-border justify-self-end"
                >
                    {/* Bottom Image (Original) */}
                    <img
                        src={showCaseImg}
                        alt="Original"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />

                    {/* Top Image (Processed) */}
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full overflow-hidden bg-gray-700"
                        style={{ clipPath }}
                    >
                        <img
                            src={showCaseImg}
                            alt="Processed"
                            className="w-full h-full object-cover grayscale"
                        />
                    </motion.div>

                    {/* Slider Handle */}
                    <motion.div
                        drag="x"
                        dragConstraints={constraints}
                        style={{ x }}
                        className="absolute top-0 h-full w-auto cursor-col-resize z-10 flex items-center justify-center"
                    >
                        <div className="w-1 h-full bg-[#00a0ff]" />
                        <div className="absolute w-6 h-6 bg-white dark:bg-neutral-surface rounded-full shadow-md border-2 border-primary" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ImageProcessingShowcase;

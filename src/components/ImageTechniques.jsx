import React from 'react';
import { motion } from "framer-motion";

const techniques = [
    { title: "Image Acquisition", description: "Capturing images from the real world into digital form." },
    { title: "Image Filtering & Enhancement", description: "Improving image quality by reducing noise and enhancing details." },
    { title: "Image Restoration", description: "Reconstructing corrupted or damaged images." },
    { title: "Color Image Processing", description: "Handling and analyzing images in color spaces." },
    { title: "Wavelets and Other Image Transforms", description: "Transforming images for better analysis and compression." },
    { title: "Compression and Watermarking", description: "Reducing file size and embedding copyright marks." },
    { title: "Morphological Processing", description: "Analyzing shapes and structures in binary images." },
    { title: "Segmentation", description: "Dividing an image into meaningful parts." },
    { title: "Feature Extraction", description: "Detecting important patterns or structures from images." },
    { title: "Image Pattern Classification", description: "Categorizing images based on their features." },
];

const ImageTechniques = () => {
    return (
        <section className="py-20 bg-[#0f0f0f]">
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-[#EFF6FF]"
            >
                Techniques of Image Processing
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
                {techniques.map((technique, index) => {
                    const isLast = index === techniques.length - 1;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className={`bg-[#1f1f1f] rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 p-8 flex flex-col items-start text-left border border-[#3a3a3a] hover:border-[#2563EB]
                                ${isLast ? "lg:col-span-2" : ""}`}
                        >
                            <div className="text-xl poppins-semibold mb-2 text-white">
                                {technique.title}
                            </div>
                            <p className="text-sm poppins-regular text-[#B0B0B0]">
                                {technique.description}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}

export default ImageTechniques;

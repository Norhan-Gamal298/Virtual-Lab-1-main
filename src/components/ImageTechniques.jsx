import React from 'react';
import { motion } from "framer-motion";
import colorProcessing from "../assets/icons/colorProcessing.svg";
import Description from "../assets/icons/Description.svg";
import frequencyFiltering from "../assets/icons/frequencyFiltering.svg";
import imageFundamentals from "../assets/icons/imageFundamentals.svg";
import imgCompression from "../assets/icons/imgCompression.svg";
import imgRecognition from "../assets/icons/imgRecognition.svg";
import imgRestoration from "../assets/icons/imgRestoration.svg";
import imgSegmentation from "../assets/icons/imgSegmentation.svg";
import moreTechniques from "../assets/icons/moreTechniques.svg";
import morphology from "../assets/icons/morphology.svg";
import spatialFiltering from "../assets/icons/spatialFiltering.svg";
import wavelets from "../assets/icons/wavelets.svg";

const techniques = [
    { topic: "Image Fundamentals", icon: imageFundamentals },
    { topic: "Compression", icon: imgCompression },
    { topic: "Description", icon: Description },
    { topic: "Frequency Filtering", icon: frequencyFiltering },
    { topic: "Color Processing", icon: colorProcessing },
    { topic: "Morphology", icon: morphology },
    { topic: "Recognition", icon: imgRecognition },
    { topic: "Restoration", icon: imgRestoration },
    { topic: "Segmentation", icon: imgSegmentation },
    { topic: "Spatial Filtering", icon: spatialFiltering },
    { topic: "Wavelets", icon: wavelets },
    { topic: "And More", icon: moreTechniques },
];

const ImageTechniques = () => {
    return (
        <section className="py-20 bg-neutral-background relative mt-[10rem]">
            <div className='gradient-bg-light'></div>
            <div className='gradient-bg-dark'></div>
            <motion.h2
                initial={{ opacity: 0, y: -30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl text-center mb-10 text-neutral-text-primary poppins-medium"
            >
                What You'll Learn
            </motion.h2>
            <span className='mb-[2rem] text-[18px] dark:text-[#D1D5DB] poppins-regular'>Virtual Lab covers a wide range of Image Processing topics</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-x-[60px] gap-y-8 px-6 max-w-7xl mx-auto mt-[2rem]">
                {techniques.map((technique, index) => {
                    const isLast = index === techniques.length - 1;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="bg-neutral-surface rounded-2xl transition-all duration-300 ease-in-out p-1 flex flex-col items-center text-left"
                        >
                            <div className="text-sm text-neutral-text-secondary topicBlockIcon group p-[1.5rem] rounded-[1rem]">
                                <img width={24} src={technique.icon} alt="" />
                            </div>
                            <h5 className="text-[14px] mt-[10px] mb-2 text-neutral-text-primary text-center poppins-regular">
                                {technique.topic}
                            </h5>
                        </motion.div>


                    );
                })}
            </div>
        </section>
    );
};

export default ImageTechniques;
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from "../ThemeProvider";

const ImageApplications = ({ features }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const itemsRef = useRef([]);
    const imagesRef = useRef([]);
    const scrollDirection = useRef(1);
    const lastScrollY = useRef(0);
    const isScrolling = useRef(false);

    // Get theme context
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const featuresData = features || defaultFeatures;
    const totalHeight = `${featuresData.length * 100}vh`;

    // Handle scroll events
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || isScrolling.current) return;

            const container = containerRef.current;
            const containerRect = container.getBoundingClientRect();
            const scrollProgress = Math.abs(containerRect.top) / (container.offsetHeight - window.innerHeight);

            // Calculate which section should be active
            const newIndex = Math.min(
                Math.max(0, Math.floor(scrollProgress * featuresData.length)),
                featuresData.length - 1
            );

            if (newIndex !== activeIndex) {
                setActiveIndex(newIndex);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call

        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeIndex, featuresData.length]);

    // Animate items when activeIndex changes
    useEffect(() => {
        // Animate active item
        itemsRef.current.forEach((item, i) => {
            if (!item) return;

            const isActive = i === activeIndex;
            const progressBar = item.querySelector('.nexusItem__progressBar');
            const description = item.querySelector('.nexusItem__description');

            // Apply styles directly for immediate feedback
            item.style.opacity = isActive ? '1' : '0.4';
            item.style.padding = isActive ? '1.6rem 0' : '0.5rem 0';
            item.style.transition = 'all 0.5s ease';

            if (progressBar) {
                progressBar.style.transform = isActive ? 'scaleY(1)' : 'scaleY(0)';
                progressBar.style.transition = 'transform 0.5s ease';
            }

            if (description) {
                description.style.opacity = isActive ? '1' : '0';
                description.style.transform = isActive ? 'translateY(0)' : 'translateY(10px)';
                description.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            }
        });

        // Animate images
        imagesRef.current.forEach((img, i) => {
            if (!img) return;

            img.style.opacity = i === activeIndex ? '1' : '0';
            img.style.transform = i === activeIndex ? 'scale(1)' : 'scale(0.95)';
            img.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
    }, [activeIndex]);

    const handleItemClick = (index) => {
        if (index === activeIndex) return;

        isScrolling.current = true;

        // Calculate target scroll position
        const targetScrollY = window.scrollY + (index - activeIndex) * window.innerHeight;

        // Immediately update active index for visual feedback
        setActiveIndex(index);

        // Smooth scroll to target position
        window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth'
        });

        // Reset scrolling flag after animation
        setTimeout(() => {
            isScrolling.current = false;
        }, 1000);
    };

    return (
        <section className="section relative">
            <div
                ref={containerRef}
                className="nexus relative"
                style={{ height: totalHeight }}
            >
                <div className="nexus__sticky sticky top-0 h-screen flex flex-col justify-between p-4 md:p-16 w-full">
                    <div className="nexus__top flex flex-col items-center">
                        <div className="perspectiveTransition title textTitleSection mb-8">
                            <h2 className="text-3xl md:text-5xl lg:text-6xl uppercase leading-tight text-center poppins-medium text-[#1F2937] dark:text-[#F3F4F6]">
                                <span className="">The Usage </span>
                                <span className="">of Image Processing</span>
                            </h2>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8 h-[60vh]">
                        {/* Features list */}
                        <ul className="nexusAttributes flex-1 overflow-visible w-full lg:w-1/2 space-y-4">
                            {featuresData.map((feature, i) => (
                                <li
                                    key={i}
                                    ref={el => itemsRef.current[i] = el}
                                    className={`nexusItem ${i === activeIndex ? 'active' : ''} cursor-pointer transition-all duration-500`}
                                    onClick={() => handleItemClick(i)}
                                    style={{
                                        opacity: i === activeIndex ? 1 : 0.4,
                                        padding: i === activeIndex ? '1.6rem 0' : '0.5rem 0'
                                    }}
                                >
                                    <header className="nexusItem__header flex items-end h-4 relative pl-12 mb-2">
                                        <div className="nexusItem__number absolute left-0 bottom-0 text-lg font-mono">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div className="nexusItem__title text-sm md:text-base font-mono hover:text-blue-500 transition-colors">
                                            {feature.title}
                                        </div>
                                    </header>

                                    <div className="nexusItem__content overflow-hidden">
                                        <div className="nexusItem__contentInner relative py-2">
                                            <div className="nexusItem__progress absolute left-0 top-0 bottom-0 w-px ">
                                                <div
                                                    className="nexusItem__progressBar absolute top-0 left-0 w-full h-full bg-blue-500 origin-top"
                                                    style={{ transform: i === activeIndex ? 'scaleY(1)' : 'scaleY(0)' }}
                                                />
                                            </div>
                                            <p
                                                className="nexusItem__description text-base pl-4 text-gray-600 dark:text-gray-300"
                                                style={{
                                                    opacity: i === activeIndex ? 1 : 0,
                                                    transform: i === activeIndex ? 'translateY(0)' : 'translateY(10px)'
                                                }}
                                            >
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Illustrations */}
                        <div className="flex-1 relative h-full  rounded-lg overflow-hidden">
                            {featuresData.map((feature, i) => (
                                <div
                                    key={i}
                                    ref={el => imagesRef.current[i] = el}
                                    className="absolute inset-0 flex items-center justify-center p-4"
                                    style={{
                                        opacity: i === activeIndex ? 1 : 0,
                                        transform: i === activeIndex ? 'scale(1)' : 'scale(0.95)'
                                    }}
                                >
                                    <img
                                        src={isDark ? feature.darkImage : feature.lightImg}
                                        alt={feature.title}
                                        className="max-w-full max-h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageApplications;
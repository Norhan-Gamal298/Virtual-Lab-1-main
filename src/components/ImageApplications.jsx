import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ImageApplications = ({ features }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef(null);
    const stickyRef = useRef(null);
    const itemsRef = useRef([]);
    const imagesRef = useRef([]);
    const triggersRef = useRef([]);
    const isScrollingRef = useRef(false);

    // Calculate total height based on viewport height
    const totalHeight = `${features.length * 100}vh`;


    useEffect(() => {
        // Clear previous triggers
        triggersRef.current.forEach(trigger => trigger?.kill());
        triggersRef.current = [];

        // Set up scroll triggers for each feature
        features.forEach((_, i) => {
            const trigger = ScrollTrigger.create({
                trigger: containerRef.current,
                start: () => `top top+=${i * window.innerHeight}`,
                end: () => `top top+=${(i + 1) * window.innerHeight}`,
                onEnter: () => {
                    if (!isScrollingRef.current) {
                        setActiveIndex(i);
                    }
                },
                onEnterBack: () => {
                    if (!isScrollingRef.current) {
                        setActiveIndex(i);
                    }
                },
                markers: false, // Set to true for debugging
            });
            triggersRef.current.push(trigger);
        });

        // Handle wheel events for smoother scrolling
        const handleWheel = (e) => {
            if (Math.abs(e.deltaY) > 0) {
                isScrollingRef.current = true;
                clearTimeout(isScrollingRef.current.timer);
                isScrollingRef.current.timer = setTimeout(() => {
                    isScrollingRef.current = false;
                }, 100);
            }
        };

        window.addEventListener('wheel', handleWheel);

        return () => {
            window.removeEventListener('wheel', handleWheel);
            triggersRef.current.forEach(trigger => trigger?.kill());
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [features.length]);

    useEffect(() => {
        // Animate active item
        itemsRef.current.forEach((item, i) => {
            if (!item) return;

            const isActive = i === activeIndex;
            gsap.to(item, {
                opacity: isActive ? 1 : 0.4,
                padding: isActive ? '1.6rem 0' : '0',
                duration: 0.5,
            });

            const progressBar = item.querySelector('.nexusItem__progressBar');
            const description = item.querySelector('.nexusItem__description');

            if (isActive) {
                gsap.to(progressBar, {
                    scaleY: 1,
                    duration: 1,
                    ease: 'power2.out',
                });

                gsap.to(description, {
                    opacity: 1,
                    delay: 0.1,
                    duration: 0.5,
                });
            } else {
                gsap.to(progressBar, {
                    scaleY: 0,
                    duration: 0.3,
                });

                gsap.to(description, {
                    opacity: 0,
                    duration: 0.3,
                });
            }
        });

        // Animate images
        imagesRef.current.forEach((img, i) => {
            if (!img) return;
            gsap.to(img, {
                opacity: i === activeIndex ? 1 : 0,
                duration: 0.5,
            });
        });
    }, [activeIndex]);

    const handleItemClick = (index) => {
        setActiveIndex(index);
        isScrollingRef.current = true;

        // Calculate scroll position accounting for any offset
        const scrollPosition = index * window.innerHeight;

        gsap.to(window, {
            scrollTo: scrollPosition,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                isScrollingRef.current = false;
            }
        });
    };

    return (
        <section className="section relative">
            <div
                ref={containerRef}
                className="nexus relative"
                style={{ height: totalHeight }}
            >
                <div
                    ref={stickyRef}
                    className="nexus__sticky sticky top-0 h-screen flex flex-col justify-between p-4 md:p-16 w-full"
                >
                    <div className="nexus__top flex flex-col items-start">
                        <div className="perspectiveTransition title textTitleSection mb-8">
                            <h1 className="font-bold text-4xl md:text-7xl uppercase leading-[0.82] text-left">
                                <span className="block">the power</span>
                                <span className="block">of Image Processing</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 h-[60vh]">
                        {/* Features list */}
                        <ul className="nexusAttributes flex-1 overflow-visible w-[50%]">
                            {features.map((feature, i) => (
                                <li
                                    key={i}
                                    ref={el => itemsRef.current[i] = el}
                                    className={`nexusItem ${i === activeIndex ? 'active' : ''} transition-all duration-500 cursor-pointer`}
                                    onClick={() => handleItemClick(i)}
                                >
                                    <header className="nexusItem__header flex items-end h-4 relative pl-12">
                                        <div className="nexusItem__number absolute left-0 bottom-0 text-sm font-mono">
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div className="nexusItem__title text-sm md:text-base font-mono">
                                            {feature.title}
                                        </div>
                                    </header>

                                    <div className="nexusItem__content overflow-hidden transition-all duration-500">
                                        <div className="nexusItem__contentInner relative py-4">
                                            <div className="nexusItem__progress absolute left-0 top-0 bottom-0 w-px bg-gray-300">
                                                <div
                                                    className="nexusItem__progressBar absolute top-0 left-0 w-full h-full bg-black origin-top"
                                                    style={{ transform: 'scaleY(0)' }}
                                                />
                                            </div>
                                            <p className="nexusItem__description text-sm md:text-base opacity-0 pl-4">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* Illustrations */}
                        <div className="flex-1 relative h-full">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    ref={el => imagesRef.current[i] = el}
                                    className={`absolute inset-0 transition-opacity duration-500 ${i === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-contain"
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
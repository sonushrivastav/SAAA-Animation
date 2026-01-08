'use client';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const Marquee = ({
    imagesArray = [],
    speed = 50, // px per second
}) => {
    const marqueeRef = useRef(null);
    const animationRef = useRef(null);

    const requestRef = useRef(null);
    const lastTimeRef = useRef(0);

    const [offset, setOffset] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimatedVisible, setIsAnimatedVisible] = useState(false);

    // 🔁 Duplicate images for infinite scroll
    const duplicatedImages = useMemo(() => [...imagesArray, ...imagesArray], [imagesArray]);

    const animate = useCallback(
        time => {
            if (!lastTimeRef.current) lastTimeRef.current = time;
            const delta = time - lastTimeRef.current;

            if (delta >= 16 && animationRef.current && !isHovered) {
                const distance = (speed * delta) / 1000; // px per ms
                setOffset(prev => {
                    const width = animationRef.current.scrollWidth / 2;
                    const next = prev - distance;
                    return next <= -width ? 0 : next;
                });
                lastTimeRef.current = time;
            }

            requestRef.current = requestAnimationFrame(animate);
        },
        [speed, isHovered]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsAnimatedVisible(true);
            requestRef.current = requestAnimationFrame(animate);
        }, 400);

        return () => {
            clearTimeout(timeout);
            cancelAnimationFrame(requestRef.current);
        };
    }, [animate]);

    return (
        <div
            className="w-full p-4 lg:p-7 bg-[#0f0f0f]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={marqueeRef}
                className="overflow-hidden h-[2.5rem]"
                aria-hidden={!isAnimatedVisible}
            >
                <div
                    ref={animationRef}
                    className="flex items-center "
                    style={{
                        transform: `translate3d(${offset}px,0,0)`,
                        willChange: 'transform',
                        opacity: isAnimatedVisible ? 1 : 0,
                        transition: 'opacity 0.4s ease-in',
                    }}
                >
                    {duplicatedImages.map((src, index) => (
                        <Image
                            src={src}
                            alt=""
                            width={60}
                            height={60}
                            className="h-8 w-auto px-6 flex-shrink-0"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(Marquee);

'use client ';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const PlatformImagesMarquee = memo(function PlatformImagesMarquee({ images, speed = 50 }) {
    if (!images || images.length === 0) return null;

    const [isHovered, setIsHovered] = useState(false);
    const marqueeRef = useRef(null);
    const animationRef = useRef(null);
    const [offset, setOffset] = useState(0);
    const requestRef = useRef();
    const lastTimeRef = useRef(0);
    const [isAnimatedVisible, setIsAnimatedVisible] = useState(false);

    // Calculate repetitions needed to ensure no empty space
    const [displayImages, setDisplayImages] = useState([...images]);

    useEffect(() => {
        if (marqueeRef.current && animationRef.current) {
            const containerWidth = marqueeRef.current.offsetWidth;
            const contentWidth = animationRef.current.scrollWidth / 3; // Width of one set

            // Calculate how many full sets we need to fill the container + buffer
            const setsNeeded = Math.ceil(containerWidth / contentWidth) + 2;

            const repeatedImages = [];
            for (let i = 0; i < setsNeeded; i++) {
                repeatedImages.push(...images);
            }
            setDisplayImages(repeatedImages);
        }
    }, [images, isAnimatedVisible]);

    const animate = useCallback(
        currentTime => {
            if (!lastTimeRef.current) {
                lastTimeRef.current = currentTime;
            }

            const deltaTime = currentTime - lastTimeRef.current;

            // Only update if enough time has passed (60fps = ~16.67ms)
            if (deltaTime >= 16.67) {
                if (marqueeRef.current && animationRef.current) {
                    setOffset(prevOffset => {
                        const pixelsPerFrame = speed / 60;
                        const newOffset = prevOffset - pixelsPerFrame;
                        const marqueeWidth = marqueeRef.current.scrollWidth / 2;

                        return newOffset <= -marqueeWidth ? 0 : newOffset;
                    });
                }
                lastTimeRef.current = currentTime;
            }

            requestRef.current = requestAnimationFrame(animate);
        },
        [speed]
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsAnimatedVisible(true);
            requestRef.current = requestAnimationFrame(animate);
        }, 500);

        return () => {
            clearTimeout(timeout);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [animate]);

    const transformStyle = {
        transform: `translate3d(${offset}px, 0, 0)`,
        willChange: isHovered ? 'auto' : 'transform',
        opacity: isAnimatedVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-in',
    };

    return (
        <div className="w-full 3xl:w-[50%] lg:w-[50%] md:w-[60%]">
            {/* Static LCP fallback */}
            {!isAnimatedVisible && (
                <div className="flex items-center justify-center gap-x-2 gap-y-6  mx-auto">
                    {images.slice(0, 5).map((src, index) => (
                        <Image
                            key={index}
                            src={src}
                            alt={`Platform ${index + 1}`}
                            width={50}
                            height={20}
                            className="mx-3 h-8 w-auto"
                            loading="lazy"
                        />
                    ))}
                </div>
            )}

            {/* Marquee animation */}
            <div ref={marqueeRef} className="flex overflow-hidden" aria-hidden={!isAnimatedVisible}>
                <div
                    ref={animationRef}
                    className="flex items-center gap-x-2 gap-y-6"
                    style={transformStyle}
                >
                    {displayImages.map((src, index) => (
                        <Image
                            key={`${src}-${index}`}
                            src={src}
                            alt={`Platform ${index + 1}`}
                            width={50}
                            height={20}
                            className="mx-3 h-8 w-auto"
                            loading="lazy"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
});
export default PlatformImagesMarquee;

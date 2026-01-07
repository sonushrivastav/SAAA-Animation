'use client';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import ThreeGlass from './FloatingGlass';

import useDeviceType from '../hooks/useDeviceType';
import GradientBackground from './GradientBackground';

const GlassInstance = memo(function GlassInstance({
    position,
    motionVariant,
    speed,
    amplitude,
    mouseInfluence,
    delay = 0,
    modelUrl,
}) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!isLoaded) return null;

    return (
        <div className={`absolute ${position} w-52 h-52  flex  items-center justify-center pointer-events-auto`}>
            <ThreeGlass
                modelUrl={modelUrl}
                motionVariant={motionVariant}
                speed={speed}
                amplitude={amplitude}
                mouseInfluence={mouseInfluence}
            />
        </div>
    );
});
const HeroSerivce = memo(function HeroService() {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const { isMobile, isTablet } = useDeviceType();
    // Glass configurations - memoized
    const glassConfigs = useMemo(
        () => [
            {
                modelUrl: '/models/design.glb',
                position: `${
                    isMobile
                        ? 'top-[65%] left-[0%]'
                        : isTablet
                        ? 'top-[62%] left-[1%]'
                        : 'top-[45%] left-[7%]'
                }`,
                motionVariant: 1,
                speed: 0.9,
                amplitude: 0.08,
                delay: 300,
            },
            {
                modelUrl: '/models/build.glb',
                position: `${
                    isMobile
                        ? 'top-[60%] right-[0%]'
                        : isTablet
                        ? 'top-[55%] right-[5%]'
                        : 'top-[65%] right-[15%]'
                }`,
                motionVariant: 2,
                speed: 1.4,
                amplitude: 0.07,
                delay: 500,
            },
            {
                modelUrl: '/models/grow.glb',
                position: `${
                    isMobile
                        ? 'top-[4%] right-[25%]'
                        : isTablet
                        ? 'top-[0%] right-[5%]'
                        : 'top-[21%] right-[11%]'
                }`,

                motionVariant: 3,
                speed: 0.8,
                amplitude: 0.05,
                delay: 700,
            },
        ],
        []
    );

    // Intersection observer for lazy loading
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '50px', threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);
    return (
        <section
            ref={containerRef}
            style={{ transform: 'translateZ(0)' }}
            className="relative h-screen w-full flex flex-col items-center justify-center  overflow-hidden bg-[#0f0f0f]"
        >
            {/* Background gradient transition */}
            {/* <div className="absolute  inset-0 bg-[radial-gradient(150%_90%_at_50%_65%,_rgba(88,28,135,0.9)_0%,_rgba(0,0,0,1)_55%)] " /> */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(130%_70%_at_50%_75%,_rgba(90,0,255,0.9)_0%,_rgba(132,77,233,0.9)_45%,_rgba(0,0,0,1)_85%)]" /> */}

            <div className="flex lg:hidden h-full w-full ">
                <video
                    className="w-full h-full object-cover"
                    src="/videos/serviceBg.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                ></video>
            </div>
            <div className="hidden lg:flex h-full w-full ">
                {isVisible && <GradientBackground heightFactor={2.3} />}
            </div>
            <div className="absolute inset-0 pointer-events-none z-10">
                {isVisible &&
                    glassConfigs.map((config, index) => (
                        <GlassInstance
                            key={index}
                            modelUrl={config.modelUrl}
                            position={config.position}
                            motionVariant={config.motionVariant}
                            speed={config.speed}
                            amplitude={config.amplitude}
                            mouseInfluence={true}
                            delay={config.delay}
                        />
                    ))}
            </div>

            {/* Text Content */}
            <div className="absolute  text-center text-[#fafafa] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20 w-[full] lg:w-[75%] pointer-events-none">
                <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-semibold leading-normal md:leading-[50px] lg:leading-[63px] ">
                    Every brand deserves more than service providers. You get thinkers, creators,
                    and partners who are dedicated to your growth. Each solution is shaped around
                    your vision, built for today, and ready for what’s next.
                </h2>
            </div>
        </section>
    );
});

export default HeroSerivce;
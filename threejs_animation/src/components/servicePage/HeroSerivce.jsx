'use client';
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import ThreeGlass from './FloatingGlass';

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
        <div className={`absolute ${position} w-48 h-48`}>
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

    // Glass configurations - memoized
    const glassConfigs = useMemo(
        () => [

            {
                modelUrl: '/models/design.glb',
                position: 'top-[50%] left-60',
                motionVariant: 1,
                speed: 0.9,
                amplitude: 0.08,
                delay: 300,
            },
            {
                modelUrl: '/models/build.glb',
                position: 'top-[65%] right-[25%]',
                motionVariant: 2,
                speed: 1.4,
                amplitude: 0.07,
                delay: 500,
            },
            {
                modelUrl: '/models/grow.glb',
                position: 'top-[25%] right-[20%]',
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

            {isVisible && <GradientBackground heightFactor={2.3} />}

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
            <div className="absolute  text-center text-white px-8 max-w-3xl">
                <h2 className="text-xl md:text-3xl font-semibold leading-relaxed mb-8">
                    Every brand deserves more than service providers. You get thinkers, creators,
                    and partners who are dedicated to your growth. Each solution is shaped around
                    your vision, built for today, and ready for what’s next.
                </h2>
            </div>
        </section>
    );
});

export default HeroSerivce;

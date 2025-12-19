'use client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Suspense, useEffect, useRef } from 'react';
import OtherServices from '../../components/allServicesComponents/OtherServices';
import DotGrid from '../../components/servicePage/DotGrid';
import HeroSerivce from '../../components/servicePage/HeroSerivce';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const servicesArray = [
    {
        title: 'INVESTOR RELATIONS',
        description:
            'We turn reports into relationships. By shaping data into clear, confident narratives, we help investors see your brand’s true potential. Numbers tell stories too, we just make them easier to believe in.',
    },
    {
        title: 'FINANCIAL ADVISORY',
        description:
            'We read between the spreadsheets. Our experts turn complex numbers into actionable insights for your brand. Balancing vision with viability, we make sure your next move is a smart one. Every decision is backed by clarity, not guesswork.',
    },
    {
        title: 'LEGAL & COMPLIANCE',
        description:
            'We take care of the fine print while you focus on the big picture. Reliable, simple, and structured. Protection that moves with your business, not against it. So you can grow freely knowing every box is ticked and every detail secured.',
    },
];
const Service = () => {
    const gradientRef1 = useRef(null);
    const gradientRef2 = useRef(null);
    const dotGridContainerRef = useRef(null);
    const HORIZONTAL_STRETCH = 130; // consistent for full width coverage

    // Helper to create gradient with variable curve depth
    const createGradientStyle = (colors, ellipseY) => {
        return `radial-gradient(ellipse ${HORIZONTAL_STRETCH}% ${ellipseY}% at 50% 0%, ${colors.join(
            ', '
        )})`;
    };

    useEffect(() => {
        // ===== First Gradient Animation (existing one) =====
        if (gradientRef1.current) {
            const colors1 = [
                '#0f0f0f 0%',
                '#0f0f0f 30%',
                '#0f0f0f 45%',
                '#22579C 60%',
                '#4A8AE6 70%',
                '#fafafa 95%',
            ];

            gsap.set(gradientRef1.current, {
                background: createGradientStyle(colors1, 10),
            });

            const tl1 = gsap.timeline({
                scrollTrigger: {
                    trigger: gradientRef1.current,
                    scrub: 1,
                    start: 'top bottom',
                    end: 'center top',
                },
            });

            tl1.to(gradientRef1.current, {
                background: createGradientStyle(colors1, 100),
                ease: 'power1.inOut',
            }).to(gradientRef1.current, {
                background: createGradientStyle(colors1, 10),
                ease: 'power1.inOut',
            });
        }

        // ===== Second Gradient Animation (after OtherSolutions) =====
        if (gradientRef2.current) {
            // Color pattern based on uploaded image (light top → blue mid → dark bottom)
            const colors2 = [
                'rgba(250,250,250,1) 0%',
                'rgba(250,250,250,1) 20%', // starts pure white to match previous background
                'rgba(250,250,250,1) 35%',
                '#DCEBFA  40%', // white top
                '#7fb8f9 50%', // sky blue
                '#0094ff 60%', // bright blue center
                '#003a6e 75%', // deep navy
                '#0f0f0f 100%',
            ];

            gsap.set(gradientRef2.current, {
                background: createGradientStyle(colors2, 10),
            });

            const tl2 = gsap.timeline({
                scrollTrigger: {
                    trigger: gradientRef2.current,
                    scrub: 1,
                    start: 'top bottom',
                    end: 'center top',
                },
            });

            tl2.to(gradientRef2.current, {
                background: createGradientStyle(colors2, 100),
                ease: 'power1.inOut',
            }).to(gradientRef2.current, {
                background: createGradientStyle(colors2, 10),
                ease: 'power1.inOut',
            });
        }
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <>
            <HeroSerivce />

            {/*
        COMBINED HERO + DOTGRID WRAPPER
        This wrapper spans both sections so the gradient can extend across them
      */}
            <div
                ref={dotGridContainerRef}
                className="relative w-full"
                style={{ backgroundColor: '#0f0f0f' }}
            >
                <DotGrid
                    dotSize={2}
                    gap={8}
                    baseColor="#323234"
                    activeColor="#5227FF"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                    className="relative h-screen w-full"
                />
            </div>

            {/* First Gradient Section */}
            <div
                ref={gradientRef1}
                className="relative w-full h-[65vh] overflow-hidden"
                style={{
                    backgroundColor: '#0f0f0f',
                    marginTop: '-1px', // Prevents any gap
                    zIndex: 1,
                }}
            >
                <div className="absolute inset-0" />
            </div>

            <section className="flex flex-col  bg-[#fafafa]  px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
                <h2 className="text-3xl  md:text-4xl lg:text-5xl text-[#0f0f0f]   font-semibold  lg:leading-[60px] ">
                    Other Related{' '}
                    <span className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
                        Services
                    </span>
                </h2>
                <div className="mt-10 md:mt-14">
                    <OtherServices services={servicesArray} />
                </div>
            </section>

            {/* Second Gradient Section (based on uploaded image colors) */}
            <div ref={gradientRef2} className="relative w-full h-[80vh] overflow-hidden">
                <div className="absolute inset-0" />
            </div>

            <div className="w-full   self-center bg-[#0f0f0f]">
                <Suspense fallback={<p>Loading video...</p>}>
                    <video
                        src="/videos/Big_Buck_Bunny_1080_10s_5MB.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    ></video>
                </Suspense>
            </div>
        </>
    );
};

export default Service;

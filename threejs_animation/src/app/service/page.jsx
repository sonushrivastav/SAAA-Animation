'use client';
import { useRef } from 'react';
import DotGrid from '../../components/service/DotGrid';
import LiquidEther from '../../components/service/LiquidEther';
import ThreeGlass from '../../components/service/ThreeGlass';

export default function Service() {
    const bgRef = useRef(null);

    return (
        <>
            <section
                ref={bgRef}
                className="relative w-full h-[100vh] bg-[#0f0f0f] text-white flex items-center justify-center text-center px-4 "
            >
                <div
                    className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[120vw] h-[90vh] rounded-[50%/60%] overflow-hidden pointer-events-auto z- backdrop-blur-[10px]"
                    style={{
                        maskImage:
                            'radial-gradient(ellipse 55% 50% at 50% 50%, black 40%, transparent 100%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 75% 50% at 50% 50%, black 40%, transparent 100%)',
                    }}
                >
                    <LiquidEther
                        colors={['#6B3BFF', '#2C00A4', '#A06BFF']}
                        mouseForce={20}
                        cursorSize={100}
                        isViscous={false}
                        viscous={30}
                        iterationsViscous={32}
                        dt={0.014}
                        BFECC={true}
                        iterationsPoisson={32}
                        resolution={0.5}
                        isBounce={true}
                        autoDemo={true}
                        autoSpeed={0.5}
                        autoIntensity={2.2}
                        takeoverDuration={0}
                        autoResumeDelay={0}
                        autoRampDuration={0}
                    />
                </div>

                <div className="z-4 absolute top-10 left-110  w-48 h-48 rounded-full bg-transparent  flex items-center justify-center text-black text-lg font-medium overflow-hidden">
                    <ThreeGlass />
                </div>
                <div className="z-4 absolute top-[50%] left-60 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                    <ThreeGlass />
                </div>
                <div className="z-4 absolute top-[65%] right-100 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                    <ThreeGlass />
                </div>
                <div className="z-4 absolute top-[25%] right-65 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                    <ThreeGlass />
                </div>
                {/* Center Content */}
                <div className="max-w-2xl text-xl md:text-4xl font-[600]   z-2 text-center">
                    <p>
                        Every brand deserves more than service providers. You get thinkers,
                        creators, and partners who are dedicated to your growth. Each solution is
                        shaped around your vision, built for today, and ready for what’s next.
                    </p>
                </div>
            </section>

            <section className=" black-section relative -z-10 w-full min-h-screen bg-[#0f0f0f] mt-[-52]">
                <div className="absolute inset-0  w-full h-full">
                    <DotGrid
                        dotSize={3}
                        gap={20}
                        baseColor="#555555"
                        activeColor="#844de9"
                        proximity={120}
                        shockRadius={250}
                        shockStrength={5}
                        resistance={750}
                        returnDuration={1.5}
                    />
                </div>
                <div className="relative z-10 flex flex-col py-40 text-white px-[10%] pointer-events-auto">
                    <h1 className="text-white text-4xl font-semibold">What we do</h1>
                </div>
            </section>
            <section
                className="gradient-section relative w-full h-[60vh]"
                style={{
                    background:
                        'linear-gradient(to bottom, #0f0f0f 0%, #1a4d8f 30%, #2563eb 50%, #60a5fa 70%, #ffffff 100%)',
                }}
            >
                {/* Optional: Top wavy border */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg
                        className="relative block w-full h-24"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,0 C150,60 350,0 600,30 C850,60 1050,0 1200,30 L1200,0 L0,0 Z"
                            fill="#0f0f0f"
                        />
                    </svg>
                </div>

                {/* Optional: Bottom wavy border */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg
                        className="relative block w-full h-24"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M0,120 C150,60 350,120 600,90 C850,60 1050,120 1200,90 L1200,120 L0,120 Z"
                            fill="#ffffff"
                        />
                    </svg>
                </div>
            </section>

            <section className="white-section min-h-screen">
                <span>Purpose-built for IP</span>
            </section>
        </>
    );
}

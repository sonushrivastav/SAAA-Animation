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
                    className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[120vw] h-[90vh]  overflow-hidden pointer-events-auto z- backdrop-blur-[10px]"
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
                    <ThreeGlass
                        motionVariant={0}
                        speed={1.2}
                        amplitude={0.06}
                        mouseInfluence={true}
                    />
                </div>
                <div className="z-4 absolute top-[50%] left-60 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                    <ThreeGlass
                        motionVariant={1}
                        speed={0.9}
                        amplitude={0.08}
                        mouseInfluence={true}
                    />
                </div>
                <div className="z-4 absolute top-[65%] right-100 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                    <ThreeGlass
                        motionVariant={2}
                        speed={1.4}
                        amplitude={0.07}
                        mouseInfluence={true}
                    />
                </div>
                <div className="z-4 absolute top-[25%] right-65 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                    <ThreeGlass
                        motionVariant={3}
                        speed={0.8}
                        amplitude={0.05}
                        mouseInfluence={true}
                    />
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

          
        </>
    );
}

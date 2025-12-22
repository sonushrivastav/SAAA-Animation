// src/app/page.js

'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect } from 'react';
import StarfieldBackground from '../components/oldcode/Starfield';

gsap.registerPlugin(ScrollTrigger);

const cards = [
    {
        title: 'DESIGN',
        description:
            'We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.',
        items: [
            'UI / UX',
            'BRANDING',
            '3D MODELING',
            'MOTION GRAPHICS / EDITING',
            'PRINT MEDIA',
            'CREATIVE / MARKETING COLLATERALS',
        ],
        modelUrl: '/models/design.glb',
    },
    {
        title: 'BUILD',
        description:
            'Our developers are part artists, part architects. They code, craft, and fine-tune every pixel until your site feels alive. Built to perform beautifully, no matter the screen or scale. ',
        items: [
            'BASIC WEBSITE',
            'E-COMMERCE WEBSITE',
            'CUSTOM CMS',
            'LANDING PAGES',
            'WEB / MOBILE APPLICATIONS',
            'AMC',
        ],
        modelUrl: '/models/build.glb',
    },
    {
        title: 'GROW',
        description:
            'We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.',
        items: [
            'SOCIAL MEDIA MARKETING',
            'PAID ADS / PERFORMANCE MARKETING',
            'SEO',
            'EMAIL & WHATSAPP MARKETING',
        ],
        modelUrl: '/models/grow.glb',
    },
];
export default function Home() {
    useEffect(() => {
        if (!window.starfieldUniforms) return;

        const uniforms = window.starfieldUniforms;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.services',
                start: 'top center',
                end: '+=200%',
                scrub: true,
                // markers: true, // enable for debugging
            },
        });

        // 1️⃣ Z → Y direction change
        tl.to(uniforms.uDirection.value, {
            x: 0,
            y: -1,
            z: 0,
            duration: 0.6,
            ease: 'power2.inOut',
        });

        // 2️⃣ Freeze star motion & switch to morph mode
        tl.to(
            uniforms.uMode,
            {
                value: 1,
                duration: 0.01,
            },
            '>-0.1'
        );

        // 3️⃣ Morph particles into GLB
        tl.to(uniforms.uMorph, {
            value: 1,
            duration: 1.4,
            ease: 'power3.out',
        });

        return () => {
            tl.kill();
            ScrollTrigger.kill();
        };
    }, []);
    return (
        <main className="relative w-full overflow-x-hidden bg-black text-white">
            {/* 🌌 STARFIELD BACKGROUND */}
            <div className="fixed inset-0 z-10">
                {/* <StarfieldBackground /> */}
            </div>

            {/* 🟣 HERO */}
            <section className="relative flex h-screen items-center justify-center">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Scroll Down</h1>
            </section>

            {/* ⭐ SCROLL SPACE */}
            <section className="h-[100vh]" />

            {/* 🔮 MORPH TRIGGER */}
            <section className="services relative flex h-[200vh] items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-semibold">Particles Morph</h2>
                    <p className="text-white/70 text-lg max-w-xl mx-auto">
                        Same starfield particles smoothly morph into a GLB logo.
                    </p>
                </div>
            </section>

            {/* 🟢 AFTER MORPH */}
            <section className="relative flex h-[120vh] items-center justify-center">
                <h2 className="text-4xl md:text-6xl font-semibold">Logo Formed</h2>
            </section>
        </main>
    );
}

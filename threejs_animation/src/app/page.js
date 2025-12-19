// src/app/page.js

'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CardStack from '../components/servicePage/CardStack';
import DotGrid from '../components/socialMedia/DotGrid';

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
    return (
        <main>
            {/* HERO SECTION */}
            <section className="h-screen flex items-center justify-center bg-black text-white">
                <h1 className="text-5xl font-bold">Hero Section</h1>
            </section>

            {/* CARD STACK */}
            <section className="relative bg-[#0f0f0f] flex min-h-screen px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
                <div className="absolute inset-0 z-1">
                    <DotGrid
                        dotSize={2}
                        gap={8}
                        baseColor="#271e37"
                        activeColor="#5227FF"
                        proximity={120}
                        shockRadius={250}
                        shockStrength={5}
                        resistance={750}
                        returnDuration={1.5}
                    />
                </div>

                <div className="z-10 flex flex-col w-full  ">
                    <h2 className="text-3xl  md:text-4xl lg:text-5xl text-[#fafafa]   font-semibold  lg:leading-[60px] ">
                        <span className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
                            Questions?
                        </span>{' '}
                        We're Here To Help
                    </h2>
                    <div className="mt-12 md:mt-14 flex flex-col gap-6">
                        <CardStack cards={cards} />
                    </div>
                </div>
                {/* Accordion */}
            </section>

            {/* OUTRO SECTION */}
            <section className="h-screen flex items-center justify-center bg-neutral-900 text-white">
                <h2 className="text-4xl font-semibold">Next Section</h2>
            </section>
        </main>
    );
}

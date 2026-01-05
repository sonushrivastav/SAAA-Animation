'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import CaseStudyCards from '../../components/allServicesComponents/CaseStudyCards';
import ContactForm from '../../components/allServicesComponents/ContactForm';
import FaqAccordion from '../../components/allServicesComponents/FaqAccordion';
import OtherServices from '../../components/allServicesComponents/OtherServices';
import useDeviceType from '../hooks/useDeviceType';
import DotGrid from './DotGrid';
import StatCard from './StatCard';
gsap.registerPlugin(ScrollTrigger);

const platformImages = [
    '/images/socialMedia/Instagram.svg',
    '/images/socialMedia/LinkedIn.svg',
    '/images/socialMedia/Facebook.svg',
    '/images/socialMedia/twitter.svg',
    '/images/socialMedia/pinterest.svg',
    '/images/socialMedia/tiktok.svg',
];
const caseStudies = [
    {
        title: 'Creative Newtech',
        tag: 'SMM',
        img: '/images/socialMedia/CNL.webp',
        href: '/services/seo',
    },
    {
        title: 'Ruark Audio',
        tag: 'SMM',
        img: '/images/socialMedia/iPhone 15 Mockup Poster 1.webp',
        href: '/services/seo',
    },
    {
        title: 'Share India',
        tag: 'SMM',
        img: '/images/socialMedia/Device 14PM.webp',
        href: '/services/seo',
    },
];

const faqData = [
    {
        question: 'What does your SMM service include?',
        answer: 'We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.',
    },
    {
        question: 'Which platforms do you manage?',
        answer: 'We manage major platforms like Instagram, Facebook, LinkedIn, Twitter, and YouTube to ensure consistent branding and engagement.',
    },
    {
        question: 'How do you measure success?',
        answer: 'We track engagement, conversions, reach, and audience growth metrics to measure and continuously optimize campaign performance.',
    },
    {
        question: 'Do you create content too?',
        answer: 'Yes, our creative team designs captivating posts, videos, and stories aligned with your brand voice and strategy.',
    },
    {
        question: 'When will I start seeing results?',
        answer: 'You’ll typically start seeing meaningful engagement and traction within 4–8 weeks of consistent activity and optimization.',
    },
];

const servicesArray = [
    {
        title: 'Search Engine OptimizationS',
        description:
            'We help you climb search results without breaking stride. Smart keywords, clean strategy, and content that pulls you to the top.',
        href: '/services/seo',
    },
    {
        title: 'Paid Ads / Performance Marketing',
        description:
            'We make algorithms your allies. Every click is tracked, every rupee earns its keep, every ad works harder than the last.',
        href: '/services/seo',
    },
    {
        title: 'EMail & Whatsapp Marketing',
        description:
            'We write messages people actually want to open. Less spam, more spark, and conversations that feel real.',
        href: '/services/seo',
    },
];

function initSpiralAnimation(slicesRef, isMobile, isTablet) {
    const canvas = document.getElementById('spiralCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0, 0, 3.15);

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    const container = canvas.parentElement;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    new RGBELoader().load('/images/studio_small_03_1k.hdr', hdrMap => {
        hdrMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdrMap;
    });

    const getModelTransform = () => {
        if (isMobile) {
            return {
                scale: [8, 8, 4.2],
                position: [-1.2, -0.6, 0],
                rotation: [0, 0.1, -Math.PI / 2],
            };
        }

        if (isTablet) {
            return {
                scale: [10, 10, 4.6],
                position: [-1.35, -0.8, 0],
                rotation: [0, 0.12, -Math.PI / 2],
            };
        }

        // Desktop
        return {
            scale: [16, 16, 5],
            position: [-2.6, -1.25, 0],
            rotation: [0, 0.15, -Math.PI / 2],
        };
    };

    const loader = new GLTFLoader();

    loader.load('/models/model.glb', gltf => {
        const rawModel = gltf.scene;
        const { scale, position, rotation } = getModelTransform();

        // const modelGroup = new THREE.Group();
        scene.add(rawModel);
        // modelGroup.add(rawModel);
        rawModel.scale.set(...scale);
        rawModel.position.set(...position);
        rawModel.rotation.set(...rotation);

        slicesRef.current = [];

        rawModel.traverse(child => {
            if (child.isMesh) {
                slicesRef.current.push(child);
            }
        });

        const order = {
            Curve001: 2,
            Curve002: 1,
            Curve_1: 3,
            Curve003: 4,
            Curve004: 5,
            Curve005: 6,
            Curve006: 7,
        };

        slicesRef.current.sort((a, b) => {
            return order[a.name] - order[b.name];
        });
        // Store original GLB transforms
        const originalTransforms = slicesRef.current.map(slice => ({
            position: slice.position.clone(),
            rotation: slice.rotation.clone(),
        }));

        // INITIAL TRANSFORMS
        slicesRef.current[0].position.set(0.53, 0, -0.03299); //1st slice
        slicesRef.current[1].position.set(0.456, 0, 0.075); //2nd slice
        slicesRef.current[2].position.set(0.323, 0, 0.135); // 3rd slice
        slicesRef.current[3].position.set(0.239, 0, 0.122); //4th slice
        slicesRef.current[4].position.set(0.142, 0, 0.107); //5th slice
        slicesRef.current[5].position.set(0.05, 0, 0.05); // 6th slice
        slicesRef.current[6].position.set(0, 0, 0); // last slice

        slicesRef.current[0].rotation.set(0, 2.257407, 0); //1st slice
        slicesRef.current[1].rotation.set(0, 1.76040734641021, 0); //2nd slice
        slicesRef.current[2].rotation.set(0, 1.22740734641021, 0); // 3rd slice
        slicesRef.current[3].rotation.set(0, 0.945407346410207, 0); //4th slice
        slicesRef.current[4].rotation.set(0, 0.633407346410207, 0); //5th slice
        slicesRef.current[5].rotation.set(0.0, 0.25, 0); // 6th slice
        slicesRef.current[6].rotation.set(0, 0, 0); // last slice

        // ✅ Scroll-triggered GSAP timeline
        const tl = gsap.timeline({
            paused: true, // we'll manually control when it plays
        });

        // Animate stacked spirals outward into spiral positions
        slicesRef.current.forEach((slice, i) => {
            const delay = i * 0.1;
            const finalPos = {
                x: slicesRef.current[i].position.x,
                y: slicesRef.current[i].position.y,
                z: slicesRef.current[i].position.z,
            };

            const finalRot = {
                x: slicesRef.current[i].rotation.x,
                y: slicesRef.current[i].rotation.y,
                z: slicesRef.current[i].rotation.z,
            };

            slice.position.copy(originalTransforms[i].position);
            slice.rotation.copy(originalTransforms[i].rotation);
            tl.to(
                slice.rotation,
                {
                    x: finalRot.x,
                    y: finalRot.y,
                    z: finalRot.z,
                    duration: 2.5,
                    ease: 'power2.inOut',
                    reversed: true,
                },
                delay
            );
            tl.to(
                slice.position,
                {
                    x: finalPos.x,
                    y: finalPos.y,
                    z: finalPos.z,
                    duration: 2.5,
                    ease: 'power2.inOut',
                    reversed: true,
                },
                delay
            );
        });

        ScrollTrigger.create({
            trigger: '.scroll-container',
            start: 'top 80%',
            once: false, // only trigger once
            onEnter: () => tl.play(),
        });
    });

    // Handle resize
    window.addEventListener('resize', () => {
        const container = canvas.parentElement;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Render Loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

const ServiceLayout = ({ data, caseStudies }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const slicesRef = useRef([]);
    const { isMobile, isTablet } = useDeviceType();

    useEffect(() => {
        initSpiralAnimation(slicesRef, isMobile, isTablet);
    }, [isMobile, isTablet]);

    return (
        <div>
            <section className="relative w-full overflow-hidden bg-[#fafafa] md:min-h-screen flex items-center justify-center">
                <div className="flex flex-col-reverse md:flex-row w-full  self-stretch items-center ">
                    <div className="absolute inset-0 ">
                        <DotGrid
                            dotSize={2}
                            gap={8}
                            baseColor="#271e3722"
                            activeColor="#844de9"
                            proximity={120}
                            shockRadius={250}
                            shockStrength={5}
                            resistance={750}
                            returnDuration={1.5}
                        />
                    </div>
                    {/* left section */}
                    <div className="z-10 relative w-full md:w-[65%] self-stretch flex items-center    text-[#0f0f0f] ">
                        <div className="px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20 ">
                            <h1 className="text-5xl lg:text-7xl  text-[#0f0f0f] font-semibold lg:leading-[75px] ">
                                {data.title}
                                {/* Social{' '}
                                <span className="bg-[#844de9] inline text-[#fafafa] px-2 rounded-md">
                                    Media
                                </span>
                                <br />
                                Marketing */}
                            </h1>

                            <p className="text-[#555555] mt-6 max-w-lg mx-auto md:mx-0 text-lg md:text-xl lg:text-2xl">
                                {data.heroDescription}
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="z-10 flex items-center justify-center self-stretch w-full md:w-[35%] ">
                        <video
                            src="/videos/Big_Buck_Bunny_1080_10s_5MB.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover  "
                        />
                        {/* <div className="w-full flex items-center justify-center "> */}
                        {/* <Image
                                src={'/images/socialMedia/image 3.png'}
                                alt={'dummy image'}
                                width={400}
                                height={400}
                                className="object-contain w-full mx-0 md:mx-4"
                            ></Image> */}
                        {/* </div> */}
                    </div>
                </div>
            </section>

            {/* Key Figures Section */}

            <section className="w-full  bg-[#0f0f0f] text-[#fafafa] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
                <h2 className="text-3xl md:text-4xl xl:text-5xl   font-semibold  lg:leading-[60px]">
                    Here are some{' '}
                    <span className="bg-[#844de9]  px-2  rounded-md">key figures</span> that
                    illustrate our growth and commitment to our clients.
                </h2>

                {/* Stats Grid Section */}
                <div className=" relative mt-12 md:mt-14  grid grid-cols-1 md:grid-cols-3 bg-[#0f0f0f] rounded-2xl ">
                    <StatCard
                        stat={data.stats[0].stat}
                        label={data.stats[0].label}
                        hasContent={true}
                        roundedClass="rounded-t-2xl sm:rounded-tr-none"
                        isMobile={isMobile}
                        isTablet={isTablet}
                    />

                    {/* Card 2 */}
                    <StatCard
                        stat={data.stats[1].stat}
                        label={data.stats[2].label}
                        hasContent={true}
                        isMobile={isMobile}
                        isTablet={isTablet}
                        roundedClass=""
                    />

                    {/* Card 3 */}
                    <StatCard hasContent={false} roundedClass="sm:rounded-tr-2xl hidden sm:flex" />

                    {/* Card 4 */}
                    <StatCard hasContent={false} roundedClass="sm:rounded-bl-2xl hidden sm:flex" />

                    {/* Card 5 */}
                    <StatCard
                        stat={data.stats[2].stat}
                        label={data.stats[2].label}
                        hasContent={true}
                        roundedClass=""
                        isMobile={isMobile}
                        isTablet={isTablet}
                    />

                    {/* Card 6 */}
                    <StatCard
                        stat={data.stats[3].stat}
                        label={data.stats[3].label}
                        hasContent={true}
                        roundedClass="rounded-b-2xl sm:rounded-bl-none"
                        isMobile={isMobile}
                        isTablet={isTablet}
                    />
                </div>

                {/* Platforms we manage */}

                <div className="mt-12 md:mt-14 flex flex-col items-center gap-8 md:gap-12">
                    <h1 className="text-3xl md:text-4xl xl:text-5xl   font-semibold  lg:leading-[65px] text-center">
                        Platforms we manage
                    </h1>
                    <div className="grid grid-cols-3  md:grid-cols-6 justify-center gap-6">
                        {data.platformImages.map((src, index) => (
                            // <div
                            //     key={index}
                            //     className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center "
                            // >
                            <Image
                                key={index}
                                src={src}
                                alt={`Platform ${index + 1}`}
                                width={50}
                                height={20}
                                className="mx-4"
                            />
                            // </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* case stuides */}

            <section className="w-full  bg-[#fafafa] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20 ">
                <h2 className="text-3xl md:text-4xl  xl:text-5xl font-semibold  lg:leading-[60px]">
                    Case{' '}
                    <span className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
                        Studies
                    </span>{' '}
                </h2>

                <div className="mt-12 md:mt-14 grid gap-12 md:gap-6 lg:gap-10 md:grid-cols-3 items-stretch">
                    {' '}
                    <CaseStudyCards caseStudies={caseStudies} />
                </div>

                <div className="w-full flex items-center justify-center mt-12 ">
                    <button className="bg-[#0f0f0f] text-[#fafafa] rounded-full px-6 py-2 text-base md:text-lg xl:text-xl">
                        View More
                    </button>
                </div>

                {/* Ready to level */}
                <div className="mt-12 md:mt-14 flex flex-col md:flex-row items-center text-[#0f0f0f]  ">
                    <div className="flex flex-col w-full md:w-[50%] lg:w-[40%]">
                        <h1 className="text-3xl  md:text-4xl xl:text-5xl   font-semibold  lg:leading-[60px]">
                            Ready to{' '}
                            <div className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
                                level
                            </div>{' '}
                            up?
                        </h1>
                        <p className="text-[#555555] text-base md:text-lg xl:text-xl w-sm mt-2">
                            You’ve got the vision, we’ve got the creative power. Let’s turn your
                            brand into something people can’t scroll past
                        </p>
                        <button className="bg-[#0f0f0f] text-[#fafafa] rounded-full px-6 py-2 w-fit mt-4 text-base md:text-lg xl:text-xl">
                            Schedule A Call
                        </button>
                    </div>
                    <div className="w-full md:w-[50%]  lg:w-[60%]  relative flex items-center justify-center  h-[400px] scroll-container ">
                        <canvas
                            // ref={canvasRef}
                            id="spiralCanvas"
                            className=" w-full h-full pointer-events-none "
                        ></canvas>
                    </div>
                </div>
            </section>

            {/* Accordian section */}

            <section className="relative bg-[#0f0f0f] flex  px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
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
                    <h2 className="text-3xl  md:text-4xl xl:text-5xl text-[#fafafa]   font-semibold  lg:leading-[60px] ">
                        <span className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
                            Questions?
                        </span>{' '}
                        We're Here To Help
                    </h2>
                    <div className="mt-12 md:mt-14 flex flex-col gap-6">
                        <FaqAccordion faqData={data.faqData} defaultActiveIndex={0} />
                    </div>
                </div>
                {/* Accordion */}
            </section>

            {/* Other Related */}

            <section className="flex flex-col  bg-[#fafafa]  px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
                <h2 className="text-3xl  md:text-4xl xl:text-5xl text-[#0f0f0f]   font-semibold  xl:leading-[60px] ">
                    Other Related{' '}
                    <span className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
                        Services
                    </span>
                </h2>
                <div className="mt-10 md:mt-14">
                    <OtherServices services={data.servicesArray} />
                </div>
                <div className="mt-12 md:mt-14 flex flex-col items-center justify-center">
                    <h2 className="text-3xl  md:text-4xl xl:text-5xl text-[#0f0f0f]   font-semibold  lg:leading-[60px] ">
                        <span className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
                            Reach
                        </span>{' '}
                        out to us
                    </h2>
                    <div className="mt-12 md:mt-14 w-full flex flex-col lg:flex-row items-stretch justify-center border border-[#0F0F0F] rounded-2xl ">
                        <div className="relative flex w-full lg:w-[50%] rounded-t-2xl p-6 md:p-10   lg:rounded-r-none lg:rounded-l-2xl">
                            <div className="absolute inset-0 z-1 pointer-events-none">
                                <DotGrid
                                    dotSize={2}
                                    gap={8}
                                    baseColor="#271e3722"
                                    activeColor="#844de9"
                                    proximity={120}
                                    shockRadius={250}
                                    shockStrength={5}
                                    resistance={750}
                                    returnDuration={1.5}
                                />
                            </div>
                            <ContactForm btnPosition="left" />
                        </div>

                        <div className="relative w-full lg:w-[50%] h-[350px] lg:h-auto  rounded-b-2xl    lg:rounded-l-none lg:rounded-r-2xl overflow-hidden">
                            <Image
                                src="/images/socialMedia/reach_out.webp"
                                alt="Reach out"
                                fill
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover rounded-b-2xl    lg:rounded-l-none lg:rounded-r-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServiceLayout;

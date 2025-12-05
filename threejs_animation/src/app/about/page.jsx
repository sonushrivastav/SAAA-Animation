'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';
import { Suspense, useLayoutEffect, useRef, useState } from 'react';
import DotGrid from '../../components/socialMedia/DotGrid';

gsap.registerPlugin(ScrollTrigger);

const ourVision = [
    {
        title: 'Sometimes they say I’m mad but a grain of madness is the best of Art.',
        img: '/images/about/ourVision_1.webp',
    },
    {
        title: 'What would life be, if we had no courage to attempt anything?',
        img: '/images/about/ourVision_2.webp',
    },
    {
        title: 'I am seeking, I am striving, I am in it with all my heart.',
        img: '/images/about/ourVision_3.webp',
    },
];

const TeamCard = ({
    name = 'Nati',
    role = 'Managing Director',
    image = '/images/about/ourVision_1.webp',
    bgImage = '/images/about/ourVision_3.webp',
}) => {
    const cardRef = useRef(null);

    return (
        <div
            ref={cardRef}
            className="team-card relative w-[300px] h-[300px] mx-auto will-change-transform overflow-hidden"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Base Image */}
            <Image src={image} alt={name} fill className="object-cover" />

            {/* Hover Reveal Image */}
            <Image
                src={bgImage}
                alt={name}
                fill
                className="hover-img object-cover absolute inset-0"
            />
            {/* Info */}
            <div className="info absolute bottom-4 left-3 text-[#fafafa]">
                <p className="text-lg font-semibold">{name}</p>
                <p className="text-sm ">{role}</p>
            </div>
        </div>
    );
};

const waitForImages = () =>
    new Promise(resolve => {
        const imgs = Array.from(document.images);
        if (imgs.length === 0) return resolve();
        let loaded = 0;
        imgs.forEach(img => {
            if (img.complete) {
                if (++loaded === imgs.length) resolve();
            } else {
                img.onload = img.onerror = () => {
                    if (++loaded === imgs.length) resolve();
                };
            }
        });
    });

const StatCard = ({ stat, label, hasContent, roundedClass }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative p-8 md:p-10 ${roundedClass} bg-transparent transition-colors duration-300 w-full md:w-[33.33%] h-[400px] ${
                hasContent
                    ? `border ${isHovered ? 'border-[#fafafa]' : 'border-[#555555]'}`
                    : isHovered
                    ? 'border border-[#555555]'
                    : 'border border-[#555555]'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Dot Grid - only show when conditions are met */}
            <div className="absolute inset-0 overflow-hidden">
                {(!hasContent || (hasContent && isHovered)) && (
                    <DotGrid
                        dotSize={2}
                        gap={8}
                        baseColor={!hasContent ? '#271e37' : '#271e37'}
                        activeColor={!hasContent && isHovered ? '#fafafa' : '#844de9'}
                        proximity={120}
                        shockRadius={250}
                        shockStrength={5}
                        resistance={750}
                        returnDuration={1.5}
                    />
                )}
            </div>

            {/* Content */}
            {hasContent && (
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <h2
                        className={`text-2xl md:text-4xl font-bold transition-colors duration-300 ${
                            isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                        }`}
                    >
                        {stat}
                    </h2>
                    <p
                        className={`text-base md:text-lg mt-2 transition-colors duration-300 ${
                            isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                        }`}
                    >
                        {label}
                    </p>
                </div>
            )}
        </div>
    );
};
const About = () => {
    let start, end;
    const isMobile = window.innerWidth < 768;
    useLayoutEffect(() => {
        let ctx;
        const setup = async () => {
            await waitForImages();
            ScrollTrigger.refresh();

            ctx = gsap.context(() => {
                const parent = document.querySelector('.team-parent');

                const rows = gsap.utils.toArray('.team-row');

                rows.forEach(row => {
                    const cards = row.querySelectorAll('.team-card');

                    const parentRect = parent.getBoundingClientRect();
                    const parentCenterX = parentRect.left + parentRect.width / 2;
                    const parentCenterY = parentRect.top + parentRect.height / 2;

                    const initialOffsets = [];

                    cards.forEach(card => {
                        const rect = card.getBoundingClientRect();
                        const cardCenterX = rect.left + rect.width / 2;
                        const cardCenterY = rect.top + rect.height / 2;

                        initialOffsets.push({
                            x: parentCenterX - cardCenterX + 200,
                            y: parentCenterY - cardCenterY + 200,
                        });
                    });
                    if (isMobile) {
                        start = 'top bottom';
                        end = 'top top';
                    } else {
                        start = 'top 70%';
                        end = 'top top';
                    }
                    gsap.from(cards, {
                        opacity: 0,
                        scale: 0.1,
                        x: i => initialOffsets[i].x,
                        y: i => initialOffsets[i].y,
                        z: -4000,
                        rotateX: 160,
                        rotateY: 110,
                        rotate: 110,
                        duration: 5.64,
                        ease: 'power3.out',
                        stagger: 1.15,

                        scrollTrigger: {
                            trigger: row,
                            start,
                            end,
                            scrub: 1,
                        },
                    });
                });
            }, document);
        };

        setup();

        return () => {
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <div>
            <section className=" w-full min-h-screen">
                <Suspense fallback={<p>Loading video...</p>}>
                    <video
                        src="/videos/Big_Buck_Bunny_1080_10s_5MB.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                    ></video>
                </Suspense>
            </section>

            {/* bit about us */}
            <section className="w-full  bg-[#0f0f0f] text-[#fafafa] px-10 py-12 md:px-32 md:py-24">
                <h2 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px]">
                    A Bit <div className="bg-[#844de9] inline px-2  rounded-md">About Us</div> that
                </h2>

                <div className="mt-16 bg-[#0f0f0f] text-[#9c9c9c] text-lg md:text-xl">
                    <p className="pb-6 ">
                        SAAA Consultants is a multidisciplinary creative team built on one belief:
                        different perspectives create better outcomes. We approach every brief with
                        curiosity, craft and a commitment to doing work that genuinely helps people,
                        businesses and communities grow.
                    </p>

                    <p className="pb-6">
                        We’re not here to chase talent, we build it. Our culture is shaped by
                        integrity, collaboration and a drive for excellence, creating an environment
                        where ideas sharpen, skills grow and impact compounds.
                    </p>

                    <p className="pb-6">
                        At our core, we’re problem-solvers who turn strategy into smart, beautiful
                        execution — from branding and design to digital experiences and content. We
                        move fast, stay honest and deliver work that’s crafted with intention and
                        built to make a difference.
                    </p>

                    <Image
                        className="w-full h-full py-6"
                        src={'/Image.png'}
                        width={200}
                        height={200}
                        alt="aboutImage"
                    />
                    <p className="pt-6">
                        At our core, we’re problem-solvers who turn strategy into smart, beautiful
                        execution — from branding and design to digital experiences and content. We
                        move fast, stay honest and deliver work that’s crafted with intention and
                        built to make a difference.
                    </p>
                </div>
            </section>

            {/* our vision */}
            <section className=" bg-[#fafafa] w-full  px-10 py-12 md:px-32 md:py-24">
                <h2 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px]">
                    Quotes That Gave Us{' '}
                    <div className="bg-[#844de9] text-[#fafafa] inline px-2  rounded-md">
                        Our Vision
                    </div>
                </h2>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                    {ourVision.map((item, index) => (
                        <div key={index} className="relative ">
                            {/* Dotted border on right and bottom */}
                            <div
                                className="absolute w-full h-full rounded-xl transform translate-x-3 translate-y-3 pointer-events-none" // Use translate-x/y for the offset
                                style={{
                                    border: '2px dashed #844DE9', // Apply dashed border to all sides
                                }}
                            ></div>

                            {/* Main card */}
                            <div className="relative bg-white rounded-xl border-1 border-[#0f0f0f]  flex flex-col items-start  justify-between h-full">
                                <div className="flex flex-col w-full gap-8  p-2">
                                    {/* image */}
                                    <div className="w-full  flex items-center justify-center    ">
                                        <Image
                                            src={item.img}
                                            alt={'dummy image'}
                                            width={150}
                                            height={150}
                                            className="h-full w-full object-cover rounded-xl "
                                        ></Image>
                                    </div>
                                    {/* text */}
                                    <div className="relative w-full px-6 flex justify-between items-center pb-4">
                                        <h3 className="text-lg md:text-2xl uppercase font-semibold italic  text-[#0f0f0f] ">
                                            {item.title}
                                        </h3>
                                        <svg
                                            width="43"
                                            height="31"
                                            viewBox="0 0 43 31"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="absolute -top-4 left-3"
                                        >
                                            <path
                                                opacity="0.2"
                                                d="M17.3406 4.56227C17.4187 4.56227 17.1063 5.03019 16.4033 5.96604C15.7784 6.90189 14.9973 8.0717 14.0599 9.47547C13.2007 10.8792 12.4587 12.244 11.8338 13.5698C13.2398 13.9598 14.4505 14.6226 15.4659 15.5585C16.5595 16.4164 17.3797 17.4302 17.9264 18.6C18.5513 19.6918 18.8638 20.7836 18.8638 21.8755C18.8638 24.605 17.9655 26.8277 16.1689 28.5434C14.4505 30.1811 12.2243 31 9.49046 31C6.99092 31 4.76476 30.0642 2.81199 28.1925C0.93733 26.2428 0 23.9421 0 21.2906C0 18.873 0.546776 16.5333 1.64033 14.2717C2.73388 11.9321 4.06176 9.78742 5.62398 7.83774C7.18619 5.88805 8.6703 4.25032 10.0763 2.92453C11.4823 1.52076 12.4587 0.545914 13.0054 0L17.3406 4.56227ZM41.4768 4.56227C41.555 4.56227 41.2425 5.03019 40.5395 5.96604C39.8365 6.90189 39.0163 8.0717 38.079 9.47547C37.2198 10.8792 36.4777 12.244 35.8529 13.5698C37.2589 13.9598 38.4696 14.6226 39.485 15.5585C40.5786 16.4164 41.4378 17.4302 42.0627 18.6C42.6876 19.6918 43 20.7836 43 21.8755C43 24.605 42.1017 26.8277 40.3052 28.5434C38.5867 30.1811 36.3215 31 33.5095 31C31.0881 31 28.901 30.0642 26.9482 28.1925C24.9955 26.2428 24.0191 23.9421 24.0191 21.2906C24.0191 18.873 24.5658 16.5333 25.6594 14.2717C26.753 11.9321 28.0808 9.78742 29.6431 7.83774C31.2053 5.88805 32.6894 4.25032 34.0954 2.92453C35.5014 1.52076 36.5168 0.545914 37.1417 0L41.4768 4.56227Z"
                                                fill="#9C9C9C"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* collective */}
            <section className="bg-[#0f0f0f]  text-[#fafafa] w-full min-h-screen  px-10 py-12 md:px-32 md:py-24">
                <h2 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px]">
                    We are a <div className="bg-[#844de9] inline px-2  rounded-md">collective</div>{' '}
                    of dedicated individuals committed to transforming ideas into captivating
                    digital experiences.
                </h2>

                <div className=" relative mt-16  flex flex-col md:flex-row flex-wrap bg-[#0f0f0f] rounded-2xl overflow-hidden">
                    <StatCard
                        stat="Innovative Customization"
                        label="Our strategy centers on a research-focused approach, delving deep to gather insights. By understanding your business and market trends, we craft a customized strategy for relentless growth and long-term brand success."
                        hasContent={true}
                        roundedClass="rounded-t-2xl sm:rounded-tr-none sm:rounded-tl-2xl
"
                    />

                    {/* Card 2 */}
                    <StatCard hasContent={false} roundedClass="" />

                    {/* Card 3 */}
                    <StatCard
                        stat="Pinnacle Performance"
                        label="Committed to excellence, our team has satisfied over 100 clients with relentless dedication. We strive for perfection, consistently exceeding expectations."
                        hasContent={true}
                        roundedClass="sm:rounded-tr-2xl"
                    />

                    {/* Card 4 */}
                    <StatCard hasContent={false} roundedClass="sm:rounded-bl-2xl" />

                    {/* Card 5 */}
                    <StatCard
                        stat="Insightful Strategy"
                        label="Thriving on creativity, our innovative process sets us apart. We craft customized strategies for a personalized experience tailored to your unique requirements."
                        hasContent={true}
                        roundedClass=""
                    />

                    {/* Card 6 */}
                    <StatCard
                        hasContent={false}
                        roundedClass="rounded-b-2xl sm:rounded-br-2xl sm:rounded-bl-none"
                    />
                </div>
            </section>

            {/* Team */}
            <section className="bg-[#fafafa]  text-[#0f0f0f] w-full min-h-screen  px-10 py-12 md:px-32 md:py-24">
                <h2 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px]">
                    Meet The Team That Turns Work Into{' '}
                    <div className="bg-[#844de9] text-[#fafafa] inline px-2  rounded-md">Wow</div>
                </h2>
                <div
                    className="team-parent relative w-full mt-16"
                    style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
                >
                    {' '}
                    <div className="team-row flex items-center flex-col md:flex-row  justify-center gap-2 py-1 ">
                        <TeamCard image="/images/about/saurav.webp" />
                        <TeamCard image="/images/about/rohan.webp" />
                        <TeamCard image="/images/about/saurabh.webp" />
                        <TeamCard image="/images/about/harsh.webp" />
                        <TeamCard image="/images/about/tejas.webp" />
                        <TeamCard image="/images/about/puja.webp" />
                    </div>
                    <div className="team-row flex flex-col md:flex-row items-center justify-center gap-2 py-1">
                        <TeamCard image="/images/about/saurav.webp" />
                        <TeamCard image="/images/about/rohan.webp" />
                        <TeamCard image="/images/about/saurabh.webp" />
                        <TeamCard image="/images/about/harsh.webp" />
                        <TeamCard image="/images/about/tejas.webp" />
                        <TeamCard image="/images/about/puja.webp" />
                    </div>
                    <div className="team-row flex flex-col md:flex-row items-center justify-center gap-2 py-1">
                        <TeamCard image="/images/about/saurav.webp" />
                        <TeamCard image="/images/about/rohan.webp" />
                        <TeamCard image="/images/about/saurabh.webp" />
                        <TeamCard image="/images/about/harsh.webp" />
                        <TeamCard image="/images/about/tejas.webp" />
                        <TeamCard image="/images/about/puja.webp" />
                    </div>
                    <div className="team-row flex flex-col md:flex-row items-center justify-center gap-2 py-1">
                        <TeamCard image="/images/about/saurav.webp" />
                        <TeamCard image="/images/about/rohan.webp" />
                        <TeamCard image="/images/about/saurabh.webp" />
                        <TeamCard image="/images/about/harsh.webp" />
                        <TeamCard image="/images/about/tejas.webp" />
                        <TeamCard image="/images/about/puja.webp" />
                    </div>
                    <div className="team-row flex flex-col md:flex-row items-center justify-center gap-2 py-1">
                        <TeamCard image="/images/about/saurav.webp" />
                        <TeamCard image="/images/about/rohan.webp" />
                        <TeamCard image="/images/about/saurabh.webp" />
                        <TeamCard image="/images/about/harsh.webp" />
                        <TeamCard image="/images/about/tejas.webp" />
                        <TeamCard image="/images/about/puja.webp" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;

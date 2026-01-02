'use client';

import Image from 'next/image';
import { useState } from 'react';
import ContactForm from '../../components/allServicesComponents/ContactForm';
import useDeviceType from '../../components/hooks/useDeviceType';
import DotGrid from '../../components/socialMedia/DotGrid';

const Contact = () => {
    const StatCard = ({
        title,
        address,
        email,
        contactPerson,
        headQurter,
        hasContent,
        variant = 'location',
        roundedClass = '',
    }) => {
        const { isMobile, isTablet } = useDeviceType();
        const [isHovered, setIsHovered] = useState(false);

        const [copied, setCopied] = useState(false);

        const isContact = variant === 'contact';

        const handleCopy = () => {
            navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        };

        return (
            <div
                className={`relative p-4 md:p-6 lg:p-10 ${roundedClass} bg-transparent transition-colors duration-300 w-full h-[250px] md:h-[300px] lg:h-[300px] ${
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
                            activeColor={
                                !hasContent ? '#fafafa' : isHovered ? '#844de9' : '#271e37'
                            }
                            proximity={120}
                            shockRadius={250}
                            shockStrength={5}
                            resistance={750}
                            returnDuration={1.5}
                        />
                    )}
                </div>

                {/* Location */}
                {!isContact && hasContent && (
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between items-center">
                                <h2
                                    className={`text-2xl md:text-4xl xl:text-4xl font-semibold transition-colors duration-300  ${
                                        isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                                    }`}
                                >
                                    {title}
                                </h2>
                                {headQurter && (
                                    <p
                                        className={`text-lg md:text-xl xl:text-2xl font-bold transition-colors duration-300 ${
                                            isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                                        }`}
                                    >
                                        HQ
                                    </p>
                                )}
                            </div>

                            <p
                                className={`text-base md:text-lg xl:text-xl mt-4 transition-colors duration-300  ${
                                    isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                                }`}
                            >
                                {address}
                            </p>
                        </div>
                        <div className="flex flex-col  gap-2 ">
                            <p className="  text-sm md:text-base   text-[#9c9c9c]">Email</p>
                            <div className="flex  md:flex-row items-center  gap-2">
                                <p
                                    className={`text-base md:text-lg xl:text-xl font-[500]  transition-colors duration-300  ${
                                        isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                                    }`}
                                >
                                    {email}
                                </p>

                                {/* Copy button visible only on hover */}
                                {(isHovered || isMobile || isTablet) && (
                                    <button
                                        onClick={handleCopy}
                                        className="text-xs px-2 py-1 rounded-md bg-transparent text-[#fafafa] border border-[#666]"
                                    >
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact */}
                {isContact && (
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between items-center">
                                <h2
                                    className={`text-2xl md:text-4xl xl:text-4xl font-bold transition-colors duration-300 ${
                                        isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                                    }`}
                                >
                                    {title}
                                </h2>
                            </div>

                            <p
                                className={`text-sm md:text-base xl:text-xl mt-4 transition-colors duration-300 ${
                                    isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                                }`}
                            >
                                {address}
                            </p>
                        </div>
                        <div className="flex flex-col  gap-2 ">
                            <div className="flex flex-row gap-6 items-center  ">
                                <div className="w-20 h-20 lg:w-25 lg:h-25 rounded-[100%] border-t-2 border-[#fafafa] border-b-2">
                                    <Image
                                        src={'/images/about/saurav.webp'}
                                        width={200}
                                        height={200}
                                        alt="Image"
                                        className={`w-full h-full  rounded-[100%] object-cover ${
                                            isHovered ? 'grayscale-0' : 'grayscale'
                                        } `}
                                    />
                                </div>

                                <div className="flex flex-row justify-between items-center lg:w-[70%] ">
                                    <div className="flex flex-col justify-center ">
                                        <h3
                                            className={`text-sm md:text-lg xl:text-2xl font-bold transition-colors duration-300 ${
                                                isHovered ? 'text-[#fafafa]' : 'text-[#9C9C9C]'
                                            }`}
                                        >
                                            {contactPerson.name}
                                        </h3>
                                        <p className="text-[#9C9C9C] text-sm md:text-base xl:text-base">
                                            {contactPerson.role}
                                        </p>
                                    </div>

                                    {(isHovered || isMobile || isTablet) && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="56"
                                            height="56"
                                            viewBox="0 0 56 56"
                                            fill="none"
                                            className="w-20 sm:w-auto rounded-[100%] border-t-2 border-[#fafafa] border-b-2"
                                        >
                                            <rect
                                                width="56"
                                                height="56"
                                                rx="28"
                                                fill="#FBFBFB"
                                                fillOpacity="0.2"
                                            />
                                            <g clipPath="url(#clip0_7486_673)">
                                                <path
                                                    d="M42.2105 34.7831L38.1635 30.736C36.7181 29.2907 34.261 29.8689 33.6828 31.7478C33.2492 33.0487 31.8039 33.7714 30.503 33.4822C27.6123 32.7596 23.7098 29.0016 22.9871 25.9663C22.5535 24.6654 23.4207 23.2201 24.7215 22.7865C26.6005 22.2084 27.1787 19.7512 25.7333 18.3059L21.6863 14.2588C20.53 13.2471 18.7955 13.2471 17.7838 14.2588L15.0376 17.005C12.2914 19.8958 15.3266 27.5562 22.1199 34.3495C28.9131 41.1427 36.5736 44.3226 39.4643 41.4318L42.2105 38.6856C43.2223 37.5293 43.2223 35.7948 42.2105 34.7831Z"
                                                    fill="#9C9C9C"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_7486_673">
                                                    <rect
                                                        width="29"
                                                        height="29"
                                                        fill="white"
                                                        transform="translate(14 13.5)"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };
    return (
        <div>
            <section className="bg-[#0f0f0f] px-8 pt-28 pb-10 md:px-14 lg:px-28 md:pt-32 md:pb-16 lg:pt-44 lg:pb-20">
                <h2 className="text-3xl md:text-4xl xl:text-6xl  text-[#fafafa] font-semibold xl:leading-[75px] ">
                    Let's imagine,{' '}
                    <span className="bg-[#844de9] inline text-[#fafafa] px-2 rounded-md">
                        work together,
                    </span>{' '}
                    and create side by side. We're excited to chat with you.
                </h2>

                <div className=" relative mt-12 md:mt-14  grid grid-cols-1 md:grid-cols-2 bg-[#0f0f0f] rounded-2xl ">
                    <StatCard
                        hasContent={true}
                        title="Mumbai"
                        address="Kanakia Wall Street, Mumbai, India"
                        email="info@saaaconsultants.com"
                        variant="location"
                        roundedClass="rounded-t-2xl sm:rounded-tr-none"
                        headQurter={true}
                    />

                    <StatCard
                        hasContent={true}
                        title="Sambhajinagar"
                        address="Sambhajinagar"
                        email="info@saaaconsultants.com"
                        variant="location"
                        roundedClass="rounded-tr-none sm:rounded-tr-2xl"
                    />

                    {/* Card 3 */}
                    <StatCard
                        title="Discuss your digital challenges."
                        variant="contact"
                        hasContent={true}
                        contactPerson={{
                            name: 'Saurav Singh',
                            role: 'Co-Head, Digital Marketing / Business',
                            image: '/images/about/saurav.webp',
                        }}
                        roundedClass="rounded-b-2xl sm:rounded-br-none"
                    />

                    <StatCard hasContent={false} roundedClass="rounded-br-2xl hidden sm:flex" />
                </div>
            </section>

            <section className="w-full min-h-screen bg-[#fafafa] flex flex-col lg:flex-row gap-5 lg:gap-0 items-stretch justify-center px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
                <div className=" w-full lg:w-[50%]  overflow-hidden">
                    <h2 className="text-3xl  md:text-4xl xl:text-5xl text-[#0f0f0f]   font-semibold  lg:leading-[60px] ">
                        Have a project to{' '}
                        <span className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
                            discuss?
                        </span>{' '}
                    </h2>
                    <p className="text-base md:text-lg xl:text-xl text-[#9c9c9c] ">
                        If you’d like to know more then please get in touch with us.
                    </p>
                </div>
                <div className=" flex w-full lg:w-[50%] ">
                    <ContactForm btnPosition="right" />
                </div>
            </section>
        </div>
    );
};

export default Contact;

'use client';

import Image from 'next/image';
import Link from 'next/link';

const CaseStudyCards = ({ caseStudies = [], className = '' }) => {
    return (
        <>
            {caseStudies.map((item, index) => (
                <div key={index} className="relative">
                    {/* Dotted border */}
                    <div
                        className="absolute w-full h-full rounded-xl transform translate-x-3 translate-y-3 pointer-events-none"
                        style={{
                            border: '2px dashed #844DE9',
                        }}
                    ></div>

                    {/* Main card */}
                    <div className="relative bg-white pt-6 rounded-xl border border-[#0f0f0f] flex flex-col items-start justify-between h-full">
                        <div className="flex flex-col w-full">
                            <div className="w-full px-6 flex justify-between items-center">
                                <h3 className="text-lg md:text-2xl uppercase font-semibold text-[#0f0f0f]">
                                    {item.title}
                                </h3>

                                <Link href={item.href} className="cursor-pointer">
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 17 17"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M0.707031 16L8.20703 8.5L15.707 1M15.707 1H4.74549M15.707 1V11.9615"
                                            stroke="#0F0F0F"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </Link>
                            </div>

                            <div className="px-6 py-2">
                                <span className="px-2 py-1 text-sm rounded-lg bg-[#ededed] text-[#555555]   self-start">
                                    {item.tag}
                                </span>
                            </div>
                        </div>

                        <div className="w-full flex items-center justify-center rounded-b-2xl">
                            <Image
                                src={item.img}
                                alt={item.title || 'case study image'}
                                width={200}
                                height={200}
                                className="h-full w-full object-cover rounded-b-2xl"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default CaseStudyCards;

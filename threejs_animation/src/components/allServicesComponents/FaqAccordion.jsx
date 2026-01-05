'use client';

import { useState } from 'react';

const FaqAccordion = ({ faqData = [], defaultActiveIndex = 0 }) => {
    const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

    const toggleAccordion = index => {
        setActiveIndex(prev => (prev === index ? null : index));
    };

    return (
        <>
            {faqData.map((item, index) => (
                <div
                    key={index}
                    className={`border border-[#fafafa] bg-[#55555533] backdrop-blur-xs rounded-xl overflow-hidden transition-all duration-300`}
                >
                    <div
                        className="w-full  flex justify-between items-center gap-2 px-6 py-4 text-left text-[#fafafa] focus:outline-none"
                        onClick={() => toggleAccordion(index)}
                    >
                        <span className="text-lg md:text-xl xl:text-2xl font-semibold ">
                            {item.question}
                        </span>

                        <span
                            className={`transform transition-transform duration-300 ${
                                activeIndex === index ? 'rotate-0' : 'rotate-135'
                            }`}
                        >
                            <svg
                                width="17"
                                height="23"
                                viewBox="0 0 17 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M8.45816 22.6271V12.0205V1.41391M8.45816 1.41391L0.707186 9.16488M8.45816 1.41391L16.2091 9.16488"
                                    stroke="#FAFAFA"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                    </div>

                    <div
                        className={`px-6 pb-4 text-[#9c9c9c] text-base md:text-lg xl:text-xl flex flex-col leading-relaxed transition-all duration-300 ${
                            activeIndex === index
                                ? 'max-h-[500px] opacity-100 flex'
                                : 'max-h-0 opacity-0 hidden'
                        } overflow-hidden`}
                    >
                        <div className="w-full border-t-2 mb-3 h-[1px] border-dashed border-[#9c9c9c]"></div>
                        {item.answer}
                    </div>
                </div>
            ))}
        </>
    );
};

export default FaqAccordion;

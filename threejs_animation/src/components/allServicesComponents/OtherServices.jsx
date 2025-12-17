'use client';

import Link from 'next/link';

const OtherServices = ({ services = [], buttonText = 'Know More', onButtonClick }) => {
    return (
        <div className=" grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {services.map((item, index) => (
                <div key={index} className="relative h-full">
                    <div
                        className="absolute w-full h-full rounded-xl translate-x-3 translate-y-3 pointer-events-none"
                        style={{ border: '2px dashed #A179FF' }}
                    />

                    <div className="relative bg-white p-6 rounded-xl border border-[#0f0f0f] flex flex-col h-full">
                        <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3 uppercase">
                            {item.title}
                        </h3>

                        <p className="text-lg text-[#555555] flex-grow">{item.description}</p>

                        {item.href ? (
                            <Link
                                href={item.href}
                                className=" w-fit mt-12 px-4 py-2 rounded-full bg-[#0f0f0f] text-[#fafafa] cursor "
                            >
                                {buttonText}
                            </Link>
                        ) : (
                            <button
                                onClick={() => onButtonClick?.(item)}
                                className="w-fit mt-12 px-4 py-2 rounded-full bg-[#0f0f0f] text-[#fafafa]"
                            >
                                {buttonText}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OtherServices;

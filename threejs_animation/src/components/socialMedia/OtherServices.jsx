'use client';

const solutionArr = [
    {
        title: 'Search Engine OptimizationS',
        description:
            'We help you climb search results without breaking stride. Smart keywords, clean strategy, and content that pulls you to the top.',
    },
    {
        title: 'Paid Ads / Performance Marketing',
        description:
            'We make algorithms your allies. Every click is tracked, every rupee earns its keep, every ad works harder than the last.',
    },
    {
        title: 'EMail & Whatsapp Marketing',
        description:
            'We write messages people actually want to open. Less spam, more spark, and conversations that feel real.',
    },
];

const OtherServices = () => {
    return (
        <>
            {/* Cards */}
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
                {solutionArr.map((item, index) => (
                    <div key={index} className="relative h-full">
                        {/* Dotted border on right and bottom */}
                        <div
                            className="absolute w-full h-full rounded-xl transform translate-x-3 translate-y-3 pointer-events-none" // Use translate-x/y for the offset
                            style={{
                                border: '2px dashed #A179FF', // Apply dashed border to all sides
                            }}
                        ></div>

                        {/* Main card */}
                        <div className="relative bg-white p-6 rounded-xl border-1 border-[#0f0f0f] hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                            <h3 className="text-lg md:text-2xl  font-semibold mb-3  text-[#0f0f0f] uppercase ">
                                {item.title}
                            </h3>
                            <p className="text-sm md:text-lg text-[#555555] leading-relaxed mb-6 flex-grow">
                                {item.description}
                            </p>
                            <button className="mt-12 px-4 py-2 w-fit text-sm rounded-full bg-[#0f0f0f] text-[#fafafa] ">
                                Know More
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default OtherServices;

export default function StatsSection() {
    const stats = [
        {
            title: 'Fast 01',
            value: "90'",
            desc: 'Plug-and-play installed and running in 90 minutes.',
        },
        { title: 'Fast 02', value: '200', desc: 'preloaded configurations — and counting.' },
        { title: 'Fast 03', value: '95%', desc: 'of common data requests handled out-of-the-box.' },
    ];

    return (
        <section className="bg-black text-white py-24 flex flex-col items-center justify-center text-center">
            {/* Stats Container */}
            <div className="bg-white text-black  shadow-lg p-10 max-w-2xl w-full mx-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="border border-gray-200 rounded-lg p-6 flex flex-col "
                        >
                            <h4 className="w-full text-sm text-left font-semibold mb-2">
                                {stat.title}
                            </h4>
                            <p className="w-full text-left text-5xl font-bold mt-3 mb-1">{stat.value}</p>
                            <p className="w-full text-xs mt-1 text-left text-gray-500">{stat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Subtitle */}
                <h3 className="text-lg md:text-4xl font-medium mb-6">Still can’t believe it?</h3>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                    <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-xs font-thin px-4  py-1 rounded-full transition-all">
                        Live REST Call
                    </button>
                    <button className="border border-gray-700 text-sm px-4 py-1 rounded-full hover:bg-gray-100 transition-all">
                        Check out a config
                    </button>
                </div>
            </div>

            {/* Text below stats */}
            <p className="text-lg md:text-4xl font-light mt-12 mb-6 max-w-4xl">
                Why split your climb with many vendors, when one partner takes you to the top.
            </p>

            {/* Bottom CTA */}
            <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium px-8 py-3 rounded-full transition-all">
                Let’s Connect
            </button>
        </section>
    );
}

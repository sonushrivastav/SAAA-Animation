'use client';

import { Suspense, useEffect, useRef, useState } from 'react';

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

export default function StickyLeftMenu() {
    const sections = [
        { id: 'campaign-setup', label: 'Campaign Setup' },
        { id: 'pain-points', label: 'Pain Points' },
        { id: 'solution', label: 'Solution' },
        { id: 'optimization', label: 'Optimization Strategy' },
        { id: 'results', label: 'Results' },
        { id: 'conclusion', label: 'Conclusion' },
    ];

    const [active, setActive] = useState(sections[0].id);
    const headingsRef = useRef({});

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActive(entry.target.id);
                }
            });
        }, observerOptions);

        const elems = Object.values(headingsRef.current);
        elems.forEach(el => el && observer.observe(el));

        return () => observer.disconnect();
    }, []);

    function handleClick(id) {
        const el = headingsRef.current[id];
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActive(id);
    }

    return (
        <main className="bg-neutral-900  text-neutral-100">
            {/* Hero Video Section */}
            <section className="w-full min-h-screen">
                <Suspense fallback={<p>Loading video...</p>}>
                    <video
                        src="/videos/Big_Buck_Bunny_1080_10s_5MB.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-screen object-cover"
                    ></video>
                </Suspense>
            </section>

            {/* Blog Section with Sticky Menu - REMOVED all sticky classes from parent */}
            <section className="">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 flex  gap-8">
                    {/* LEFT SIDEBAR COLUMN */}
                    <aside className=" relative w-[30%] overflow-visible border border-red-500 p-2">
                        <nav className="sticky  top-10   w-[100%] z-30 border">
                            <div className="pl-6 border-l-2 border-dashed border-neutral-700">
                                <ul className="space-y-6">
                                    {sections.map(s => (
                                        <li key={s.id}>
                                            <button
                                                onClick={() => handleClick(s.id)}
                                                className={`text-left w-full transition-all duration-150 px-4 py-1 rounded-md block hover:text-white focus:outline-none ${
                                                    active === s.id
                                                        ? 'text-white font-semibold'
                                                        : 'text-neutral-400'
                                                }`}
                                            >
                                                {s.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </nav>
                    </aside>

                    {/* RIGHT: Blog content */}
                    <section className="w-[70%] space-y-24">
                        {sections.map((s, idx) => (
                            <article
                                key={s.id}
                                id={s.id}
                                ref={el => (headingsRef.current[s.id] = el)}
                                className="prose prose-invert max-w-none"
                            >
                                <h2 className="text-4xl font-semibold mb-6">{s.label}</h2>

                                <div className="space-y-4 text-neutral-300">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                        Velit, maiores. Reiciendis ea eligendi impedit eveniet,
                                        laborum voluptatem reprehenderit inventore. (This is example
                                        content. Replace with your blog content.)
                                    </p>

                                    <ul className="list-disc ml-6 space-y-2 text-neutral-400">
                                        <li>
                                            Point A — Lorem ipsum dolor sit amet, consectetur
                                            adipisicing elit. Qui, commodi.
                                        </li>
                                        <li>
                                            Point B — Perspiciatis, laboriosam. Distinctio,
                                            explicabo. Use this area to add real content.
                                        </li>
                                        <li>
                                            Point C — You can paste long paragraphs, images, or
                                            whatever you have in your blog.
                                        </li>
                                    </ul>

                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <p key={i}>
                                            Fugiat eaque debitis perspiciatis deserunt?
                                            Reprehenderit, neque porro saepe ipsam voluptatum
                                            aperiam. Vitae laborum officia dolores distinctio nulla.
                                            Praesentium excepturi perferendis excepturi?
                                        </p>
                                    ))}

                                    <div className="h-56 bg-neutral-800 rounded-md flex items-center justify-center text-neutral-500">
                                        Image / Figure placeholder
                                    </div>
                                </div>
                            </article>
                        ))}

                        <div className="h-40" />
                    </section>
                </div>
            </section>

            {/* Case Studies Section */}
            <section className="w-full min-h-screen bg-neutral-100 px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold lg:leading-[60px] text-neutral-900">
                    Case{' '}
                    <span className="bg-purple-600 inline px-2 rounded-md text-white">Studies</span>
                </h2>

                <div className="mt-12 md:mt-14 grid gap-12 md:gap-6 lg:gap-10 md:grid-cols-3">
                    {caseStudies.map((study, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="h-64 bg-neutral-800 flex items-center justify-center text-neutral-400">
                                {study.title}
                            </div>
                            <div className="p-6">
                                <span className="text-sm text-purple-600 font-semibold">
                                    {study.tag}
                                </span>
                                <h3 className="text-xl font-bold mt-2 text-neutral-900">
                                    {study.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full flex items-center justify-center mt-12">
                    <button className="bg-neutral-900 text-white rounded-full px-6 py-2 hover:bg-neutral-800 transition-colors">
                        View More
                    </button>
                </div>
            </section>
        </main>
    );
}

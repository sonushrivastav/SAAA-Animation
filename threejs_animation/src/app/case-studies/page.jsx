'use client';

import { Suspense, useEffect, useState } from 'react';
import CaseStudyCards from '../../components/allServicesComponents/CaseStudyCards';

// --------------------------
// LOCAL STATIC DATA (TEMP)
// --------------------------
const staticData = {
    'Digital Marketing': [
        {
            title: 'Creative Newtech',
            tag: 'SMM',
            img: '/images/socialMedia/CNL.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Ruark Audio',
            tag: 'SMM',
            img: '/images/socialMedia/iPhone 15 Mockup Poster 1.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Share India',
            tag: 'SMM',
            img: '/images/socialMedia/Device 14PM.webp',
            slug: 'Creative Newtech',
        },
    ],
    'Website Development': [
        {
            title: 'Creative Newtech',
            tag: 'SMM',
            img: '/images/socialMedia/CNL.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Ruark Audio',
            tag: 'SMM',
            img: '/images/socialMedia/iPhone 15 Mockup Poster 1.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Share India',
            tag: 'SMM',
            img: '/images/socialMedia/Device 14PM.webp',
            slug: 'Creative Newtech',
        },
    ],
    'UI / UX': [
        {
            title: 'Creative Newtech',
            tag: 'SMM',
            img: '/images/socialMedia/CNL.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Ruark Audio',
            tag: 'SMM',
            img: '/images/socialMedia/iPhone 15 Mockup Poster 1.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Share India',
            tag: 'SMM',
            img: '/images/socialMedia/Device 14PM.webp',
            slug: 'Creative Newtech',
        },
    ],
    'Graphic Design': [
        {
            title: 'Creative Newtech',
            tag: 'SMM',
            img: '/images/socialMedia/CNL.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Ruark Audio',
            tag: 'SMM',
            img: '/images/socialMedia/iPhone 15 Mockup Poster 1.webp',
            slug: 'Creative Newtech',
        },
        {
            title: 'Share India',
            tag: 'SMM',
            img: '/images/socialMedia/Device 14PM.webp',
            slug: 'Creative Newtech',
        },
    ],
};

const tabs = ['Digital Marketing', 'Website Development', 'UI / UX', 'Graphic Design'];

const slugify = title =>
    title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/-+/g, '-'); // remove duplicate hyphens

const CaseStudies = () => {
    const [activeTab, setActiveTab] = useState('Digital Marketing');
    const [caseStudies, setCaseStudies] = useState(staticData[activeTab]);

    // --------------------------
    // ⭐ FUTURE: FETCH FROM STRAPI
    // --------------------------
    /*
    useEffect(() => {
        const fetchCaseStudies = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/case-studies?filters[category][$eq]=${activeTab}&populate=*`);
            const data = await res.json();

            const formatted = data.data.map(item => ({
                title: item.attributes.title,
                tag: item.attributes.tag,
                img: item.attributes.image.data.attributes.url,
                href: `/case-study/${item.id}`,
            }));

            setCaseStudies(formatted);
        };

        fetchCaseStudies();
    }, [activeTab]);
    */

    // When tab changes, update from static data
    useEffect(() => {
        setCaseStudies(staticData[activeTab]);
    }, [activeTab]);

    return (
        <div>
            {/* video */}
            <section className="w-full min-h-screen">
                <Suspense fallback={<p>Loading video...</p>}>
                    <video
                        src="/videos/Big_Buck_Bunny_1080_10s_5MB.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    ></video>
                </Suspense>
            </section>

            {/* Case studies */}
            <section className="w-full bg-[#fafafa] text-[#0f0f0f] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold lg:leading-[60px]">
                    Case{' '}
                    <span className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
                        Studies
                    </span>
                </h2>

                {/* Tabs */}
                <div className="flex flex-row overflow-x-auto overflow-y-auto no-scrollbar gap-4 mt-8 lg:flex-wrap">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 rounded-full border transition whitespace-nowrap ${
                                activeTab === tab
                                    ? 'bg-[#0f0f0f] text-[#fafafa] border-[#EDEDED]'
                                    : 'border-[#555555] text-[#555555] '
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* cards */}
                <div className="mt-12 md:mt-14 grid gap-12 md:gap-6 lg:gap-10 md:grid-cols-3 items-stretch">
                    <CaseStudyCards
                        caseStudies={caseStudies.map(item => ({
                            ...item,
                            href: `case-studies/${slugify(item.slug)}`,
                        }))}
                    />
                </div>
            </section>
        </div>
    );
};

export default CaseStudies;

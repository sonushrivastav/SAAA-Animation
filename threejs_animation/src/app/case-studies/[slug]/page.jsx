'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import CaseStudyCards from '../../../components/allServicesComponents/CaseStudyCards';
import DotGrid from '../../../components/socialMedia/DotGrid';

const caseStudies = [
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
];

const slugify = title =>
    title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/-+/g, '-'); // remove duplicate hyphens

export default function CaseStudyDetails() {
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

    const sidebarRef = useRef(null);
    const footerRef = useRef(null);

    useEffect(() => {
        const sidebar = sidebarRef.current;
        const footer = footerRef.current;
        if (!sidebar || !footer) return;

        let sidebarTop = 0;
        let footerTop = 0;
        let sidebarHeight = 0;
        let maxY = 0;

        const calculate = () => {
            sidebarTop = sidebar.getBoundingClientRect().top + window.scrollY;
            footerTop = footer.getBoundingClientRect().top + window.scrollY;
            sidebarHeight = sidebar.offsetHeight;
            maxY = footerTop - sidebarHeight;
        };

        calculate();

        const onScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > sidebarTop) {
                if (scrollY < maxY) {
                    sidebar.classList.add('sidebar-fixed');
                    sidebar.style.position = '';
                    sidebar.style.top = '';
                } else {
                    sidebar.classList.remove('sidebar-fixed');
                    sidebar.style.position = 'absolute';
                    sidebar.style.top = `${maxY - sidebarTop}px`;
                }
            } else {
                sidebar.classList.remove('sidebar-fixed');
                sidebar.style.position = '';
                sidebar.style.top = '';
            }
        };

        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', calculate);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', calculate);
        };
    }, []);

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
        <main className="">
            {/* Hero Video Section */}
            <section className="relative w-full overflow-hidden bg-[#fafafa] min-h-screen flex items-center justify-center">
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
                            <h1 className="text-5xl lg:text-7xl  text-[#0f0f0f] font-semibold lg:leading-[85px] ">
                                Meta Campaign <br /> for{' '}
                                <span className="bg-[#844de9] inline text-[#fafafa] px-2  rounded-md">
                                    Lugda By DiHi
                                </span>
                            </h1>

                            <p className="text-[#555555] mt-6 max-w-lg mx-auto md:mx-0 md:text-xl">
                                Lugda By DiHi, a sustainable ethnic wear brand, wanted to drive
                                high-quality sales and revenue growth from their Meta Ads campaigns
                                by targeting fashion-forward women across India.
                            </p>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="z-10 flex items-center justify-center self-stretch w-full  md:w-[35%] ">
                        <div className="w-full flex items-center justify-center ">
                            <Image
                                src={'/images/casestudy/lugda.png'}
                                alt={'dummy image'}
                                width={400}
                                height={400}
                                className="object-contain w-full mx-0 md:mx-4"
                            ></Image>
                            {/* <video
                                src="/videos/social-media.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto rounded-2xl "
                            /> */}
                        </div>
                    </div>
                </div>
            </section>

            <section className=" py-10  lg:px-28 md:py-16 lg:py-20 bg-[#0f0f0f]">
                <div className="relative flex flex-col lg:flex-row items-start gap-4   ">
                    {/* LEFT SIDEBAR COLUMN */}
                    <aside className=" relative w-full lg:w-[30%]    pt-2">
                        <nav ref={sidebarRef} className="relative  w-full lg:w-auto z-30  ">
                            <div className="pt-25 lg:py-10  ">
                                <ul className=" lg:space-y-6 overflow-x-auto overflow-y-auto items-stretch  border-t border-b lg:border-t-0 lg:border-b-0  lg:border-l-2 lg:border-dashed border-[#9c9c9c] flex flex-row lg:flex-col no-scrollbar">
                                    {sections.map(s => (
                                        <li
                                            className=" py-3 lg:py-0 flex items-center border-l lg:border-l-0 border-[#9c9c9c] justify-center "
                                            key={s.id}
                                        >
                                            <button
                                                onClick={() => handleClick(s.id)}
                                                className={`text-center lg:text-left text-lg md:text-xl lg:text-xl   w-full transition-all duration-150 px-4 py-1 rounded-md block hover:text-[#fafafa] focus:outline-none whitespace-nowrap  ${
                                                    active === s.id
                                                        ? 'text-[#fafafa] font-[500]'
                                                        : 'text-[#555555]'
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
                    <section className="w-full lg:w-[70%] flex flex-col px-8 md:px-14 lg:px-0">
                        {sections.map((s, idx) => (
                            <article
                                key={s.id}
                                id={s.id}
                                ref={el => (headingsRef.current[s.id] = el)}
                                className="my-6 "
                            >
                                <h2 className="text-2xl md:text-3xl lg:text-4xl text-[#fafafa] font-[500] mb-6">
                                    {s.label}
                                </h2>

                                <div className="space-y-4 text-[#9c9c9c] font-[500] text-lg md:text-xl lg:text-xl">
                                    {s.id === 'campaign-setup' && (
                                        <>
                                            <ul className="list-disc ml-8 space-y-6 text-[#9c9c9c] py-2">
                                                <li>Type Of Campaign - Meta Campaign</li>
                                                <li>Bidding Strategy - Website Purchase</li>
                                                <li>
                                                    Geographical Targeting - India (focus on Tier 1
                                                    & Tier 2 cities with high fashion affinity)
                                                </li>
                                                <li>
                                                    Channel Targeting - Meta Platforms (Facebook &
                                                    Instagram) with emphasis on Catalog Ads,
                                                    Retargeting, and Lookalike Audiences
                                                </li>
                                            </ul>
                                        </>
                                    )}
                                    {s.id === 'pain-points' && (
                                        <>
                                            <ul className="list-disc ml-8 space-y-6 text-[#9c9c9c] py-2">
                                                <li>
                                                    Heavy Ad Spend, Low Returns: Invested over ₹3.28
                                                    Lakhs but generated only ~₹3.02 Lakhs in sales,
                                                    running at a loss.
                                                </li>
                                                <li>
                                                    Unprofitable Campaigns: Average ROAS of just
                                                    0.92 (spending more than earning).
                                                </li>
                                                <li>
                                                    Inefficient Strategy: Too many campaigns without
                                                    a clear structure or optimization, leading to
                                                    scattered performance.
                                                </li>
                                                <li>
                                                    Cash Flow Stress: Continuous losses were eating
                                                    into margins, making the business unsustainable.
                                                </li>
                                                <li>
                                                    Near Business Shutdown: The client was close to
                                                    stopping operations due to lack of profitability
                                                    from ads.
                                                </li>
                                            </ul>
                                        </>
                                    )}

                                    {s.id === 'solution' && (
                                        <>
                                            <ol className="list-decimal ml-8 space-y-6 text-[#9c9c9c] py-2">
                                                <li>
                                                    <p>
                                                        <strong className="text-[#fafafa]">
                                                            SAAA’s Intervention:{' '}
                                                        </strong>
                                                        We restructured the entire advertising
                                                        strategy with a focus on profitability. Our
                                                        approach included:
                                                    </p>

                                                    <ul className="list-disc ml-8 space-y-2 text-[#9c9c9c] py-4">
                                                        <li>
                                                            Streamlined campaign structure for
                                                            efficiency and clarity
                                                        </li>
                                                        <li>
                                                            Advanced retargeting strategies to
                                                            capture high-intent buyers
                                                        </li>
                                                        <li>
                                                            Catalog sales campaigns to scale
                                                            conversions systematically
                                                        </li>
                                                        <li>
                                                            Ongoing optimization for maximum ROAS
                                                            and sustainable growth
                                                        </li>
                                                    </ul>
                                                </li>

                                                <li>
                                                    <p>
                                                        <strong className=" text-[#fafafa]">
                                                            After SAAA:{' '}
                                                        </strong>
                                                        Within just 10 months, the business saw a
                                                        complete turnaround:
                                                    </p>

                                                    <ul className="list-disc ml-8 space-y-2 text-[#9c9c9c] py-4">
                                                        <li>
                                                            Ad spend of ~₹3.61 Lakhs delivered over
                                                            ₹13.3 Lakhs in purchase conversions
                                                        </li>
                                                        <li>
                                                            Average ROAS increased to 3.7–3.8, with
                                                            multiple campaigns achieving 4–5+
                                                        </li>
                                                        <li>
                                                            Marketing became a profit center rather
                                                            than a cost burden
                                                        </li>
                                                        <li>
                                                            The client not only regained stability
                                                            but scaled their business confidently
                                                            with consistent, predictable returns
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ol>
                                        </>
                                    )}

                                    {s.id === 'optimization' && (
                                        <>
                                            <ul className="list-disc ml-8 space-y-6 text-[#9c9c9c] py-2">
                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Ad Targeting Refinement:{' '}
                                                    </strong>
                                                    Initially focused on fashion-forward women
                                                    interested in ethnic and sustainable wear.
                                                    Targeted audiences based on interest in sarees,
                                                    kurta sets, handloom, and eco-friendly fashion
                                                    to ensure ads reached high-intent buyers.
                                                </li>

                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Exclusion of Irrelevant Placements:{' '}
                                                    </strong>
                                                    Continuously monitored ad performance to exclude
                                                    underperforming placements and audience
                                                    segments. This helped minimize wasted spend and
                                                    improved cost efficiency.
                                                </li>

                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Inclusion of Additional Targeting Regions:{' '}
                                                    </strong>
                                                    Leveraged Meta Analytics to identify
                                                    high-performing demographics and expanded
                                                    targeting to Lookalike Audiences of website
                                                    visitors, add-to-cart users, and past
                                                    purchasers.
                                                </li>

                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Increased Budget in High-Performing Cities:{' '}
                                                    </strong>
                                                    Increased budgets in campaigns achieving ROAS
                                                    above 4.0 (such as festive launches and
                                                    catalogue sales) to maximize revenue and
                                                    capitalize on winning strategies.
                                                </li>

                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Performance Monitoring:{' '}
                                                    </strong>
                                                    Regularly reviewed campaign metrics such as
                                                    purchases, ROAS, and cost per purchase to track
                                                    effectiveness across catalog, prospecting, and
                                                    retargeting campaigns.
                                                </li>

                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Budget Reallocation:{' '}
                                                    </strong>
                                                    Shifted budgets toward high-performing campaigns
                                                    (ROAS &gt; 4.0), particularly festive launches
                                                    and catalog ads, while reducing spend on
                                                    underperforming ad sets to ensure maximum
                                                    efficiency.
                                                </li>

                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Ad Creative Adjustments:{' '}
                                                    </strong>
                                                    Continuously tested new creatives, including
                                                    product lifestyle images, festive collection
                                                    highlights, and storytelling videos. Optimized
                                                    ad copy to highlight sustainability and
                                                    exclusivity, resulting in improved engagement
                                                    and higher purchase intent.
                                                </li>

                                                <li>
                                                    <strong className="text-[#fafafa] ">
                                                        Frequency Capping:{' '}
                                                    </strong>
                                                    Applied frequency capping on retargeting
                                                    campaigns to prevent ad fatigue, ensuring the
                                                    audience was engaged without being overwhelmed
                                                    by repeated ads.
                                                </li>
                                            </ul>
                                        </>
                                    )}
                                    {s.id === 'results' && (
                                        <>
                                            <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row items-stretch justify-center py-4">
                                                <div className="relative  w-full lg:w-[35%]">
                                                    <h3 className=" text-lg md:text-xl lg:text-xl font-semibold text-[#fafafa]">
                                                        Before SAAA (Jan–Nov 2024):
                                                    </h3>
                                                    <ul className="list-disc ml-8 space-y-4 text-neutral-400 py-2 font-[500]">
                                                        <li>Total Spend: ₹328,187</li>
                                                        <li>
                                                            Purchases Conversion Value: ~₹302,357
                                                        </li>
                                                        <li>
                                                            Average ROAS: ~0.92 (low efficiency)
                                                        </li>
                                                        <li>Many campaigns but weak returns</li>
                                                    </ul>
                                                </div>
                                                <div className="relative w-full lg:w-[65%] h-[350px] lg:h-auto">
                                                    <Image
                                                        src="/images/casestudy/c3618f8e668fa4e6ed267a3fa3ba7dd89606fcf2.png"
                                                        alt="Reach out"
                                                        fill
                                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row items-stretch justify-center py-4">
                                                <div className="relative  w-full lg:w-[35%]">
                                                    <h3 className=" text-lg md:text-xl lg:text-xl font-semibold text-[#fafafa]">
                                                        After SAAA (Dec 2024 – Sep 2025 with us):
                                                    </h3>
                                                    <ul className="list-disc ml-8 space-y-4 text-neutral-400 py-2 font-[500]">
                                                        <li>Total Spend: ₹3,61,573 + ₹23,630</li>
                                                        <li>
                                                            Purchases Conversion Value: ₹13,37,934 +
                                                            ₹90,584
                                                        </li>
                                                        <li>Average ROAS: 3.7 – 3.8</li>
                                                        <li>
                                                            Multiple campaigns hitting ROAS 4–5+
                                                        </li>
                                                        <li>
                                                            Highly efficient retargeting & catalog
                                                            campaigns
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="relative w-full lg:w-[65%] h-[350px] lg:h-auto border">
                                                    <Image
                                                        src="/images/casestudy/c3618f8e668fa4e6ed267a3fa3ba7dd89606fcf2.png"
                                                        alt="Reach out"
                                                        fill
                                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {s.id === 'conclusion' && (
                                        <>
                                            <ul className="list-disc ml-8 space-y-6 text-[#9c9c9c] py-2">
                                                <li>
                                                    By focusing on fashion-conscious women and
                                                    audiences with a strong interest in ethnic and
                                                    sustainable wear, the campaigns successfully
                                                    attracted a highly relevant audience, leading to
                                                    stronger purchase intent and improved ROAS.
                                                    Optimized campaign distribution involved
                                                    excluding underperforming ad sets and
                                                    reallocating spend towards high-performing
                                                    catalog and festive campaigns.
                                                </li>
                                                <li>
                                                    Regular analysis of performance metrics enabled
                                                    data-driven budget shifts, ensuring maximum
                                                    efficiency by scaling campaigns that
                                                    consistently delivered ROAS above 4.0.
                                                    Additionally, creative testing and ad rotations
                                                    kept the audience engaged while preventing ad
                                                    fatigue, which further strengthened campaign
                                                    performance.
                                                </li>
                                                <li>
                                                    The strategic increase in budgets for festive
                                                    launches, retargeting, and catalog sales
                                                    campaigns, coupled with continuous optimization,
                                                    contributed to achieving over ₹14 lakh in
                                                    revenue at an average ROAS of 3.7+ — well above
                                                    industry benchmarks.
                                                </li>
                                            </ul>
                                        </>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                </div>
            </section>

            {/* Case Studies Section */}
            <section
                ref={footerRef}
                className="w-full min-h-screen bg-[#fafafa] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20 "
            >
                <h2 className="text-3xl md:text-4xl  lg:text-5xl font-semibold  lg:leading-[60px]">
                    Case{' '}
                    <span className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
                        Studies
                    </span>{' '}
                </h2>

                <div className="mt-12 md:mt-14 grid gap-12 md:gap-6 lg:gap-10 md:grid-cols-3 items-stretch">
                    <CaseStudyCards
                        caseStudies={caseStudies.map(item => ({
                            ...item,
                            href: `case-studies/${slugify(item.slug)}`,
                        }))}
                    />
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

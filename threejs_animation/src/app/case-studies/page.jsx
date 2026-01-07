"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import CaseStudyCards from "../../components/allServicesComponents/CaseStudyCards";

// --------------------------
// LOCAL STATIC DATA (TEMP)
// --------------------------
const staticData = {
  "Digital Marketing": [
    {
      title: "Creative Newtech",
      tag: "Social Media Marketing",
      img: "/images/socialMedia/CNL.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Ruark Audio",
      tag: "Social Media Marketing",
      img: "/images/socialMedia/iPhone 15 Mockup Poster 1.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Share India",
      tag: "Social Media Marketing",
      img: "/images/socialMedia/Device 14PM.webp",
      slug: "Creative Newtech",
    },
  ],
  "Website Development": [
    {
      title: "Creative Newtech",
      tag: "Web Development",
      img: "/images/socialMedia/CNL.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Ruark Audio",
      tag: "Web Development",
      img: "/images/socialMedia/iPhone 15 Mockup Poster 1.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Share India",
      tag: "Web Development",
      img: "/images/socialMedia/Device 14PM.webp",
      slug: "Creative Newtech",
    },
  ],
  "UI / UX": [
    {
      title: "Creative Newtech",
      tag: "UI-UX",
      img: "/images/socialMedia/CNL.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Ruark Audio",
      tag: "UI-UX",
      img: "/images/socialMedia/iPhone 15 Mockup Poster 1.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Share India",
      tag: "UI-UX",
      img: "/images/socialMedia/Device 14PM.webp",
      slug: "Creative Newtech",
    },
  ],
  "Graphic Design": [
    {
      title: "Creative Newtech",
      tag: "Graphic Design",
      img: "/images/socialMedia/CNL.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Ruark Audio",
      tag: "Graphic Design",
      img: "/images/socialMedia/iPhone 15 Mockup Poster 1.webp",
      slug: "Creative Newtech",
    },
    {
      title: "Share India",
      tag: "Graphic Design",
      img: "/images/socialMedia/Device 14PM.webp",
      slug: "Creative Newtech",
    },
  ],
};

const tabs = [
  "Social Media Marketing",
  "Website Development",
  "UI / UX",
  "Graphic Design",
];

const CaseStudies = () => {
  const [activeTab, setActiveTab] = useState("Social Media Marketing");
  const [caseStudies, setCaseStudies] = useState([]);
  // console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/case-studies?populate=*`
        );
        const data = await res.json();

        setCaseStudies(data?.data || []);
      } catch (error) {
        console.log("Error fetching case studies:", error);
      }
    };
    fetchCaseStudies();
  }, []);

  console.log(caseStudies,"caseStudies>>>>>>120 line");
  
  const filteredCaseStudies = useMemo(() => {
    return caseStudies.filter((item) => {
      const tags = item?.tags;
      return tags === activeTab;
    });
  }, [caseStudies, activeTab]);

  return (
    <div>
      {/* video */}
      <section className="w-full ">
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
        <h2 className="text-3xl md:text-4xl xl:text-5xl font-semibold lg:leading-[60px]">
          Case{" "}
          <span className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
            Studies
          </span>
        </h2>

        {/* Tabs */}
        <div className="flex flex-row overflow-x-auto overflow-y-auto no-scrollbar gap-4 mt-8 lg:flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full border transition whitespace-nowrap text-base md:text-lg xl:text-xl ${
                activeTab === tab
                  ? "bg-[#0f0f0f] text-[#fafafa] border-[#EDEDED]"
                  : "border-[#555555] text-[#555555] "
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* cards */}
        <div className="mt-12 md:mt-14 grid gap-12 md:gap-6 lg:gap-10 md:grid-cols-3 items-stretch">
          {filteredCaseStudies && filteredCaseStudies.length > 0 ? (
            <>
              <CaseStudyCards caseStudies={filteredCaseStudies} />
            </>
          ) : (
            <>
              <h1>No Case Study Available</h1>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;

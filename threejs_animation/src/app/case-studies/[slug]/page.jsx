"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import CaseStudyCards from "../../../components/allServicesComponents/CaseStudyCards";
import DotGrid from "../../../components/allServicesComponents/DotGrid";
import useDeviceType from "../../../components/hooks/useDeviceType";

// const caseStudies = [
//     {
//         title: 'Creative Newtech',
//         tag: 'SMM',
//         img: '/images/socialMedia/CNL.webp',
//         slug: 'Creative Newtech',
//     },
//     {
//         title: 'Ruark Audio',
//         tag: 'SMM',
//         img: '/images/socialMedia/iPhone 15 Mockup Poster 1.webp',
//         slug: 'Creative Newtech',
//     },
//     {
//         title: 'Share India',
//         tag: 'SMM',
//         img: '/images/socialMedia/Device 14PM.webp',
//         slug: 'Creative Newtech',
//     },
// ];
const MarkdownRenderer = ({ children }) => (
  <ReactMarkdown
    components={{
      h2: ({ children }) => (
        <h2 className="text-2xl md:text-3xl xl:text-4xl text-[#fafafa] font-[500] mb-6">
          {children}
        </h2>
      ),
      p: ({ children }) => (
        <p className="text-[#9c9c9c] text-lg leading-relaxed py-3">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="list-disc ml-8 space-y-4 text-[#9c9c9c] font-[500] py-2 text-lg xl:text-xl ">
          {children}
        </ul>
      ),
      li: ({ children }) => <li className="">{children}</li>,
      strong: ({ children }) => (
        <strong className="text-[#fafafa] font-semibold text-lg md:text-xl xl:text-xl ">
          {children}
        </strong>
      ),
    }}
  >
    {children}
  </ReactMarkdown>
);

const slugify = (title) =>
  title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/-+/g, "-"); // remove duplicate hyphens

export default function CaseStudyDetails() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [filteredCaseStudy, setFilteredCaseStudy] = useState(null);
  const [sections, setSections] = useState([]);
  const [active, setActive] = useState("");

  const { isMobile, isTablet } = useDeviceType();
  const headingsRef = useRef({});
  const { slug } = useParams();

  const sidebarRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
     if (!process.env.NEXT_PUBLIC_API_URL) return;
    const fetchCaseStudies = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/case-studies?` +
            `populate[sections][populate]=*&` +
            `populate[logo][fields][0]=url&populate[logo][fields][1]=alternativeText&` +
            `populate[coverImage][fields][0]=url&populate[coverImage][fields][1]=alternativeText`
        );

        const data = await res.json();

        const selected = data.data.find(
          (item) => `${slugify(item.title)}-${slugify(item.tag)}` === slug
        );

        // const selected = data.data[0];
        setFilteredCaseStudy(selected);

        setCaseStudies(Array.isArray(data.data) ? data.data : []);

        const mapped = selected.sections.map((section) => ({
          id: section.__component.split(".").pop(),
          type: section.__component,
          label: section.title,
          description: section.description || null,
          beforeDescription: section.before_description || null,
          afterDescription: section.after_description || null,
          beforeImage: section.result_before_image || null,
          afterImage: section.result_after_image || null,
        }));

        setSections(mapped);
        setActive(mapped[0]?.id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCaseStudies();
  }, [slug]);

  // Add 'sections' and 'filteredCaseStudy' to dependencies so this reruns when data loads
  useEffect(() => {
    const sidebar = sidebarRef.current;
    const footer = footerRef.current;

    // 1. Guard clause: Don't run logic if data isn't ready or refs are missing
    if (!sidebar || !footer || sections.length === 0) return;

    let initialSidebarTop = 0;
    let sidebarWidth = 0;

    const calculateDimensions = () => {
      // Get the sidebar's parent width to prevent width collapse when fixed
      sidebarWidth = sidebar.parentElement.getBoundingClientRect().width;

      // Calculate the initial top position relative to the document
      // We add scrollY to handle cases where user reloads halfway down the page
      const rect = sidebar.getBoundingClientRect();
      initialSidebarTop = rect.top + window.scrollY;
    };

    const onScroll = () => {
      const scrollY = window.scrollY;

      const footerRect = footer.getBoundingClientRect();
      const footerTopAbsolute = footerRect.top + window.scrollY;
      const sidebarHeight = sidebar.offsetHeight;
      const gap = 40; // Optional buffer from footer

      // The stopping point (footer top - sidebar height)
      const maxScrollY = footerTopAbsolute - sidebarHeight - gap;

      if (scrollY >= initialSidebarTop) {
        // SCENARIO 1: We are scrolling past the start point

        if (scrollY < maxScrollY) {
          // SCENARIO 2: Floating Fixed
          sidebar.style.position = "fixed";
          sidebar.style.top = "0px";
          sidebar.style.width = `${sidebarWidth}px`; // FIX: Force width
          sidebar.classList.add("sidebar-fixed"); // Keeps your background color
        } else {
          // SCENARIO 3: Hit the bottom (Footer) - Lock it absolutely relative to container
          sidebar.style.position = "absolute";
          // We need to position it relative to the parent section, not viewport
          // A rough calculation: stick it to the bottom of the container minus footer offset
          sidebar.style.top = `${maxScrollY - initialSidebarTop}px`;
          sidebar.style.width = `${sidebarWidth}px`;
          sidebar.classList.remove("sidebar-fixed");
        }
      } else {
        // SCENARIO 4: Back at the top
        sidebar.style.position = "";
        sidebar.style.top = "";
        sidebar.style.width = "";
        sidebar.classList.remove("sidebar-fixed");
      }
    };

    // Run initial calculation
    calculateDimensions();

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", calculateDimensions);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", calculateDimensions);
      // Clean up styles on unmount
      if (sidebar) {
        sidebar.style.position = "";
        sidebar.style.width = "";
      }
    };
  }, [sections, filteredCaseStudy]);

  useEffect(() => {
    if (sections.length === 0) return;
    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, observerOptions);

    const elems = Object.values(headingsRef.current);
    elems.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [sections]);

  function handleClick(id) {
    const el = headingsRef.current[id];
    if (!el) return;

    const offset = isMobile ? 140 : 80; // space from the top in pixels
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });

    setActive(id);
  }
  console.log(filteredCaseStudy);

  return (
    <main className="">
      {/* Hero Video Section */}
      <section className="relative w-full overflow-hidden bg-[#fafafa]  flex items-center justify-center">
        <div className="flex flex-col md:flex-row w-full md:h-screen  self-stretch items-center md:justify-between ">
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
          <div className="z-10 relative w-full md:w-[50%] self-stretch flex items-center    text-[#0f0f0f] ">
            <div className="px-8 pt-35 md:pl-14 md:pr-0 lg:pl-28 lg:pr-0 md:py-0 lg:py-0 ">
              <h1 className="text-4xl lg:text-6xl xl:text-7xl  text-[#0f0f0f] font-semibold lg:leading-[85px] ">
                {filteredCaseStudy?.heading} <br /> for{" "}
                <span className="bg-[#844de9] inline text-[#fafafa] px-2  rounded-md">
                  {filteredCaseStudy?.color_heading}
                </span>
              </h1>

              <p className="text-[#555555] mt-6 max-w-lg mx-auto md:mx-0 text-lg md:text-xl xl:text-2xl">
                {filteredCaseStudy?.sub_description}
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="z-10 flex  py-25 md:py-0 items-center justify-center self-stretch w-full  md:w-[50%] px-8   ">
            <div className="w-full  flex items-center justify-center   ">
              <Image
                src={
                  filteredCaseStudy?.logo?.url
                    ? `${process.env.NEXT_PUBLIC_API_URL}${filteredCaseStudy.logo.url}`
                    : "/images/dummy-image.jpg"
                }
                alt="Case Study Logo"
                width={600}
                height={600}
                className="object-contain w-full"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      <section className=" py-10  lg:px-28 md:py-16 lg:py-20 bg-[#0f0f0f]">
        <div className="relative flex flex-col lg:flex-row items-start gap-4   ">
          {/* LEFT SIDEBAR COLUMN */}
          <aside className=" relative w-full lg:w-[30%]    pt-2">
            <nav ref={sidebarRef} className="relative  w-full lg:w-auto z-30  ">
              <div className="pt-20 lg:py-20  ">
                <ul className=" lg:space-y-6 overflow-x-auto overflow-y-auto items-stretch  border-b lg:border-t-0 lg:border-b-0  lg:border-l-2 lg:border-dashed border-[#9c9c9c] flex flex-row lg:flex-col no-scrollbar   ">
                  {sections.map((s) => (
                    <li
                      className=" py-3 lg:py-0 flex items-center border-r-0 lg:border-l-0 border-[#9c9c9c] justify-center "
                      key={s.id}
                    >
                      <button
                        onClick={() => handleClick(s.id)}
                        className={`text-center lg:text-left text-lg md:text-xl xl:text-xl   w-full transition-all duration-150 px-4 py-1 rounded-md block hover:text-[#fafafa] focus:outline-none whitespace-nowrap  ${
                          active === s.id
                            ? "text-[#fafafa] font-[500]"
                            : "text-[#555555]"
                        }`}
                      >
                        {s.label}
                      </button>
                      <div className="lg:hidden h-6 border  border-[#555555]"></div>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          {/* RIGHT: Blog content */}
          <section className="w-full lg:w-[70%] flex flex-col px-8 md:px-14 lg:px-0">
            {sections.map((section) => {
              const isResults = section.type === "case-studies.results";

              const beforeImg = section.beforeImage?.url;
              const afterImg = section.afterImage?.url;
              return (
                <section
                  key={section.id}
                  id={section.id}
                  ref={(el) => (headingsRef.current[section.id] = el)}
                  className="my-6"
                >
                  <h2 className="text-2xl md:text-3xl xl:text-4xl text-[#fafafa] font-[500] mb-6">
                    {section.label}
                  </h2>

                  {/* 🔥 RESULTS LAYOUT */}
                  {isResults ? (
                    <>
                      <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row items-stretch justify-center py-4">
                        <div className="relative  w-full lg:w-[35%]">
                          <MarkdownRenderer>
                            {section.beforeDescription}
                          </MarkdownRenderer>
                        </div>
                        <div className="relative w-full lg:w-[65%] h-[200px] lg:h-auto">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${beforeImg}`}
                            alt="Reach out"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-4 lg:gap-0 lg:flex-row items-stretch justify-center py-4">
                        <div className="relative  w-full lg:w-[35%]">
                          <MarkdownRenderer>
                            {section.afterDescription}
                          </MarkdownRenderer>
                        </div>
                        <div className="relative w-full lg:w-[65%] h-[200px] lg:h-auto ">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${afterImg}`}
                            alt="Reach out"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <MarkdownRenderer>{section.description}</MarkdownRenderer>
                  )}
                </section>
              );
            })}
          </section>
        </div>
      </section>

      {/* Case Studies Section */}
      <section
        ref={footerRef}
        className="w-full  bg-[#fafafa] px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20 "
      >
        <h2 className="text-3xl md:text-4xl  xl:text-5xl font-semibold  lg:leading-[60px]">
          Case{" "}
          <span className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
            Studies
          </span>{" "}
        </h2>

        <div className="mt-12 md:mt-14 grid gap-12 md:gap-6 lg:gap-10 md:grid-cols-3 items-stretch">
          {caseStudies?.length > 0 && (
            <CaseStudyCards caseStudies={caseStudies} />
          )}
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

"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Suspense, useEffect, useRef, useState } from "react";
import DotGrid from "../../components/allServicesComponents/DotGrid";
import OtherServices from "../../components/allServicesComponents/OtherServices";
import useDeviceType from "../../components/hooks/useDeviceType";
import Card from "../../components/servicePage/Card";
import HeroSerivce from "../../components/servicePage/HeroSerivce";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const servicesArray = [
  {
    title: "INVESTOR RELATIONS",
    description:
      "We turn reports into relationships. By shaping data into clear, confident narratives, we help investors see your brand’s true potential. Numbers tell stories too, we just make them easier to believe in.",
    href: "/services/seo",
  },
  {
    title: "FINANCIAL ADVISORY",
    description:
      "We read between the spreadsheets. Our experts turn complex numbers into actionable insights for your brand. Balancing vision with viability, we make sure your next move is a smart one. Every decision is backed by clarity, not guesswork.",
    href: "/services/seo",
  },
  {
    title: "LEGAL & COMPLIANCE",
    description:
      "We take care of the fine print while you focus on the big picture. Reliable, simple, and structured. Protection that moves with your business, not against it. So you can grow freely knowing every box is ticked and every detail secured.",
    href: "/services/seo",
  },
];
const cards = [
  {
    title: "DESIGN",
    description:
      "We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.",
    items: [
      { label: "UI / UX", href: "/ui-ux" },
        { label: "Branding", href: "/branding" },
        { label: "3D Modeling", href: "/3d-modeling" },
        {
          label: "Motion Graphics / Editing",
          href: "/motion-graphics-editing",
        },
        { label: "Print Media", href: "/print-media" },
        {
          label: "Creative Marketing Collaterals",
          href: "/creative-marketing-collaterals",
        },
    ],
    modelUrl: "/models/design.glb",
  },
  {
    title: "BUILD",
    description:
      "Our developers are part artists, part architects. They code, craft, and fine-tune every pixel until your site feels alive. Built to perform beautifully, no matter the screen or scale. ",
    items: [
      { label: "Basic Website", href: "/basic-website" },
        { label: "E-Commerce Website", href: "/ecommerce-website" },
        { label: "Custom CMS", href: "/custom-cms" },
        { label: "Landing Pages", href: "/landing-pages" },
        {
          label: "Web / Mobile Applications",
          href: "/web-mobile-applications",
        },
        {
          label: "AMC",
          href: "/amc",
        },
    ],
    modelUrl: "/models/build.glb",
  },
  {
    title: "GROW",
    description:
      "We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.",
    items: [
      { label: "Social Media Marketing", href: "/socialmedia-marketing" },
        {
          label: "Paid Ads / Performance Marketing",
          href: "/paid-ads-performance-marketing",
        },
        { label: "SEO", href: "/seo" },
        {
          label: "Email & WhatsApp Marketing",
          href: "/email-whatsapp-marketing",
        },
    ],
    modelUrl: "/models/grow.glb",
  },
];
const Service = () => {
  const gradientRef1 = useRef(null);
  const gradientRef2 = useRef(null);
  const dotGridContainerRef = useRef(null);
  const HORIZONTAL_STRETCH = 130; // consistent for full width coverage
  const cardRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { isMobile } = useDeviceType();
  const rootRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    cardRefs.current = cardRefs.current.slice(0, cards.length);

    const ctx = gsap.context(() => {
      const stackOffset = window.innerHeight * 0.03;
      const topDistance = isMobile
        ? window.innerHeight * 0.07
        : -window.innerHeight * 0.05;
      // The first card starts at its final "resting" position
      gsap.set(cardRefs.current[0], {
        y: isMobile ? window.innerHeight * 0.08 : -window.innerHeight * 0.05,
        scale: 1,
        zIndex: 1,
      });

      // The rest of the cards start below the viewport
      cardRefs.current.slice(1).forEach((card, idx) => {
        gsap.set(card, {
          y: window.innerHeight,
          scale: 1,
          zIndex: idx + 2,
        });
      });

      // 2. TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * cards.length + 1}`,
          pin: true,
          scrub: 0.6,
          // onUpdate: self => {
          //     // Determine active index based on scroll progress
          //     const progress = self.progress * (cards.length - 1);
          //     setActiveIndex(Math.round(progress));
          //     console.log('active ', activeIndex);
          // },
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // 3. ANIMATE ONLY CARDS 2 AND 3
      cards.slice(1).forEach((_, i) => {
        const cardIndex = i + 1;
        const cardElement = cardRefs.current[cardIndex];

        tl.to(
          cardElement,
          {
            y: topDistance + stackOffset * cardIndex,
            scale: 1,
            ease: "power2.inOut",
            duration: 1,
          },
          "-=0.2"
        ); // Slight overlap for smoother flow
      });
      tl.to({}, { duration: 0.5 });

      // Extra buffer at the end
    }, rootRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Helper to create gradient with variable curve depth
  const createGradientStyle = (colors, ellipseY) => {
    return `radial-gradient(ellipse ${HORIZONTAL_STRETCH}% ${ellipseY}% at 50% 0%, ${colors.join(
      ", "
    )})`;
  };

  useEffect(() => {
    // ===== First Gradient Animation (existing one) =====
    if (gradientRef1.current) {
      const colors1 = [
        "#0f0f0f 0%",
        "#0f0f0f 30%",
        "#0f0f0f 45%",
        "#22579C 60%",
        "#4A8AE6 70%",
        "#fafafa 95%",
      ];

      gsap.set(gradientRef1.current, {
        background: createGradientStyle(colors1, 10),
      });

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: gradientRef1.current,
          scrub: 0.6,
          start: "top bottom",
          end: "center top",
        },
      });

      tl1
        .to(gradientRef1.current, {
          background: createGradientStyle(colors1, 100),
          ease: "power1.inOut",
        })
        .to(gradientRef1.current, {
          background: createGradientStyle(colors1, 10),
          ease: "power1.inOut",
        });
    }

    // ===== Second Gradient Animation (after OtherSolutions) =====
    if (gradientRef2.current) {
      // Color pattern based on uploaded image (light top → blue mid → dark bottom)
      const colors2 = [
        "rgba(250,250,250,1) 0%",
        "rgba(250,250,250,1) 20%", // starts pure white to match previous background
        "rgba(250,250,250,1) 35%",
        "#DCEBFA  40%", // white top
        "#7fb8f9 50%", // sky blue
        "#0094ff 60%", // bright blue center
        "#003a6e 75%", // deep navy
        "#0f0f0f 100%",
      ];

      gsap.set(gradientRef2.current, {
        background: createGradientStyle(colors2, 10),
      });

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: gradientRef2.current,
          scrub: 0.6,
          start: "top bottom",
          end: "center top",
        },
      });

      tl2
        .to(gradientRef2.current, {
          background: createGradientStyle(colors2, 100),
          ease: "power1.inOut",
        })
        .to(gradientRef2.current, {
          background: createGradientStyle(colors2, 10),
          ease: "power1.inOut",
        });
    }
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* hero section  */}
      <HeroSerivce />

      {/* sticky cards */}
      <div ref={rootRef} className="relative w-full z-20 bg-[#0f0f0f]  ">
        <div
          ref={dotGridContainerRef}
          className="relative h-[100vh]  w-full bg-[#0f0f0f] "
        >
          <div className="absolute inset-0 h-[110vh] w-full z-10 dotgrid-mask">
            <DotGrid
              dotSize={2}
              gap={8}
              baseColor="#555555"
              activeColor="#5227FF"
              proximity={120}
              shockRadius={250}
              shockStrength={5}
              resistance={750}
              returnDuration={1.5}
              className="h-full w-full"
            />
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center  px-8 py-24 md:px-14 lg:px-28 md:py-16 lg:py-10">
            {/* Title / Header */}
            <div ref={titleRef} className="relative z-10 w-full ">
              <h2 className="text-3xl md:text-4xl lg:text-4xl xl:text-5xl text-left font-semibold text-[#fafafa] tracking-tight  md:mb-20 ">
                What we do
              </h2>
            </div>

            {/* The Actual Cards */}
            <div className="relative w-full  flex-1 flex items-stretch justify-center">
              {cards.map((c, i) => (
                <Card
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  title={c.title}
                  description={c.description}
                  items={c.items}
                  modelUrl={c.modelUrl}
                  // isVisible={Math.abs(i - activeIndex) <= 1}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* First Gradient Section */}
      <div
        ref={gradientRef1}
        className="relative w-full h-[65vh] overflow-hidden"
        style={{
          backgroundColor: "#0f0f0f",
          marginTop: "-1px", // Prevents any gap
          zIndex: 1,
        }}
      >
        <div className="absolute inset-0" />
      </div>
      <section className="flex flex-col  bg-[#fafafa]  px-8 py-10 md:px-14 lg:px-28 md:py-16 lg:py-20">
        <h2 className="text-3xl  md:text-4xl xl:text-5xl text-[#0f0f0f]   font-semibold  lg:leading-[60px] ">
          Other Related{" "}
          <span className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
            Services
          </span>
        </h2>
        <div className="mt-10 md:mt-14">
          <OtherServices services={servicesArray} />
        </div>
      </section>
      {/* Second Gradient Section (based on uploaded image colors) */}
      <div
        ref={gradientRef2}
        className="relative w-full h-[80vh] overflow-hidden"
      >
        <div className="absolute inset-0" />
      </div>
      <div className="w-full   self-center bg-[#0f0f0f]">
        <Suspense fallback={<p>Loading video...</p>}>
          <video
            src="/videos/Big_Buck_Bunny_1080_10s_5MB.mp4"
            autoPlay
            preload="none"
            loop
            muted
            playsInline
          ></video>
        </Suspense>
      </div>
    </div>
  );
};

export default Service;

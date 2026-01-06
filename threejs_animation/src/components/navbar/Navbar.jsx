"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Hook: track window width & auto update
function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth });

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

export default function Navbar(props) {
  const {
    logoSrc = "/images/socialMedia/Logo_Icon.svg",
    logoSrc2 = "/images/socialMedia/Main_Logo.svg",
    logoAlt = "Logo",
    cta = { label: "Let’s Connect", href: "/contact" },
  } = props;

  const megaSections = [
    {
      title: "Design",
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
    },
    {
      title: "Build",
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
    },
    {
      title: "Grow",
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
    },
    {
      title: "More",
      items: [
        { label: "Investor Relations", href: "/investor-relations" },
        { label: "Financial Advisory", href: "/financial-advisory" },
        { label: "Legal & Compliance", href: "/legal-compliance" },
      ],
    },
  ];

  const smallMenu = [
    { label: "About us", href: "/about" },
    // { label: 'Contact', href: '/contact' },
    { label: "Our Work", href: "/case-studies" },
    { label: "Our Services", href: "/service" },
  ];

  const [open, setOpen] = useState(false);
  const [showMega, setShowMega] = useState(false);

  const wrapperRef = useRef(null);
  const { width } = useWindowSize();

  // responsive checks based on updated width
  const isMobile = width < 768;
  const isTablet = width < 1024 && width >= 768;

  // WIDTH ANIMATION LOGIC (responsive)
  const computedWidth = isMobile
    ? open
      ? "100%"
      : "90%"
    : isTablet
    ? open
      ? "90%"
      : "70%"
    : open
    ? "96%"
    : "40%";

  // OPEN/CLOSE SEQUENCING
  const handleToggle = () => {
    if (!open) {
      setOpen(true);
      setTimeout(() => setShowMega(true), 250);
    } else {
      setShowMega(false);
      setTimeout(() => setOpen(false), 350);
    }
  };

  // click-outside close
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowMega(false);
        setTimeout(() => setOpen(false), 250);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      className={`w-full fixed left-0 z-99 bg-transparent transition-all duration-300
        ${isMobile && open ? "top-0" : "top-5"}`}
    >
      <header className="z-50 flex justify-center bg-transparent">
        <motion.div
          ref={wrapperRef}
          animate={{ width: computedWidth }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className={` bg-black/80 backdrop-blur-2xl  w-full
                         ${isMobile && open ? "rounded-none" : "rounded-lg "}`}
        >
          <div className="flex flex-row-reverse md:flex-row h-16 items-center justify-between px-4">
            {/* Hamburger */}
            <button
              onClick={handleToggle}
              aria-label="Toggle menu"
              className="flex items-center justify-center p-2 gap-1 text-[#fafafa] hover:bg-[#555555] rounded-md"
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                {/* Top line */}
                <motion.path
                  initial={false}
                  animate={open ? "open" : "closed"}
                  variants={{
                    closed: { d: "M4 8h16" },
                    open: { d: "M6 6l12 12" },
                  }}
                  strokeWidth={2}
                  strokeLinecap="round"
                />

                {/* Bottom line */}
                <motion.path
                  initial={false}
                  animate={open ? "open" : "closed"}
                  variants={{
                    closed: { d: "M4 16h16" },
                    open: { d: "M6 18L18 6" },
                  }}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-base md:text-lg xl:text-xl ">Menu</p>
            </button>

            {/* LOGO */}
            {isMobile ? (
              <>
                <Link
                  href="/animation"
                  onClick={() => {
                    setShowMega(false);
                    setTimeout(() => setOpen(false), 200);
                  }}
                  className="relative flex items-center justify-center gap-2 w-32"
                >
                  <Image
                    src={logoSrc2}
                    alt={logoAlt}
                    width={300}
                    height={300}
                  />
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/animation"
                  onClick={() => {
                    setShowMega(false);
                    setTimeout(() => setOpen(false), 200);
                  }}
                  className="relative flex items-center justify-center gap-2 w-32"
                >
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: open ? 0 : 1 }}
                    transition={{ duration: 0.35 }}
                    className="absolute "
                  >
                    <Image src={logoSrc} alt={logoAlt} width={28} height={28} />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: open ? 1 : 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <Image
                      src={logoSrc2}
                      alt={logoAlt}
                      width={300}
                      height={300}
                    />
                  </motion.div>
                </Link>
              </>
            )}

            {/* CTA */}
            <Link
              href={cta.href}
              className="hidden md:block text-sm font-medium text-[#fafafa] bg-[#844de9] px-4 py-2 rounded-full hover:bg-[#844de9]/80"
            >
              {cta.label}
            </Link>
          </div>

          {/* MEGA MENU */}
          <AnimatePresence>
            {showMega && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: isMobile ? "85vh" : "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="border-t lg:border-t-0 border-white/10  md:px-8 px-4 overflow-y-auto h-[100vh] md:max-h-[90vh]"
              >
                <div className="flex flex-col h-full md:flex-row md:justify-between py-6 gap-8 ">
                  <div className="w-full md:w-[20%] flex flex-col rounded-xl bg-[#55555550] border border-[#555555] px-10  py-2   ">
                    {smallMenu.map((item, index) => (
                      <Link
                        key={item.href}
                        onClick={handleToggle}
                        href={item.href}
                        className={` ${
                          smallMenu.length - 1 === index
                            ? "border-b-0"
                            : "border-b-2"
                        } border-dashed border-[#555555] py-4 `}
                      >
                        <h3 className="text-2xl lg:text-xl xl:text-3xl font-semibold text-[#fafafa] hover-underline-animation ">
                          {item.label}
                        </h3>
                      </Link>
                    ))}
                  </div>
                  {isMobile ? (
                    <>
                      <div className="w-full flex-1 bg-[#55555550] rounded-xl border border-[#555555]  px-10  py-5   ">
                        <div className="relative z-10 flex flex-col gap-5   h-full">
                          <h3
                            className={`text-2xl  font-semibold transition-colors duration-300 text-[#fafafa]`}
                          >
                            Discuss your digital challenges.
                          </h3>

                          <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-6 items-center">
                              <div className="w-20 h-20 rounded-full border-t-2 border-[#fafafa] border-b-2 overflow-hidden">
                                <Image
                                  src={"/images/about/saurav.webp"}
                                  width={200}
                                  height={200}
                                  alt={"Suarav Singh"}
                                  className={`w-full h-full object-cover transition-all duration-300 grayscale`}
                                />
                              </div>

                              <div className="flex flex-row justify-between items-center flex-1">
                                <div className="flex flex-col justify-center">
                                  <h4
                                    className={`text-sm font-semibold transition-colors duration-300 text-[#fafafa]`}
                                  >
                                    Suarav Singh
                                  </h4>
                                  <p className="text-[#9C9C9C] text-sm ">
                                    Co-Head, Digital Marketing / Business
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-end absolute bottom-0 right-0">
                              <a
                                href="tel:+919307374941"
                                className={` text-xs px-3 py-1.5 rounded-md bg-[#555555] text-[#fafafa] border border-[#9c9c9c] `}
                              >
                                {" "}
                                Call us
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full md:w-[80%] grid grid-cols-2 lg:grid-cols-1 rounded-xl border border-[#555555]  px-3 lg:px-10 py-2   ">
                        {megaSections.map((section, index) => (
                          <div
                            key={section.title}
                            className={` ${
                              index === megaSections.length - 1
                                ? "border-b-0"
                                : "border-b-2"
                            }  border-dashed border-[#555555] py-4  pr-2`}
                          >
                            <h3 className="text-2xl lg:text-xl xl:text-3xl font-semibold text-[#555555] ">
                              {section.title}
                            </h3>

                            <ul className="flex flex-col lg:flex-row flex-wrap items-start gap-3 xl:gap-6 pt-1">
                              {section.items.map((item) => (
                                <li
                                  key={item.href}
                                  className="hover-underline-animation"
                                >
                                  <Link
                                    href={item.href}
                                    onClick={handleToggle}
                                    className="text-base lg:text-sm xl:text-base  text-[#fafafa] uppercase "
                                  >
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </header>
    </div>
  );
}

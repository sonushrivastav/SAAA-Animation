"use client";
import DotGrid from "../../components/service/DotGrid";
import Navbar from "../../components/Navbar";
import React, { useEffect, useRef } from "react";
import OtherSolutions from "../../components/service/OtherSolution";
import HeroSerivce from "../../components/service/HeroSerivce";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Service = () => {
  const gradientRef1 = useRef(null);
  const gradientRef2 = useRef(null);
  const HORIZONTAL_STRETCH = 130; // consistent for full width coverage

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
        "#060010 0%",
        "#060010 30%",
        "#060010 45%",
        "#22579C 60%",
        "#4A8AE6 70%",
        "transparent 95%",
      ];

      gsap.set(gradientRef1.current, {
        background: createGradientStyle(colors1, 10),
      });

      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: gradientRef1.current,
          scrub: 1,
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
        "transparent 0%",
        "rgba(255,255,255,1) 20%", // starts pure white to match previous background
        "rgba(255,255,255,0) 35%",
        "#DCEBFA  40%", // white top
        "#7fb8f9 50%", // sky blue
        "#0094ff 60%", // bright blue center
        "#003a6e 75%", // deep navy
        "#000000 100%",
      ];

      gsap.set(gradientRef2.current, {
        background: createGradientStyle(colors2, 10),
      });

      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: gradientRef2.current,
          scrub: 1,
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
  }, []);

  return (
    <>
      <Navbar />

      <HeroSerivce />

      <DotGrid
        dotSize={5}
        gap={10}
        baseColor="#271E37"
        activeColor="#5227FF"
        proximity={100}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
        className="relative h-screen w-full"
      />

      {/* First Gradient Section */}
      <div
        ref={gradientRef1}
        className="relative w-full h-[65vh] overflow-hidden"
      >
        <div className="absolute inset-0" />
      </div>

      <OtherSolutions />

      {/* Second Gradient Section (based on uploaded image colors) */}
      <div
        ref={gradientRef2}
        className="relative w-full h-[80vh] overflow-hidden"
      >
        <div className="absolute inset-0" />
      </div>

      <div className="w-full  h-[500px] self-center bg-black">
        <h1 className="text-7xl text-center text-white">Video</h1>
      </div>
    </>
  );
};

export default Service;

"use client";
import DotGrid from "../../components/service/DotGrid";
import Navbar from "../../components/Navbar";

import React from "react";
import OtherSolutions from "../../components/service/OtherSolution";
import HeroSerivce from "../../components/service/HeroSerivce";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Service = () => {
  const gradientRef = useRef(null);
  const HORIZONTAL_STRETCH = 130; // Constant value for full width coverage

  useEffect(() => {
    if (!gradientRef.current) return;

    // Helper function to create the background string with variable Ellipse Y dimension
    // Y dimension (ellipseY) controls the vertical curve depth/stretch.
    const createGradientStyle = (ellipseY) => {
      // Keep the X dimension at 130% as requested for full width coverage
      return `radial-gradient(ellipse ${HORIZONTAL_STRETCH}% ${ellipseY}% at 50% 0%, #060010 0%, #060010 30%, #060010 45%, #22579C 60%, #4A8AE6 70%, transparent 95%)`;
    };

    // Set the initial state of the element to 10% vertical stretch (flattened curve)
    gsap.set(gradientRef.current, {
      background: createGradientStyle(10),
    });

    // Setup a GSAP Timeline for the multi-step animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gradientRef.current,
        scrub: 1,
        start: "top bottom", // Start when the top of the element hits the bottom of the viewport
        end: "center center", // End when the bottom of the element leaves the top of the viewport
        // markers: true, // Uncomment for debugging
      },
    });

    // Define the animation steps on the timeline
    tl.to(gradientRef.current, {
      // Step 1: Stretch the vertical curve from 10% up to 100% (fully curved)
      background: createGradientStyle(100),
      ease: "power1.inOut",
    }).to(gradientRef.current, {
      // Step 2: Flatten the vertical curve from 100% back down to 10% (flattened)
      background: createGradientStyle(10),
      ease: "power1.inOut",
    });
  }, []);

  return (
    <>
      <Navbar />

      <HeroSerivce />
      <DotGrid
        dotSize={5}
        gap={15}
        baseColor="#271E37"
        activeColor="#5227FF"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
        className="relative h-screen w-full"
      />

      {/* Gradient Transition Section - curved wave shape matching image */}
      <div
        ref={gradientRef}
        className="relative w-full h-[100vh] overflow-hidden bg-white"
      >
        <div className="absolute inset-0" />
      </div>
      <OtherSolutions />
    </>
  );
};

export default Service;

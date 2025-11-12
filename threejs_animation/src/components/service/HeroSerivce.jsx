"use client";
import React, { useEffect, useRef } from "react";

const FloatingSphere = ({ text, className = "", delay = 0 }) => {
  return (
    <div
      className={`absolute animate-float ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: "6s" }}
    >
      <div className="w-28 h-28 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl border border-gray-200">
        <span className="text-gray-800 font-medium text-xs text-center">
          {text}
        </span>
      </div>
    </div>
  );
};
const HeroSerivce = () => {
  const interactiveRef = useRef(null);
  const containerRef = useRef(null);
  const isHovering = useRef(false);

  let curX = 50,
    curY = 70,
    tgtX = 50,
    tgtY = 70;
  let time = 0;

  let blob1X = 45,
    blob1Y = 68;
  let blob2X = 55,
    blob2Y = 72;
  let blob3X = 50,
    blob3Y = 75;

  useEffect(() => {
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const handleMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      isHovering.current = true;
      // normalized coordinates [0..1]
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;

      // map to a constrained band so the blob doesn't leave ellipse area
      // center band ~ [25..75] percent
      const horizontalMin = 5; // 5% padding from edges
      const horizontalMax = 95;
      const verticalMin = 60;
      const verticalMax = 90;
      tgtX = clamp(
        horizontalMin + nx * (horizontalMax - horizontalMin),
        horizontalMin,
        horizontalMax
      );
      tgtY = clamp(
        verticalMin + ny * (verticalMax - verticalMin),
        verticalMin,
        verticalMax
      );
    };

    const handleLeave = () => {
      isHovering.current = false;
      tgtX = 50;
      tgtY = 70;
    };

    let raf = null;

    const loop = () => {
      // idle slowly drifts the target slightly (subtle breathing)
      time += 0.006;
      if (!isHovering.current) {
        // Automatic morphing animation - multiple gradient points moving independently
        // Create organic, fluid movement patterns
        blob1X = 50 + Math.sin(time * 0.5) * 15 + Math.cos(time * 0.3) * 8;
        blob1Y = 70 + Math.cos(time * 0.4) * 10 + Math.sin(time * 0.25) * 5;

        blob2X =
          50 + Math.sin(time * 0.6 + 2) * 18 + Math.cos(time * 0.35) * 10;
        blob2Y = 70 + Math.cos(time * 0.5 + 2) * 12 + Math.sin(time * 0.3) * 6;

        blob3X =
          50 + Math.sin(time * 0.45 + 4) * 12 + Math.cos(time * 0.28) * 9;
        blob3Y =
          70 + Math.cos(time * 0.38 + 4) * 10 + Math.sin(time * 0.32) * 6;

        // Average position for main gradient
        curX += ((blob1X + blob2X + blob3X) / 3 - curX) * 0.08;
        curY += ((blob1Y + blob2Y + blob3Y) / 3 - curY) * 0.08;
      } else {
        // Mouse interaction mode - smooth follow
        curX += (tgtX - curX) * 0.12;
        curY += (tgtY - curY) * 0.12;

        // Secondary blobs also react to mouse but with offset
        blob1X += (tgtX - 8 - blob1X) * 0.08;
        blob1Y += (tgtY - 5 - blob1Y) * 0.06;

        blob2X += (tgtX + 8 - blob2X) * 0.09;
        blob2Y += (tgtY + 5 - blob2Y) * 0.07;

        blob3X += (tgtX - blob3X) * 0.06;
        blob3Y += (tgtY - 3 - blob3Y) * 0.05;
      }

      // Clamp all positions - wider horizontal range for mouse interaction
      const horizMin = isHovering.current ? 0 : 25;
      const horizMax = isHovering.current ? 100 : 75;

      blob1X = clamp(blob1X, horizMin, horizMax);
      blob1Y = clamp(blob1Y, 55, 90);
      blob2X = clamp(blob2X, horizMin, horizMax);
      blob2Y = clamp(blob2Y, 55, 90);
      blob3X = clamp(blob3X, horizMin, horizMax);
      blob3Y = clamp(blob3Y, 55, 90);
      curX = clamp(curX, horizMin, horizMax);
      curY = clamp(curY, 55, 90);

      // Apply positions to CSS variables
      if (interactiveRef.current) {
        interactiveRef.current.style.setProperty("--pos-x", `${curX}%`);
        interactiveRef.current.style.setProperty("--pos-y", `${curY}%`);
        interactiveRef.current.style.setProperty("--blob1-x", `${blob1X}%`);
        interactiveRef.current.style.setProperty("--blob1-y", `${blob1Y}%`);
        interactiveRef.current.style.setProperty("--blob2-x", `${blob2X}%`);
        interactiveRef.current.style.setProperty("--blob2-y", `${blob2Y}%`);
        interactiveRef.current.style.setProperty("--blob3-x", `${blob3X}%`);
        interactiveRef.current.style.setProperty("--blob3-y", `${blob3Y}%`);

        // Dynamic opacity based on distance from center
        const dx = (curX - 50) / 50;
        const dy = (curY - 70) / 50;
        const dist = Math.min(1, Math.sqrt(dx * dx + dy * dy));
        interactiveRef.current.style.setProperty(
          "--blob-opacity",
          `${0.85 - dist * 0.2}`
        );
      }

      raf = requestAnimationFrame(loop);
    };

    const container = containerRef.current;
    window.addEventListener("mousemove", handleMove);
    container?.addEventListener("mouseleave", handleLeave);

    loop();
    return () => {
      window.removeEventListener("mousemove", handleMove);
      container?.removeEventListener("mouseleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center  overflow-hidden"
    >
      {/* <GradientBackground /> */}

      {/* Background gradient transition */}
      <div className="absolute  inset-0 bg-[radial-gradient(150%_90%_at_50%_80%,_rgba(88,28,135,0.9)_0%,_rgba(0,0,0,1)_55%)] " />

      {/* Gooey Gradient Background */}
      <div className="absolute  inset-0 overflow-hidden">
        <svg className="hidden">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="40"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>

        {/* Moving gradient blobs */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            filter: "url(#goo)",
            mixBlendMode: "screen",
          }}
        >
          {/* The interactive blob — uses CSS variables --pos-x and --pos-y */}
          <div
            ref={interactiveRef}
            className="blob-morphing"
            aria-hidden="true"
            style={{
              "--pos-x": "50%",
              "--pos-y": "70%",
              "--blob1-x": "45%",
              "--blob1-y": "68%",
              "--blob2-x": "55%",
              "--blob2-y": "72%",
              "--blob3-x": "50%",
              "--blob3-y": "75%",
              "--blob-opacity": "0.85",
            }}
          />
        </div>
      </div>

      {/* Floating Elements */}
      <FloatingSphere
        text="3D element : #"
        className="top-24 left-[30%]"
        delay={0.2}
      />
      <FloatingSphere
        text="3D element : #"
        className="top-48 right-[18%]"
        delay={0.5}
      />
      <FloatingSphere
        text="3D element : #"
        className="bottom-[25%] left-[20%]"
        delay={0.8}
      />
      <FloatingSphere
        text="3D element : #"
        className="bottom-[19%] right-[24%]"
        delay={1.1}
      />

      {/* Text Content */}
      <div className="relative z-10 text-center text-white px-8 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-semibold leading-relaxed mb-8">
          Every brand deserves more than service providers. You get thinkers,
          creators, and partners who are dedicated to your growth. Each solution
          is shaped around your vision, built for today, and ready for what’s
          next.
        </h2>
      </div>
    </section>
  );
};

export default HeroSerivce;

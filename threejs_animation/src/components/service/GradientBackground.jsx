"use client";

import { useEffect, useRef } from "react";

export default function GooeyGradient() {
  const interactiveRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const blob = interactiveRef.current;
    const container = containerRef.current;

    let curX = 0,
      curY = 0,
      tgtX = 0,
      tgtY = 0;

    // Smooth movement loop
    function animate() {
      curX += (tgtX - curX) / 15;
      curY += (tgtY - curY) / 15;

      blob.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(animate);
    }

    // Mouse move tracking inside container
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      tgtX = e.clientX - rect.left - rect.width / 2;
      tgtY = e.clientY - rect.top - rect.height / 2;
    });

    // Hover distortion effect (entire bg area)
    // container.addEventListener("mouseenter", () => {
    //   blob.style.background =
    //     "radial-gradient(circle at center, rgba(0,0,0,0.9), rgba(0,0,0,0) 60%)";
    //   blob.style.scale = "1.15"; // small squish effect
    // });

    container.addEventListener("mouseleave", () => {
      blob.style.background =
        "radial-gradient(circle at center, rgba(170,120,255,0.8), rgba(170,120,255,0) 55%)";
      blob.style.scale = "1";
      tgtX = tgtY = 0; // smoothly return to center
    });

    animate();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-black"
    >
      {/* Goo Filter */}
      <svg className="absolute opacity-0 pointer-events-none">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  
                      0 1 0 0 0  
                      0 0 1 0 0  
                      0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Main blob container */}
      <div
        className="absolute inset-0"
        style={{ filter: "url(#goo) blur(40px)" }}
      >
        {/* STATIC BLOB 1 */}
        <div className="absolute w-[70%] h-[70%] top-[10%] left-[5%] rounded-full bg-[radial-gradient(circle_at_center,rgba(90,0,255,0.8),rgba(90,0,255,0)_65%)] animate-spin-slow" />

        {/* STATIC BLOB 2 */}
        <div className="absolute w-[80%] h-[80%] top-[20%] left-[20%] rounded-full bg-[radial-gradient(circle_at_center,rgba(132,77,233,0.8),rgba(132,77,233,0)_60%)] animate-move-vertical" />

        {/* STATIC BLOB 3 */}
        <div className="absolute w-[95%] h-[95%] top-[0%] left-[30%] rounded-full bg-[radial-gradient(circle_at_center,rgba(150,50,255,0.8),rgba(150,50,255,0)_60%)] animate-move-horizontal" />

        {/* INTERACTIVE FOLLOWING BLOB */}
        <div
          ref={interactiveRef}
          className="absolute w-[140%] h-[140%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.75]"
          style={{
            background:
              "radial-gradient(circle at center, rgba(170,120,255,0.8), rgba(170,120,255,0) 55%)",
            transition: "background 0.4s ease-out, scale 0.4s ease-out",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

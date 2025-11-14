"use client";

import { useEffect, useRef } from "react";

export default function GooeyGradient() {
  const interactiveRef = useRef(null);

  useEffect(() => {
    const inter = interactiveRef.current;
    let curX = 0,
      curY = 0,
      tgtX = 0,
      tgtY = 0;

    function animate() {
      curX += (tgtX - curX) / 15;
      curY += (tgtY - curY) / 15;

      inter.style.transform = `translate(${curX}px, ${curY}px)`;
      requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", (e) => {
      tgtX = e.clientX;
      tgtY = e.clientY;
    });

    animate();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
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
        {/* STATIC random-moving gradient blobs */}
        <div className="absolute w-[70%] h-[70%] top-[10%] left-[5%] rounded-full bg-[radial-gradient(circle_at_center,rgba(90,0,255,0.8),rgba(90,0,255,0)_65%)] animate-spin-slow" />

        <div className="absolute w-[80%] h-[80%] top-[20%] left-[20%] rounded-full bg-[radial-gradient(circle_at_center,rgba(132,77,233,0.8),rgba(132,77,233,0)_60%)] animate-move-vertical" />

        <div className="absolute w-[95%] h-[95%] top-[0%] left-[30%] rounded-full bg-[radial-gradient(circle_at_center,rgba(150,50,255,0.8),rgba(150,50,255,0)_60%)] animate-move-horizontal" />

        {/* INTERACTIVE blob following mouse */}
        <div
          ref={interactiveRef}
          className="absolute w-[120%] h-[120%] top-[-60%] left-[-60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(170,120,255,0.8),rgba(170,120,255,0)_55%)] opacity-[0.75]"
        />
      </div>
    </div>
  );
}

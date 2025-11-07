"use client";

import { useEffect, useRef } from "react";

const GradientBackground = () => {
  const interBubble = useRef(null);
  let curX = 0,
    curY = 0,
    tgX = 0,
    tgY = 0;

  useEffect(() => {
    const move = () => {
      curX += (tgX - curX) / 20;
      curY += (tgY - curY) / 20;
      if (interBubble.current) {
        interBubble.current.style.transform = `translate(${Math.round(
          curX
        )}px, ${Math.round(curY)}px)`;
      }
      requestAnimationFrame(move);
    };
    window.addEventListener("mousemove", (e) => {
      tgX = e.clientX;
      tgY = e.clientY;
    });
    move();
    return () => window.removeEventListener("mousemove", () => {});
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG Filter */}
      <svg className="hidden">
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
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

      {/* Gradient Layers */}
      <div
        className="absolute inset-0 w-full h-full filter blur-3xl"
        style={{
          background: "linear-gradient(40deg, rgb(108,0,162), rgb(0,17,82))",
        }}
      ></div>

      <div
        className="absolute inset-0 w-full h-full"
        style={{
          filter: "url(#goo) blur(40px)",
          mixBlendMode: "hard-light",
        }}
      >
        {/* Moving blobs */}
        {/* <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(18,113,255,0.8)_0%,rgba(18,113,255,0)_50%)] animate-vertical" /> */}
        {/* <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(221,74,255,0.8)_0%,rgba(221,74,255,0)_50%)] animate-spin-slow" /> */}
        {/* <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(100,220,255,0.8)_0%,rgba(100,220,255,0)_50%)] animate-spin-reverse" /> */}
        {/* <div className="absolute w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(200,50,50,0.8)_0%,rgba(200,50,50,0)_50%)] animate-horizontal" /> */}
        {/* <div className="absolute w-[160%] h-[160%] bg-[radial-gradient(circle_at_center,rgba(180,180,50,0.8)_0%,rgba(180,180,50,0)_50%)] animate-pulse-slow opacity-80" /> */}
        <div
          ref={interBubble}
          className="absolute w-full h-full bg-[radial-gradient(circle_at_center,rgba(140,100,255,0.8)_0%,rgba(140,100,255,0)_50%)] opacity-70"
        />
      </div>
    </div>
  );
};

export default GradientBackground;

import React from "react";
import GradientBackground from "./GradientBackground";

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
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center  overflow-hidden">
      <GradientBackground />
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

      {/* Subtle radial glow */}
      <div className="absolute bottom-0 w-[600px] h-[600px] bg-gradient-radial from-purple-600/40 to-transparent rounded-full blur-[160px]" />
    </section>
  );
};

export default HeroSerivce;

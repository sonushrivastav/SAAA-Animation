"use client";

import { useState } from "react";
import DotGrid from "./DotGrid";

const StatCard = ({
  stat,
  label,
  hasContent,
  roundedClass,
  isMobile = false,
  isTablet = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const showEffects = isHovered || isMobile || isTablet;
  const textHighlightClass = showEffects ? "text-[#fafafa]" : "text-[#9C9C9C]";

    return (
        <div
            className={`relative p-4 md:p-6 lg:p-10 ${roundedClass} bg-[#55555520]   md:bg-transparent transition-colors duration-300 w-full h-[250px] md:h-[300px] lg:h-[400px] ${
                hasContent
                    ? `border-2 md:border ${isHovered ? 'border-[#fafafa]' : 'border-[#555555]'}`
                    : isHovered
                    ? 'border border-[#555555]'
                    : 'border border-[#555555]'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Dot Grid - only show when conditions are met */}
            <div className="absolute inset-0 overflow-hidden">
                {(!hasContent || (hasContent && isHovered) || isMobile) && (
                    <DotGrid
                        dotSize={2}
                        gap={8}
                        baseColor={!hasContent ? '#271e37' : '#271e37'}
                        activeColor={!hasContent ? '#fafafa' : isHovered ? '#844de9' : '#271e37'}
                        proximity={120}
                        shockRadius={250}
                        shockStrength={5}
                        resistance={750}
                        returnDuration={1.5}
                    />
                )}
            </div>

      {/* Content */}
      {hasContent && (
        <div className="relative z-10 flex flex-col justify-end h-full">
          <h2
            className={`text-3xl md:text-4xl xl:text-5xl font-semibold transition-colors duration-300 ${textHighlightClass}`}
          >
            {stat}
          </h2>
          <p
            className={`text-base md:text-lg xl:text-xl mt-2 transition-colors duration-300 ${textHighlightClass}`}
          >
            {label}
          </p>
          <span
            className={`absolute top-[-6px] right-[2px] md:top-[-9px] md:right-[-2px]  lg:top-[-15px] lg:right-[-8px] text-3xl md:text-4xl xl:text-5xl font-semibold transition-colors duration-300 ${textHighlightClass}`}
          >
            #
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;

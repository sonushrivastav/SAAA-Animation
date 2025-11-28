"use client";
import React from "react";

const solutionArr = [
  {
    title: "INVESTOR RELATIONS",
    description:
      "We turn reports into relationships. By shaping data into clear, confident narratives, we help investors see your brand’s true potential. Numbers tell stories too, we just make them easier to believe in.",
  },
  {
    title: "FINANCIAL ADVISORY",
    description:
      "We read between the spreadsheets. Our experts turn complex numbers into actionable insights for your brand. Balancing vision with viability, we make sure your next move is a smart one. Every decision is backed by clarity, not guesswork.",
  },
  {
    title: "LEGAL & COMPLIANCE",
    description:
      "We take care of the fine print while you focus on the big picture. Reliable, simple, and structured. Protection that moves with your business, not against it. So you can grow freely knowing every box is ticked and every detail secured.",
  },
];

const OtherSolutions = () => {
  return (
    <>
      <section className="w-full px-6 md:px-16 py-16 bg-white">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-10">
          Other{" "}
          <span className="bg-[#844DE9] text-white px-3 py-1 rounded-md">
            Solutions
          </span>
        </h2>

        {/* Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {solutionArr.map((item, index) => (
            <div key={index} className="relative h-full">
              {/* Dotted border on right and bottom */}
              <div
                className="absolute w-full h-full rounded-xl transform translate-x-4 translate-y-4 pointer-events-none" // Use translate-x/y for the offset
                style={{
                  border: "2px dashed #A179FF", // Apply dashed border to all sides
                }}
              ></div>

              {/* Main card */}
              <div className="relative bg-white p-6 rounded-xl border-2 border-[#0f0f0f] hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <h3 className="text-[15px] md:text-lg font-semibold mb-3 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm md:text-[15px] text-gray-700 leading-relaxed mb-6 flex-grow">
                  {item.description}
                </p>
                <button className="px-4 py-2 text-sm rounded-full bg-black text-white hover:bg-gray-800 transition-all self-start">
                  Know More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default OtherSolutions;

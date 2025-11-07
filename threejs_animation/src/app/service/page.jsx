import DotGrid from "../../components/service/DotGrid";
import Navbar from "../../components/Navbar";

import React from "react";
import OtherSolutions from "../../components/service/OtherSolution";
import HeroSerivce from "../../components/service/HeroSerivce";

const Service = () => {
  return (
    <>
      <Navbar />
      {/* herosection */}
      {/* <section className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center text-white px-8">
          <h1 className="text-6xl font-bold mb-6">Welcome to Our Services</h1>
          <p className="text-xl text-gray-300">Scroll down to explore</p>
        </div>
      </section> */}
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

      <OtherSolutions />
    </>
  );
};

export default Service;

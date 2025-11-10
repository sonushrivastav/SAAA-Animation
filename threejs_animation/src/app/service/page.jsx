import DotGrid from "../../components/service/DotGrid";
import Navbar from "../../components/Navbar";

import React from "react";
import OtherSolutions from "../../components/service/OtherSolution";
import HeroSerivce from "../../components/service/HeroSerivce";

const Service = () => {
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

      <OtherSolutions />
    </>
  );
};

export default Service;

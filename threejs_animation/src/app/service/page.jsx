import DotGrid from "../../components/service/DotGrid";
import Navbar from "../../components/Navbar";
import ScrollStack, {
  ScrollStackItem,
} from "../../components/service/ScrollStack";
import React from "react";

const Service = () => {
  return (
    <div>
      <Navbar />
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
        <section className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
          <div className="text-center text-white px-8">
            <h1 className="text-6xl font-bold mb-6">Welcome to Our Services</h1>
            <p className="text-xl text-gray-300">Scroll down to explore</p>
          </div>
        </section>
        <DotGrid
          dotSize={7}
          gap={15}
          baseColor="#271E37"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
        <ScrollStack>
          <ScrollStackItem itemClassName="bg-red-400">
            <h2>Card 1</h2>
            <p>This is the first card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="bg-red-400">
            <h2>Card 2</h2>
            <p>This is the second card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem itemClassName="bg-red-400">
            <h2>Card 3</h2>
            <p>This is the third card in the stack</p>
          </ScrollStackItem>
        </ScrollStack>
        {/* Next Section - After ScrollStack Completes */}
        <section className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-purple-900 to-indigo-900">
          <div className="text-center text-white px-8">
            <h1 className="text-6xl font-bold mb-6">Next Section</h1>
            <p className="text-xl text-gray-300">
              The DotGrid and cards have scrolled away
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Service;

// src/app/page.js

"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/Footer";
import dynamic from "next/dynamic";
import Scene from "../components/Scene/Index";
gsap.registerPlugin(ScrollTrigger);

// const Scene = dynamic(() => import("../components/Scene/Index"), {
//   ssr: false,
// });

export default function Home() {
  return (
    <div className="h-screen mt-20 ">
      Home
      <Scene />
    </div>
  );
}

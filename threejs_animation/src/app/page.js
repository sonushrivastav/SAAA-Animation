// src/app/page.js

"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return <div className="h-screen mt-20 bg-[#0d0d0d] text-white">Home</div>;
}

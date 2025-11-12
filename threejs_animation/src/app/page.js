// src/app/page.js

"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
// import ServiceCard from "../components/service/ServiceCard";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  return (
    <div className="h-screen bg-[#0d0d0d] text-white">
      {/* <Navbar /> */}
      {/* <ServiceCard /> */}
      <Footer />
    </div>
  );
}

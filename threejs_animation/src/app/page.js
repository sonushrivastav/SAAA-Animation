// src/app/page.js

'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import SpiralModel from '../components/ThreeScene';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    return (
        <div className="h-[200vh] bg-[#fafafa] text-white">
            <Navbar />
            <SpiralModel />
            <div className="h-[1500vh]"></div>
            <Footer />
        </div>
    );
}

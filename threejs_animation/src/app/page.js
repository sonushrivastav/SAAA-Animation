// src/app/page.js

'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceCard from '../components/service/ServiceCard';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    return (
        <div className="relative h-[100vh] w-full overflow-hidden">
            <ServiceCard />
        </div>
    );
}

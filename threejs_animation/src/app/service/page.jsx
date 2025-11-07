'use client';
import { useRef } from 'react';
import ThreeGlass from '../../components/service/ThreeGlass';
import { useEffect } from 'react';

export default function Service() {
    const bgRef = useRef(null);

    useEffect(() => {
        const bg = bgRef.current;

        // Base center of the gradient
        const baseX = 50;
        const baseY = 60;

        let mouseX = baseX;
        let mouseY = baseY;
        let targetX = baseX;
        let targetY = baseY;

        const animate = () => {
            // Smoothly follow the target
            mouseX += (targetX - mouseX) * 0.07;
            mouseY += (targetY - mouseY) * 0.07;

            // Distance of cursor from center
            const dx = targetX - baseX;
            const dy = targetY - baseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Limit distortion strength
            const distortion = Math.min(dist / 40, 6); // tweakable value

            // Warp the main gradient position based on distance
            const warpedX = baseX + dx * 0.15;
            const warpedY = baseY + dy * 0.15;

            // Slight hue shift based on proximity
            const hueShift = Math.min(dist / 3, 50);

            // Create a smooth morphing gradient
            bg.style.background = `
      radial-gradient(
        circle at ${warpedX}% ${warpedY}%,
        hsl(${270 - hueShift}, 100%, 55%) 0%,
        hsl(${270 - hueShift}, 100%, 30%) 20%,
        rgba(15,15,15,1) 55%
      )
    `;

            requestAnimationFrame(animate);
        };

        const mouseMove = e => {
            const { innerWidth, innerHeight } = window;
            targetX = (e.clientX / innerWidth) * 100;
            targetY = (e.clientY / innerHeight) * 100;
        };

        const mouseLeave = () => {
            targetX = baseX;
            targetY = baseY;
        };

        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseleave', mouseLeave);

        animate();

        return () => {
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseleave', mouseLeave);
        };
    }, []);

    return (
        <section
            ref={bgRef}
            className="relative w-full h-[100vh] bg-[#0f0f0f] text-white flex items-center justify-center text-center px-4 overflow-hidden"
        >
            {/* <LiquidGradient /> */}
            {/* Floating white spheres */}
            <div className="absolute top-10 left-110  w-48 h-48 rounded-full bg-transparent  flex items-center justify-center text-black text-lg font-medium overflow-hidden">
                <ThreeGlass />
            </div>

            <div className="absolute top-[50%] left-60 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                <ThreeGlass />
            </div>

            <div className="absolute top-[65%] right-100 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                <ThreeGlass />
            </div>

            <div className="absolute top-[25%] right-65 w-48 h-48 rounded-full bg-transparent overflow-hidden  flex items-center justify-center text-black text-lg font-medium">
                <ThreeGlass />
            </div>

            {/* Center Content */}
            <div className="max-w-2xl text-xl md:text-4xl font-[600]   text-center">
                <p>
                    Every brand deserves more than service providers. You get thinkers, creators,
                    and partners who are dedicated to your growth. Each solution is shaped around
                    your vision, built for today, and ready for what’s next.
                </p>
            </div>
        </section>
    );
}

'use client';
import Lenis from '@studio-freight/lenis';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';

export default function SmoothScroller() {
    const lenis = useRef(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    console.log(pathname, searchParams);

    // Scroll to top on route change
    useEffect(() => {
        if (lenis.current) {
            lenis.current.scrollTo(0, { immediate: false });
        }
    }, [pathname, searchParams]);

    useLayoutEffect(() => {
        // Create Lenis instance
        lenis.current = new Lenis({
            duration: 1.1,
            easing: t => 1 - Math.pow(1 - t, 5),
            smoothWheel: true,
            smoothTouch: true,
            touchMultiplier: 0.9,
            wheelMultiplier: 0.4,
        });

        let frameId;

        // RAF loop
        const raf = time => {
            lenis.current?.raf(time);
            frameId = requestAnimationFrame(raf);
        };

        frameId = requestAnimationFrame(raf);



        // Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            lenis.current?.destroy();
            lenis.current = null;
        };
    }, []);

    return null;
}

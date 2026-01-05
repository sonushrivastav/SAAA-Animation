import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';
import Card from './Card';

gsap.registerPlugin(ScrollTrigger);

export default function CardStack({ cards }) {
    const containerRef = useRef(null);
    const cardRefs = useRef([]);

    useGSAP(
        () => {
            const cards = cardRefs.current;
            if (!cards.length) return;

            // Initial state
            cards.forEach((el, i) => {
                gsap.set(el, {
                    y: i === 0 ? '0%' : '120%',
                    scale: 1,
                    zIndex: i,
                });
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: `+=${cards.length * 100}%`,
                    scrub: true,
                    pin: true,
                    pinSpacing: true,
                },
            });

            cards.forEach((card, i) => {
                if (i === cards.length - 1) return;

                const previousCards = cards.slice(0, i + 1);
                const nextCard = cards[i + 1];

                // 1️⃣ Next card comes from bottom
                tl.to(
                    nextCard,
                    {
                        y: '0%',
                        ease: 'none',
                        duration: 1,
                    },
                    i
                );

                // 2️⃣ Stack previous cards DOWN slightly
                tl.to(
                    previousCards,
                    {
                        y: index => index * 22,
                        scale: 1,
                        ease: 'none',
                        duration: 1,
                    },
                    i
                );
            });

            // Resize safety
            const observer = new ResizeObserver(() => {
                ScrollTrigger.refresh();
            });

            observer.observe(containerRef.current);

            return () => {
                observer.disconnect();
                tl.kill();
                ScrollTrigger.getAll().forEach(t => t.kill());
            };
        },
        { scope: containerRef }
    );

    return (
        <section ref={containerRef} className="relative h-screen w-full">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-6xl h-[90vh]">
                    {cards.map((card, i) => (
                        <Card key={card.title} ref={el => (cardRefs.current[i] = el)} {...card} />
                    ))}
                </div>
            </div>
        </section>
    );
}

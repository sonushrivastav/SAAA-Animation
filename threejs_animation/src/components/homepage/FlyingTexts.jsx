// 'use client';
// import gsap from 'gsap';
// import { useEffect, useRef } from 'react';

// export default function FlyingTexts() {
//     const texts = [
//         'CONSCIOUSNESS',
//         'DATA STREAM',
//         'ANALYTICS',
//         'INTELLIGENCE',
//         'EVOLUTION',
//         'HUMAN LOOP',
//         'INFINITE DEPTH',
//     ];

//     const containerRef = useRef(null);

//     useEffect(() => {
//         const container = containerRef.current;
//         const durationPerText = 12; // total duration per text (seconds)
//         const overlapTime = 6.5; // when next starts before previous ends

//         const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });

//         texts.forEach((_, i) => {
//             const el = container.children[i];
//             const start = i * (durationPerText - overlapTime);

//             // Animate each text in/out
//             tl.fromTo(
//                 el,
//                 {
//                     opacity: 0,
//                     scale: 0,
//                     z: -800,
//                     filter: 'blur(20px)',
//                 },
//                 {
//                     opacity: 1,
//                     scale: 1,
//                     z: 0,
//                     filter: 'blur(0px)',
//                     duration: durationPerText * 0.7, // approach phase
//                 },
//                 start
//             );

//             tl.to(
//                 el,
//                 {
//                     opacity: 0,
//                     scale: 1.2,
//                     z: 50,
//                     filter: 'blur(25px)',
//                     duration: durationPerText * 0.09, // exit phase
//                 },
//                 start + durationPerText * 0.7 // start exit near end
//             );
//         });
//     }, []);

//     return (
//         <div
//             ref={containerRef}
//             className="fixed inset-0 flex items-center justify-center text-center pointer-events-none"
//             style={{
//                 perspective: '80px',
//                 transformStyle: 'preserve-3d',
//             }}
//         >
//             {[
//                 'CONSCIOUSNESS',
//                 'DATA STREAM',
//                 'ANALYTICS',
//                 'INTELLIGENCE',
//                 'EVOLUTION',
//                 'HUMAN LOOP',
//                 'INFINITE DEPTH',
//             ].map((t, i) => (
//                 <h1
//                     key={i}
//                     className="absolute text-8xl font-bold text-black will-change-transform"
//                     style={{
//                         transform: 'translateZ(-1000px)',
//                         opacity: 0,
//                         filter: 'blur(20px)',
//                     }}
//                 >
//                     {t}
//                 </h1>
//             ))}
//         </div>
//     );
// }

// 'use client';

// import { Canvas } from '@react-three/fiber';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useEffect } from 'react';
// import ParticlesMorphPerSlice from '../components/homepage/ScrollServiceLogo';

// gsap.registerPlugin(ScrollTrigger);

// export default function ServiceLogoScrollTest() {
//     useEffect(() => {
//         const getUniforms = () => window.particleMorphUniforms || [];

//         // kill old triggers on hot reload
//         ScrollTrigger.getAll().forEach(t => t.kill());

//         const tl = gsap.timeline({
//             scrollTrigger: {
//                 trigger: '#scroll-wrapper',
//                 start: 'top top',
//                 end: '+=4000', // SCROLL LENGTH (adjust)
//                 scrub: true,
//                 pin: true,
//                 anticipatePin: 1,
//             },
//         });

//         // --------------------------------
//         // PHASE 0 — Z MOVE
//         // --------------------------------
//         tl.add(() => {
//             getUniforms().forEach(u => {
//                 u.uMode.value = 1; // Z
//                 u.uSpeed.value = 0.6;
//                 u.uMorph.value = 0;
//             });
//         }, 0);

//         tl.to({}, { duration: 1 });

//         // --------------------------------
//         // PHASE 1 — Y MOVE
//         // --------------------------------
//         tl.add(() => {
//             getUniforms().forEach(u => {
//                 u.uMode.value = 1; // Y
//             });
//         });

//         tl.to({}, { duration: 0.8 });

//         // --------------------------------
//         // PHASE 2 — STOP
//         // --------------------------------
//         tl.add(() => {
//             getUniforms().forEach(u => {
//                 u.uMode.value = 2; // stop
//             });
//         });

//         tl.to({}, { duration: 0.5 });

//         // --------------------------------
//         // PHASE 3 — MORPH (SCRUBBED)
//         // --------------------------------
//         const morphState = { value: 0 };

//         tl.to(morphState, {
//             value: 1,
//             duration: 1.5,
//             ease: 'none',
//             onUpdate: () => {
//                 getUniforms().forEach(u => {
//                     u.uMode.value = 3;
//                     u.uMorph.value = morphState.value;
//                 });
//             },
//         });

//         // --------------------------------
//         // PHASE 4 — ACTIVE SLICE LOOP
//         // --------------------------------
//         let activeIndex = 0;

//         tl.add(() => {
//             const interval = setInterval(() => {
//                 const uniforms = getUniforms();
//                 if (!uniforms.length) return;

//                 uniforms.forEach((u, i) => {
//                     gsap.to(u.uActiveMix, {
//                         value: i === activeIndex ? 1 : 0,
//                         duration: 0.6,
//                     });
//                     gsap.to(u.uAlpha, {
//                         value: i === activeIndex ? 1 : 0.15,
//                         duration: 0.6,
//                     });
//                 });

//                 activeIndex = (activeIndex + 1) % uniforms.length;
//             }, 1400);

//             ScrollTrigger.create({
//                 trigger: '#scroll-wrapper',
//                 start: '80% top',
//                 end: 'bottom bottom',
//                 onLeaveBack: () => clearInterval(interval),
//                 onLeave: () => clearInterval(interval),
//             });
//         });

//         return () => {
//             tl.kill();
//             ScrollTrigger.getAll().forEach(t => t.kill());
//         };
//     }, []);

//     return (
//         <div id="scroll-wrapper" className="relative h-[4000px] bg-black">
//             {/* Canvas pinned by ScrollTrigger */}
//             <div className="fixed inset-0">
//                 <Canvas camera={{ position: [0, 0, 50], fov: 45 }}>
//                     <ambientLight intensity={0.8} />
//                     <directionalLight position={[10, 10, 5]} intensity={1.2} />

//                     <ParticlesMorphPerSlice
//                         glbPath="/models/model.glb"
//                         particleCount={12000}
//                         size={14}
//                         initialActiveIndex={0}
//                     />
//                 </Canvas>
//             </div>

//             {/* Debug overlay */}
//             <div className="fixed bottom-4 left-4 text-white text-sm space-y-1 pointer-events-none">
//                 <div>Scroll Phases:</div>
//                 <div>• Z move</div>
//                 <div>• Y move</div>
//                 <div>• Stop</div>
//                 <div>• Morph</div>
//                 <div>• Slice highlight</div>
//             </div>
//         </div>
//     );
// }

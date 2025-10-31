// src/app/page.js

'use client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import WebGPUParticleLogo from '../components/ScrollServiceLogo';
import StatsSection from '../components/Stats';

// Register the GSAP plugin once
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    // const logoGroupRef = useRef();
    // const particlesMaterialRef = useRef();
    // const allMaterialsRef = useRef([]);
    // const flowingParticlesMaterialRef = useRef();

    // const [isSceneReady, setSceneReady] = useState(false);

    // const flowAnimation = useRef({ scrollSpeed: 0 });

    // useEffect(() => {
    //   // 1. Initialize Lenis with your custom configuration
    //   const lenis = new Lenis({
    //     duration: 1.5,
    //     easing: (t) => 1 - Math.pow(1 - t, 3), // cubic ease out
    //     smoothWheel: true,
    //     smoothTouch: false,
    //   });

    //   lenis.on("scroll", ScrollTrigger.update);

    //   let animationFrameId;
    //   function raf(time) {
    //     lenis.raf(time);
    //     animationFrameId = requestAnimationFrame(raf);
    //   }
    //   animationFrameId = requestAnimationFrame(raf);

    //   return () => {
    //     lenis.destroy();
    //     cancelAnimationFrame(animationFrameId);
    //   };
    // }, []);

    // useEffect(() => {
    //   if (
    //     !isSceneReady ||
    //     !logoGroupRef.current ||
    //     !particlesMaterialRef.current ||
    //     !flowingParticlesMaterialRef.current
    //   ) {
    //     return;
    //   }

    //   const tl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: "main",
    //       start: "top top",
    //       end: "bottom bottom",
    //       scrub: 1.5,
    //       onUpdate: (self) => {
    //         gsap.to(flowAnimation.current, {
    //           scrollSpeed: self.getVelocity() * 0.005, // Multiplier to control sensitivity
    //           duration: 0.9,
    //           overwrite: true,
    //         });
    //       },
    //     },
    //   });

    //   // --- All animations are now controlled from here ---

    //   // Animate logo position and rotation
    //   tl.to(
    //     logoGroupRef.current.position,
    //     { x: 0, y: -2, z: 2, duration: 10, ease: "power1.inOut" },
    //     0
    //   );
    //   tl.to(
    //     logoGroupRef.current.rotation,
    //     {
    //       x: 0,
    //       y: 0.6 - Math.PI / 4,
    //       z: 0 - Math.PI / 2,
    //       duration: 10,
    //       ease: "power1.inOut",
    //     },
    //     0
    //   );

    //   // Animate text opacity
    //   tl.to(
    //     ".initial-text",
    //     { opacity: 0, duration: 5, ease: "power1.inOut" },
    //     0
    //   );
    //   tl.to(".second-text", { opacity: 1, duration: 5, ease: "power1.inOut" }, 5);
    //   tl.to(
    //     ".second-text",
    //     { opacity: 0, duration: 5, ease: "power1.inOut" },
    //     ">"
    //   );

    //   // Animate particles and logo fade
    //   tl.to(
    //     particlesMaterialRef.current.uniforms.uVisibility,
    //     { value: 1.0, duration: 2 },
    //     ">-=1"
    //   );
    //   tl.to(
    //     allMaterialsRef.current,
    //     { opacity: 0.0, duration: 1, stagger: 0 },
    //     "<"
    //   );
    //   tl.to(
    //     particlesMaterialRef.current.uniforms.uProgress,
    //     { value: 1.0, duration: 20, ease: "power1.inOut" },
    //     "<"
    //   );
    //   tl.to(
    //     particlesMaterialRef.current.uniforms.uSizeMultiplier,
    //     { value: 0.0, duration: 3, ease: "power2.inOut" },
    //     ">-3"
    //   );

    //   // Define a start time for the final fade-out sequence
    //   const fadeOutStartTime = ">-3"; // 3 seconds before the previous animation ends

    //   // Make the main logo particles shrink and disappear
    //   tl.to(
    //     particlesMaterialRef.current.uniforms.uSizeMultiplier,
    //     { value: 0.0, duration: 3, ease: "power2.inOut" },
    //     fadeOutStartTime
    //   );

    //   // 3. Make the background particles disappear at the same time
    //   tl.to(
    //     flowingParticlesMaterialRef.current.uniforms.uOpacity,
    //     { value: 0.0, duration: 3, ease: "power2.inOut" },
    //     fadeOutStartTime
    //   );

    //   // 4. Animate the new section into view as the particles fade out
    //   tl.to(
    //     ".revealed-content",
    //     { opacity: 1, duration: 3, ease: "power2.inOut" },
    //     ">-1.5"
    //   ); // Starts halfway through the 3s particle fade

    //   // Cleanup function
    //   return () => {
    //     if (tl) tl.kill();
    //     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    //   };
    // }, [isSceneReady]); // Empty dependency array ensures this runs only once on mount

    return (
        <main className="h-[100vh] w-[100vw]">
            {/* <div className="fixed inset-0 w-screen h-screen z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <MainAnimation
            logoGroupRef={logoGroupRef}
            particlesMaterialRef={particlesMaterialRef}
            allMaterialsRef={allMaterialsRef}
            onSceneReady={() => setSceneReady(true)}
          />
          <FlowingParticles flowAnimation={flowAnimation}  materialRef={flowingParticlesMaterialRef}/>
        </Canvas>
      </div> */}

            {/* <Navbar /> */}
            {/* <StarfieldBackground /> */}
            <WebGPUParticleLogo />
            {/* <StatsSection /> */}
            {/* <Footer /> */}

            {/* <FlyingTexts /> */}

            {/* Place your text elements here for GSAP to target them */}
            {/* <div className="fixed inset-0 z-20 p-8 text-black pointer-events-none flex flex-col items-center justify-center">
        <h1 className="initial-text text-6xl">Initial Text</h1>
        <h1 className="second-text text-6xl opacity-0">Second Text Appears</h1>
      </div>
      <div className="fixed inset-0 z-20 flex items-center justify-center opacity-0 revealed-content">
        <h1 className="text-6xl text-black">The Final Revealed Content</h1>
      </div> */}
        </main>
    );
}

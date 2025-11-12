"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import DotGrid from "../../components/socialMedia/DotGrid";
import ContactForm from "../../components/socialMedia/ContactForm";
import OtherServices from "../../components/socialMedia/OtherServices";
gsap.registerPlugin(ScrollTrigger);

const platformImages = [
  "/images/socialMedia/Instagram.svg",
  "/images/socialMedia/LinkedIn.svg",
  "/images/socialMedia/Facebook.svg",
  "/images/socialMedia/twitter.svg",
  "/images/socialMedia/pinterest.svg",
  "/images/socialMedia/tiktok.svg",
];
const caseStudies = [
  {
    title: "Creative Newtech",
    img: "/images/socialMedia/CNL.webp",
  },
  {
    title: "Ruark Audio",
    img: "/images/socialMedia/iPhone 15 Mockup Poster 1.webp",
  },
  {
    title: "Share India",
    img: "/images/socialMedia/Device 14PM.webp",
  },
];

const faqData = [
  {
    question: "What does your SMM service include?",
    answer:
      "We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.",
  },
  {
    question: "Which platforms do you manage?",
    answer:
      "We manage major platforms like Instagram, Facebook, LinkedIn, Twitter, and YouTube to ensure consistent branding and engagement.",
  },
  {
    question: "How do you measure success?",
    answer:
      "We track engagement, conversions, reach, and audience growth metrics to measure and continuously optimize campaign performance.",
  },
  {
    question: "Do you create content too?",
    answer:
      "Yes, our creative team designs captivating posts, videos, and stories aligned with your brand voice and strategy.",
  },
  {
    question: "When will I start seeing results?",
    answer:
      "You’ll typically start seeing meaningful engagement and traction within 4–8 weeks of consistent activity and optimization.",
  },
];

function initSpiralAnimation() {
  const canvas = document.getElementById("spiralCanvas");
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  const container = canvas.parentElement;
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.innerWidth, container.innerHeight);
  });

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 5);
  scene.add(directionalLight);

  new RGBELoader().load("/images/studio_small_03_1k.hdr", (hdrMap) => {
    hdrMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdrMap;
  });

  const spiralConfigs = [
    { s: 5, p: [-1.1, 1.1, 0], r: [Math.PI / 2.12, 0.0, 0.0] },
    { s: 5, p: [-1.4, 0.7, 0], r: [Math.PI / 2.1, 0.4, 0.0] },
    { s: 4.8, p: [-1.5, 0.25, 0], r: [Math.PI / 2.2, 0.8, 0.0] },
    { s: 4.6, p: [-1.4, -0.2, 0], r: [Math.PI / 2.4, 1.2, 0.0] },
    { s: 4.3, p: [-1.1, -0.54, 0], r: [Math.PI / 2.6, 1.65, 0.0] },
    { s: 3.8, p: [-0.75, -0.7, 0], r: [Math.PI / 3, 2.1, 0.0] },
    { s: 3.5, p: [-0.46, -0.8, -0.11], r: [Math.PI / 3, 2.5, 0.0] },
  ];

  const loader = new GLTFLoader();
  let logoGroup = null;
  const individualSpirals = [];
  const animationState = { isInitialState: true };

  loader.load("/models/T3d.glb", (gltf) => {
    const sourceScene = gltf.scene;
    logoGroup = new THREE.Group();
    logoGroup.scale.set(2.5, 2.5, 0.15);
    logoGroup.position.set(-3.9, 0.2, 0);

    const allMaterials = [];

    const startPos = { x: 0.8, y: 1.2, z: 0.11 };
    const startRot = { x: Math.PI / 3, y: 2.5, z: 0.2 };

    spiralConfigs.forEach((config, index) => {
      const spiralGroup = new THREE.Group();

      const modelClone = sourceScene.clone();
      modelClone.scale.setScalar(config.s);
      spiralGroup.add(modelClone);

      // Apply material clone for transparency
      modelClone.traverse((child) => {
        if (child.isMesh && child.material) {
          const newMaterial = child.material.clone();
          newMaterial.transparent = true;
          newMaterial.depthWrite = false;
          child.material = newMaterial;
          allMaterials.push(newMaterial);
        }
      });

      // ✅ Initially stacked (same position/rotation)
      spiralGroup.position.set(startPos.x, startPos.y, startPos.z);
      spiralGroup.rotation.set(startRot.x, startRot.y, startRot.z);

      // ✅ Target (spiral) final transform from spiralConfigs
      individualSpirals.push({
        group: spiralGroup,
        finalPosition: { x: config.p[0], y: config.p[1], z: config.p[2] },
        finalRotation: { x: config.r[0], y: config.r[1], z: config.r[2] },
      });

      logoGroup.add(spiralGroup);
    });

    scene.add(logoGroup);
    logoGroup.rotation.set(0, -Math.PI / 12, -Math.PI / 1.95);

    // ✅ Scroll-triggered GSAP timeline
    const tl = gsap.timeline({
      paused: true, // we'll manually control when it plays
    });

    // Animate stacked spirals outward into spiral positions
    individualSpirals.forEach((spiral, index) => {
      const delay = index * 0.1;

      tl.to(
        spiral.group.position,
        {
          x: spiral.finalPosition.x + 1.25,
          y: spiral.finalPosition.y + 1.4,
          z: spiral.finalPosition.z,
          duration: 1,
          ease: "power2.inOut",
        },
        delay
      );

      tl.to(
        spiral.group.rotation,
        {
          x: spiral.finalRotation.x,
          y: spiral.finalRotation.y,
          z: spiral.finalRotation.z,
          duration: 1,
          ease: "power2.inOut",
        },
        delay
      );
    });
    ScrollTrigger.create({
      trigger: ".scroll-container",
      start: "top 80%",
      once: false, // only trigger once
      onEnter: () => tl.play(), // plays when top hits center
    });
  });

  // Handle resize
  window.addEventListener("resize", () => {
    const container = canvas.parentElement;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Render Loop
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}

const SocialMediaMarketing = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  useEffect(() => {
    initSpiralAnimation();
  }, []);
  return (
    <div>
      <section className="relative w-full overflow-hidden bg-[#FAFAFA] min-h-screen flex items-center justify-center">
        {/* Left Section */}
        <div className="flex flex-col md:flex-row w-full  self-stretch items-center ">
          <div className=" relative w-full md:w-[65%] self-stretch flex items-center    text-[#0f0f0f] ">
            <div className="absolute inset-0 ">
              <DotGrid
                dotSize={2}
                gap={15}
                baseColor="#271e3722"
                activeColor="#844de9"
                proximity={120}
                shockRadius={250}
                shockStrength={5}
                resistance={750}
                returnDuration={1.5}
              />
            </div>
            <div className="px-12 md:px-32 z-10">
              <h1 className="text-4xl md:text-7xl  text-[#0f0f0f] font-semibold md:leading-[75px] ">
                Social{" "}
                <div className="bg-[#844de9] inline text-[#fafafa] px-2 rounded-md">
                  Media
                </div>
                <br />
                Marketing
              </h1>

              <p className="text-[#555555] mt-6 max-w-lg mx-auto md:mx-0 text-base md:text-xl">
                We turn your feed into a fan club. From hashtags that travel to
                posts that trend, we make your brand impossible to ignore. Every
                scroll becomes a moment worth remembering. Because online,
                consistency is the real celebrity
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-center self-stretch  w-[35%] ">
            <div className="w-full flex items-center justify-center border">
              <Image
                src={"/images/socialMedia/image 3.png"}
                alt={"dummy image"}
                width={400}
                height={400}
                className="object-contain mx-4"
              ></Image>
              {/* <video
                                src="/videos/social-media.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto rounded-2xl "
                            /> */}
            </div>
          </div>
        </div>
      </section>

      {/* Key Figures Section */}

      <section className="w-full min-h-screen bg-[#0f0f0f] text-[#fafafa] md:px-32 py-24">
        <h2 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px]">
          Here are some{" "}
          <div className="bg-[#844de9] inline px-2  rounded-md">
            key figures
          </div>{" "}
          that illustrate our growth and commitment to our clients.
        </h2>

        {/* Stats Grid Section */}
        <div className=" relative mt-16  flex flex-col md:flex-row flex-wrap bg-[#1a1a1a] rounded-2xl overflow-hidden border border-[#2a2a2a]">
          {/* Card 1 */}
          <div className="absolute inset-0">
            <DotGrid
              dotSize={2}
              gap={7}
              baseColor="#271e37"
              activeColor="#844de9"
              proximity={120}
              shockRadius={250}
              shockStrength={5}
              resistance={750}
              returnDuration={1.5}
            />
          </div>
          <div className="relative  p-8  md:p-10 rounded-tl-2xl bg-transparent border-[#555555] border w-[33.33%] h-[400px]">
            <div className="relative z-1 flex flex-col justify-end h-full">
              <h2 className="text-5xl md:text-6xl font-bold text-[#fafafa]">
                100+
              </h2>
              <p className="text-sm md:text-base text-[#cccccc] mt-2">
                accounts managed
              </p>
              <span className="absolute top-[-15] right-[-8] text-[#fafafa] text-5xl font-bold">
                #
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="relative bg-transparent border-[#555555] border  p-8  w-[33.33%] h-[400px]">
            <div className="relative z-1 flex flex-col justify-end h-full">
              <h2 className="text-5xl md:text-6xl font-bold text-[#fafafa]">
                1 Cr+
              </h2>
              <p className="text-sm md:text-base text-[#cccccc] mt-2">
                total reach generated
              </p>
              <span className="absolute top-[-15] right-[-8] text-[#fafafa] text-5xl font-bold">
                #
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="relative bg-transparent border-[#555555] border  p-8 md:p-10 rounded-tr-2xl w-[33.33%] h-[400px]"></div>

          {/* Card 4 */}
          <div className="relative bg-transparent border-[#555555] border  p-8 md:p-10 rounded-bl-2xl w-[33.33%] h-[400px]"></div>

          {/* Card 5 */}
          <div className="relative bg-transparent border-[#555555] border  p-8 md:p-10 w-[33.33%] h-[400px]">
            <div className="relative z-1 flex flex-col justify-end h-full">
              <h2 className="text-5xl md:text-6xl font-bold text-[#fafafa]">
                150%
              </h2>
              <p className="text-sm md:text-base text-[#cccccc] mt-2">
                follower growth achieved
              </p>
              <span className="absolute top-[-15] right-[-8] text-[#fafafa] text-5xl font-bold">
                #
              </span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="relative bg-transparent border-[#555555] border  p-8 md:p-10 rounded-br-2xl w-[33.33%] h-[400px]">
            <div className="relative z-1 flex flex-col justify-end h-full">
              <h2 className="text-5xl md:text-6xl font-bold text-[#fafafa]">
                4%
              </h2>
              <p className="text-sm md:text-base text-[#cccccc] mt-2">
                average increase in engagement
              </p>
              <span className="absolute top-[-15] right-[-8] text-[#fafafa] text-5xl font-bold">
                #
              </span>
            </div>
          </div>
        </div>

        {/* Platforms we manage */}

        <div className="mt-16 flex flex-col items-center gap-12">
          <h1 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px] text-center">
            Platforms we manage
          </h1>
          <div className="flex flex-wrap justify-center gap-6">
            {platformImages.map((src, index) => (
              // <div
              //     key={index}
              //     className="w-12 h-12 md:w-20 md:h-20 flex items-center justify-center "
              // >
              <Image
                key={index}
                src={src}
                alt={`Platform ${index + 1}`}
                width={65}
                height={65}
                className="object-contain mx-4"
              />
              // </div>
            ))}
          </div>
        </div>
      </section>

      {/* case stuides */}

      <section className="w-full min-h-screen bg-[#fafafa] md:px-32 py-24 ">
        <h1 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px]">
          Case{" "}
          <div className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
            Studies
          </div>{" "}
        </h1>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {caseStudies.map((item, index) => (
            <div key={index} className="relative ">
              {/* Dotted border on right and bottom */}
              <div
                className="absolute w-full h-full rounded-xl transform translate-x-3 translate-y-3 pointer-events-none" // Use translate-x/y for the offset
                style={{
                  border: "2px dashed #844DE9", // Apply dashed border to all sides
                }}
              ></div>

              {/* Main card */}
              <div className="relative bg-white pt-6 rounded-xl border-1 border-[#0f0f0f]  flex flex-col items-start  justify-between h-full">
                <div className="flex flex-col w-full">
                  <div className="w-full px-6 flex justify-between items-center">
                    <h3 className="text-lg md:text-2xl uppercase font-semibold  text-[#0f0f0f] ">
                      {item.title}
                    </h3>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 17 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.707031 16L8.20703 8.5L15.707 1M15.707 1H4.74549M15.707 1V11.9615"
                        stroke="#0F0F0F"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="px-6 py-2">
                    <button className="px-2 py-1 text-sm rounded-lg bg-[#ededed] text-[#555555]   self-start">
                      SMM
                    </button>
                  </div>
                </div>
                <div className="w-full  flex items-center justify-center  rounded-b-2xl ">
                  <Image
                    src={item.img}
                    alt={"dummy image"}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover rounded-b-2xl "
                  ></Image>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex items-center justify-center mt-12">
          <button className="bg-[#0f0f0f] text-[#fafafa] rounded-full px-6 py-2">
            View More
          </button>
        </div>

        {/* Ready to level */}
        <div className="mt-16 flex flex-col md:flex-row items-center text-[#0f0f0f]  ">
          <div className="flex flex-col w-[40%]">
            <h1 className="text-4xl md:text-5xl   font-semibold  md:leading-[65px]">
              Ready to{" "}
              <div className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
                level
              </div>{" "}
              up?
            </h1>
            <p className="text-[#555555] text-xl w-sm mt-2">
              You’ve got the vision, we’ve got the creative power. Let’s turn
              your brand into something people can’t scroll past
            </p>
            <button className="bg-[#0f0f0f] text-[#fafafa] rounded-full px-6 py-2 w-fit mt-4">
              Schedule A Call
            </button>
          </div>
          <div className="w-[60%] relative flex items-center justify-center  h-[400px] scroll-container">
            <canvas
              // ref={canvasRef}
              id="spiralCanvas"
              className="absolute inset-0 w-full h-full pointer-events-none "
            ></canvas>
          </div>
        </div>
      </section>

      {/* Accordian section */}

      <section className="relative bg-[#0f0f0f] flex min-h-screen md:px-32 py-24">
        <div className="absolute inset-0 z-1">
          <DotGrid
            dotSize={5}
            gap={15}
            baseColor="#271e37"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>

        <div className="z-10 flex flex-col w-full  ">
          <h1 className="text-4xl md:text-5xl text-[#fafafa]   font-semibold  md:leading-[65px] ">
            <div className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
              Questions?
            </div>{" "}
            We're Here To Help
          </h1>
          <div className="mt-16 flex flex-col gap-6">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`border border-[#9C9C9C]  bg-[#55555533] backdrop-blur-xs   rounded-xl overflow-hidden transition-all duration-300
                                `}
                //  ${
                //     activeIndex === index
                //         ? 'shadow-[0_0_10px_rgba(132,77,233,0.9)]'
                //         : ''
                //     }
              >
                <button
                  className="w-full flex justify-between items-center px-6 py-4 text-left text-[#fafafa] text-lg md:text-2xl  focus:outline-none"
                  onClick={() => toggleAccordion(index)}
                >
                  {item.question}
                  <span
                    className={`transform transition-transform duration-300 ${
                      activeIndex === index ? "rotate-0" : "rotate-135"
                    }`}
                  >
                    <svg
                      width="17"
                      height="23"
                      viewBox="0 0 17 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.45816 22.6271V12.0205V1.41391M8.45816 1.41391L0.707186 9.16488M8.45816 1.41391L16.2091 9.16488"
                        stroke="#FAFAFA"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  className={`px-6 pb-4 text-[#9c9c9c]  text-xl flex flex-col leading-relaxed transition-all duration-300 ${
                    activeIndex === index
                      ? "max-h-[500px] opacity-100 flex"
                      : "max-h-0 opacity-0 hidden"
                  } overflow-hidden`}
                >
                  <div className="w-full border-t-2 mb-3 h-[1px] border-dashed border-[#9c9c9c]"></div>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Accordion */}
      </section>

      {/* Other Related */}

      <section className="flex flex-col  bg-[#fafafa]  md:px-32 py-24">
        <h1 className="text-4xl md:text-5xl text-[#0f0f0f]   font-semibold  md:leading-[65px] ">
          Other Related{" "}
          <div className="bg-[#844de9] inline px-2  rounded-md text-[#fafafa]">
            Services
          </div>
        </h1>
        <div className="mt-16">
          <OtherServices />
        </div>
        <div className="mt-17 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl text-[#0f0f0f]   font-semibold  md:leading-[65px] ">
            <div className="bg-[#844de9] inline px-2 rounded-md text-[#fafafa]">
              Reach
            </div>{" "}
            out to us
          </h1>
          <div className="mt-16  w-full flex justify-center">
            <div className="relative flex w-full max-w-3xl  ">
              <div className="absolute inset-0 z-1">
                <DotGrid
                  dotSize={3}
                  gap={15}
                  baseColor="#55555533"
                  activeColor="#844de911"
                  proximity={120}
                  shockRadius={250}
                  shockStrength={5}
                  resistance={750}
                  returnDuration={1.5}
                  className="px-1 py-1"
                />
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SocialMediaMarketing;

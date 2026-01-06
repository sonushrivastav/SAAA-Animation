// "use client";
// import { Canvas } from "@react-three/fiber";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
// import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import FlowingParticles from "../../components/homepage/ParticleBackground";
// import StarfieldBackground from "../../components/homepage/StarfieldBackground";
// import StatsSection from "../../components/homepage/Stats";
// import useDeviceType from "../../components/hooks/useDeviceType";
// // ✅ It's good practice to register the plugin once
// gsap.registerPlugin(ScrollTrigger);

// const Home = () => {
//   const canvasRef = useRef(null);
//   const slicesRef = useRef(null);
//   slicesRef.current = [];
//   let isFloating = true; // floating active when page loads
//   let scrollY = 0;

//   const [activeServiceIndex, setActiveServiceIndex] = useState(0);

//   const flowAnimation = useRef({ scrollSpeed: 0 });
//   const flowingParticlesMaterialRef = useRef();
//   // --- Flying Texts Setup ---
//   const flyingTextRef = useRef(null);
//   const texts = [
//     "You’re visible everywhere, but remembered nowhere?",
//     "Your website and UI/UX look great in reviews, not in results.",
//     "Investors are interested, but not invested?",
//   ];
//   const SERVICE_DATA = [
//     {
//       title: "Branding/ Designing",
//       subtext: "Giving your ideas a form people can see, trust, and remember.",
//       className: "text-yellow-500",
//     },
//     {
//       title: "UI/UX Design",
//       subtext: "Crafted interfaces that feel effortless and intuitive.",
//       className: "text-red-500",
//     },
//     {
//       title: "Web Development",
//       subtext: " Building the home your brand deserves online.",
//       className: "text-yellow-500",
//     },
//     {
//       title: "Digital Marketing",
//       subtext: "Turning campaigns into constellations that people follow.",
//       className: "text-purple-600",
//     },

//     {
//       title: "Investor Relations",
//       subtext: "We help your finances find their true orbit.",
//       className: "text-green-500",
//     },
//     {
//       title: "Financial Advisory",
//       subtext: "Turning your milestones into meaningful narratives.",
//       className: "text-blue-500",
//     },
//     {
//       title: "Legal advice",
//       subtext: " Simplifying what’s binding, strengthening what’s bold.",
//       className: "text-indigo-500",
//     },
//   ];

//   // This function remains unchanged
//   function createCircleTexture() {
//     const size = 128;
//     const canvas = document.createElement("canvas");
//     canvas.width = size;
//     canvas.height = size;
//     const ctx = canvas.getContext("2d");

//     ctx.clearRect(0, 0, size, size);
//     const cx = size / 2;
//     const cy = size / 2;
//     const coreR = Math.floor(size * 0.2);

//     ctx.imageSmoothingEnabled = false;
//     ctx.beginPath();
//     ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
//     ctx.closePath();
//     ctx.fillStyle = "rgba(255,255,255,1)";
//     ctx.fill();

//     const tex = new THREE.CanvasTexture(canvas);
//     tex.minFilter = THREE.LinearFilter;
//     tex.magFilter = THREE.LinearFilter;
//     tex.needsUpdate = true;
//     return tex;
//   }

//   const { isMobile, isTablet, isDesktop } = useDeviceType();

//   useEffect(() => {
//     // responsive checks based on updated width

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 0, 5);

//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       antialias: true,
//       alpha: true,
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     window.addEventListener("resize", () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     });

//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 10, 5);
//     scene.add(directionalLight);

//     new RGBELoader().load("/images/studio_small_03_1k.hdr", (hdrMap) => {
//       hdrMap.mapping = THREE.EquirectangularReflectionMapping;
//       scene.environment = hdrMap;
//     });

//     const loader = new GLTFLoader();
//     let particlesMaterial = null;
//     const logoMaterials = [];
//     const initialSlicePositions = [];
//     const initialSliceRotations = [];

//     const spiralTarget = isMobile
//       ? {
//           //  x for left right , z for up down
//           position: { x: 0.015, y: 0.05, z: -0.29 },
//           rotation: {
//             x: -0.2,
//             y: -1.5,
//             z: 0,
//           },
//           duration: 4,
//         }
//       : isTablet
//       ? {
//           position: { x: 0.18, y: 0.08, z: -0.2 },
//           rotation: {
//             x: -0.16,
//             y: -1.4,
//             z: 0,
//           },
//           duration: 4.5,
//         }
//       : {
//           // Desktop / large screens
//           position: { x: 0.21, y: 0.1, z: -0.22 },
//           rotation: {
//             x: -0.181592653589793,
//             y: -1.53159265358979,
//             z: 0,
//           },
//           duration: 5,
//         };

//     loader.load(
//       "/models/model.glb",
//       (gltf) => {
//         const rawModel = gltf.scene;

//         // const modelGroup = new THREE.Group();
//         scene.add(rawModel);
//         // modelGroup.add(rawModel);

//         if (isMobile) {
//           rawModel.scale.set(14, 14, 6);
//           rawModel.position.set(0.8, -3.3, 0);
//           rawModel.rotation.set(0, 0, 0);
//         } else if (isTablet) {
//           rawModel.scale.set(17, 17, 4);
//           rawModel.position.set(-2.3, -2.4, 0);
//           rawModel.rotation.set(0, 0, 0);
//         } else {
//           // Desktop fallback
//           rawModel.scale.set(17, 17, 4);
//           rawModel.position.set(-2.3, -2.8, 0);
//           rawModel.rotation.set(0, 0, 0);
//         }

//         rawModel.traverse((child) => {
//           if (child.isMesh) {
//             slicesRef.current.push(child);
//             child.material.transparent = true;
//             child.material.depthWrite = false;
//             logoMaterials.push(child.material);
//             initialSlicePositions.push(child.position.clone());
//             initialSliceRotations.push(child.rotation.clone());
//           }
//         });

//         const order = {
//           Curve001: 2,
//           Curve002: 1,
//           Curve_1: 3,
//           Curve003: 4,
//           Curve004: 5,
//           Curve005: 6,
//           Curve006: 7,
//         };

//         slicesRef.current.sort((a, b) => {
//           return order[a.name] - order[b.name];
//         });

//         slicesRef.current.forEach((slice) => {
//           slice.position.set(0, 0, 0);
//           slice.rotation.set(0, 0, 0);
//         });

//         createParticleSystem(rawModel, logoMaterials, scene, camera);
//       },
//       undefined,
//       (error) => {
//         console.error(error);
//       }
//     );

//     function createParticleSystem(rawModel, materials, scene, camera) {
//       const samplingGroup = new THREE.Group();

//       samplingGroup.add(rawModel.clone());

//       samplingGroup.traverse((child) => {
//         if (child.isMesh) {
//           // child.position.set(0.21, 0.1, -0.22);
//           // child.rotation.set(-0.181592653589793, -1.53159265358979, 0);
//           child.position.set(
//             spiralTarget.position.x,
//             spiralTarget.position.y,
//             spiralTarget.position.z
//           );
//           child.rotation.set(
//             spiralTarget.rotation.x,
//             spiralTarget.rotation.y,
//             spiralTarget.rotation.z
//           );
//         }
//       });

//       const geometries = [];
//       samplingGroup.updateWorldMatrix(true, true);
//       samplingGroup.traverse((child) => {
//         if (child.isMesh) {
//           const geometry = child.geometry.clone();
//           geometry.applyMatrix4(child.matrixWorld);
//           geometries.push(geometry);
//         }
//       });

//       if (geometries.length === 0) return;

//       const mergedGeometry = BufferGeometryUtils.mergeGeometries(
//         geometries,
//         false
//       );
//       const mergedMeshForSampling = new THREE.Mesh(mergedGeometry);

//       const sampler = new MeshSurfaceSampler(mergedMeshForSampling).build();
//       const numParticles = 30000;

//       const particlesGeometry = new THREE.BufferGeometry();
//       const positions = new Float32Array(numParticles * 3);
//       const randoms = new Float32Array(numParticles * 3);
//       const sizes = new Float32Array(numParticles);
//       const colors = new Float32Array(numParticles * 3);

//       const colorGradient = [
//         // "#5B2C91", // Deep purple (leftmost)
//         "#7B3DAF", // Purple
//         "#9B54CD", // Medium purple
//         "#B56EE3", // Light purple
//         "#CF89F5", // Lighter purple
//         "#E9A4FF", // Pink-purple (rightmost)
//       ];

//       // Find bounds for normalization
//       let minX = Infinity,
//         maxX = -Infinity;
//       for (let i = 0; i < numParticles; i++) {
//         const newPosition = new THREE.Vector3();
//         sampler.sample(newPosition);
//         positions[i * 3] = newPosition.x;
//         positions[i * 3 + 1] = newPosition.y;
//         positions[i * 3 + 2] = newPosition.z;

//         minX = Math.min(minX, newPosition.x);
//         maxX = Math.max(maxX, newPosition.x);
//       }

//       for (let i = 0; i < numParticles; i++) {
//         const x = positions[i * 3];

//         // Normalize x position to 0-1 range
//         const t = (x - minX) / (maxX - minX);

//         // Map to gradient array index
//         const gradientIndex = t * (colorGradient.length - 1);
//         const lowerIndex = Math.floor(gradientIndex);
//         const upperIndex = Math.ceil(gradientIndex);
//         const localT = gradientIndex - lowerIndex;

//         // Interpolate between two colors
//         const color1 = new THREE.Color(colorGradient[lowerIndex]);
//         const color2 = new THREE.Color(colorGradient[upperIndex]);
//         const finalColor = color1.lerp(color2, localT);

//         colors[i * 3] = finalColor.r;
//         colors[i * 3 + 1] = finalColor.g;
//         colors[i * 3 + 2] = finalColor.b;

//         randoms[i * 3] = 0;
//         randoms[i * 3 + 1] = 0;
//         randoms[i * 3 + 2] = Math.random() * 5.0;

//         sizes[i] = 12 + Math.random() * 94;
//       }

//       particlesGeometry.setAttribute(
//         "position",
//         new THREE.BufferAttribute(positions, 3)
//       );
//       particlesGeometry.setAttribute(
//         "aRandom",
//         new THREE.BufferAttribute(randoms, 3)
//       );
//       particlesGeometry.setAttribute(
//         "aSize",
//         new THREE.BufferAttribute(sizes, 1)
//       );
//       particlesGeometry.setAttribute(
//         "aColor",
//         new THREE.BufferAttribute(colors, 3)
//       );

//       particlesMaterial = createShaderMaterial();
//       const particleSystem = new THREE.Points(
//         particlesGeometry,
//         particlesMaterial
//       );

//       scene.add(particleSystem);
//       if (flowingParticlesMaterialRef.current) {
//         setupScrollAnimation(materials, particlesMaterial, camera);
//       } else {
//         const checkRefInterval = setInterval(() => {
//           if (flowingParticlesMaterialRef.current) {
//             setupScrollAnimation(materials, particlesMaterial, camera);
//             clearInterval(checkRefInterval);
//           }
//         }, 100);
//       }
//     }

//     let particleTexture = createCircleTexture();

//     // createShaderMaterial function remains unchanged
//     function createShaderMaterial() {
//       const vertexShader = `
//                 attribute vec3 aRandom;
//                 attribute float aSize;
//                 attribute vec3 aColor;

//                 uniform float uProgress;
//                 uniform float uTime;

//                 uniform float uSizeMultiplier;

//                 varying float vProgress;
//                 varying vec3 vColor;
//                 varying float vDepth;

//                 void main() {
//                      vProgress = uProgress;
//                      vColor = aColor;

//                     vec3 explodeDir = normalize(vec3(0, (aRandom.y + 2.0) * 0.1, 1.0)) * (aRandom.z * 0.4) * uProgress;
//                     vec3 exploded = position + explodeDir * 2.0 * aRandom.z * uProgress;

//                      // ---------- floating orbit-based motion ----------
//                     float orbitRadius = 0.2 + fract(aRandom.y) * 0.8;
//                     float speed = 0.2 + fract(aRandom.z) * 0.9;

//                       // base exploded position
//                      vec3 finalPosition = exploded;

//                     // circular orbital motion applied during explosion
//                     finalPosition.x += sin(uTime * speed + aRandom.x) * orbitRadius * uProgress;
//                     finalPosition.y += sin(uTime * speed + aRandom.y) * orbitRadius * uProgress;

//                      vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//                      gl_Position = projectionMatrix * mvPosition;

//                      // Pass depth for fadeout calculation
//                     vDepth = mvPosition.z;
//                     vec4 viewPos = modelViewMatrix * vec4(exploded, 1.0);
//                     float dist = abs(viewPos.z);
//                     float baseSize = 1.5;
//                     float towardCamera = step(0.0, -explodeDir.z);
//                     float sizeByDistance = mix(1.0, (1.0 / (dist * 0.35 + 1.0)), towardCamera);
//                     float nearBoost = mix(1.0, 1.8, smoothstep(0.0, 0.0, -viewPos.z));
//                     gl_PointSize = baseSize * sizeByDistance * nearBoost * 100.0 / -viewPos.z * uSizeMultiplier;
//                 }
//             `;
//       const fragmentShader = `
//                 uniform sampler2D uTexture;
//                 uniform float uVisibility;
//                 uniform vec3 uDarkColor;
//                 uniform vec3 uLightColor;
//                 varying float vProgress;
//                 varying vec3 vColor;


//                 void main() {
//                     vec2 centeredCoord = gl_PointCoord - vec2(0.5);
//                     if (length(centeredCoord) > 0.5) discard;
//                     vec4 texColor = texture2D(uTexture, gl_PointCoord);

//                    vec3 targetColor = mix(vColor, mix(uDarkColor, uLightColor, 0.4), smoothstep(0.0, 1.0, vProgress));
//                     vec4 finalColor = vec4(targetColor, 1.0) * texColor;
//                     finalColor.a *= uVisibility;
//                     gl_FragColor = finalColor;
//                 }
//             `;
//       return new THREE.ShaderMaterial({
//         uniforms: {
//           uProgress: { value: 0.0 },
//           uTexture: { value: particleTexture },
//           uVisibility: { value: 0.0 },
//           uTime: { value: 0.0 },
//           // uColor: { value: new THREE.Color("#AB76E2") }, // ✅ added single color uniform

//           uSizeMultiplier: { value: 1.0 },
//           uMouse: { value: new THREE.Vector2(0.0, 0.0) },
//           uDarkColor: { value: new THREE.Color("#12001a") }, // blackish purple
//           uLightColor: { value: new THREE.Color("#a96cff") }, // bright purple
//         },
//         vertexShader,
//         fragmentShader,
//         transparent: true,
//         depthWrite: false,
//       });
//     }
//     const modelScale = { value: 1 };

//     function setupScrollAnimation(materials, particlesMaterial, camera) {
//       // Make sure starfield starts hidden
//       gsap.set(".starfield-layer", { opacity: 0 });
//       gsap.set(".text-wrapper", { opacity: 0, scale: 0.1 });

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: "#scroll-spacer",
//           start: "top top",
//           end: "100% bottom",
//           scrub: 1.8, // smooth scroll-scrub

//           onUpdate: (self) => {
//             gsap.to(flowAnimation.current, {
//               scrollSpeed: self.getVelocity() * 0.005,
//               duration: 0.9,
//               overwrite: true,
//             });
//           },
//         },
//       });

//       // --- STEP 1: Move logo to center ---
//       tl.addLabel("initial");
//       if (isMobile) {
//         tl.to(camera.position, {
//           x: 0,
//           y: 0,
//           z: 8,
//           ease: "power1.inOut",
//           onUpdate: () => camera.updateProjectionMatrix(),
//         });
//       }
//       // Animate each spiral individually to center with rotation
//       slicesRef.current.forEach((slice, index) => {
//         let delay = index * 0.6;
//         // if (index === slicesRef.length - 1) {
//         //     delay = index * 0.02;
//         // }

//         // Move each spiral to center
//         tl.to(
//           slice.position,
//           {
//             ...spiralTarget.position,
//             duration: spiralTarget.duration,
//             ease: "power1.inOut",
//           },
//           delay
//         );

//         tl.to(
//           slice.rotation,
//           {
//             ...spiralTarget.rotation,
//             duration: spiralTarget.duration,
//             ease: "power1.inOut",
//           },
//           delay
//         );
//       });

//       tl.to(
//         ".initial-text",
//         {
//           y: "-10vh",
//           opacity: 0,
//           duration: 3.5,
//           ease: "power1.inOut",
//         },
//         "<-3"
//       );
//       tl.to(
//         ".second-text",
//         {
//           y: "2vh",
//           opacity: 1,
//           duration: 3.5,
//           ease: "power1.inOut",
//         },
//         ">+1"
//       );
//       tl.addLabel("rotation");
//       tl.to(
//         ".second-text",
//         { opacity: 0, duration: 3.5, ease: "power1.inOut" },
//         ">"
//       );

//       // --- STEP 4: Particle explosion ---

//       tl.to(
//         particlesMaterial.uniforms.uVisibility,
//         { value: 1, duration: 4 },
//         ">1"
//       );
//       logoMaterials.forEach((mat) => {
//         tl.to(
//           mat,
//           {
//             opacity: 0,
//             duration: 0.8,
//             ease: "power2.out",
//           },
//           "<"
//         );
//       });

//       // tl.addLabel("particleConversion");
//       tl.to(
//         particlesMaterial.uniforms.uProgress,
//         { value: 1, duration: 10, ease: "power1.inOut" },
//         ">"
//       );

//       tl.to(
//         camera,
//         {
//           fov: 4,
//           duration: 10,
//           ease: "power1.inOut",
//           onUpdate: () => camera.updateProjectionMatrix(),
//         },
//         "<"
//       );
//       // tl.addLabel('beforeParticleFade', '>-5.5');
//       tl.to(
//         particlesMaterial.uniforms.uSizeMultiplier,
//         { value: 0, duration: 0.5, ease: "power2.in" },
//         ">-3"
//       );

//       tl.to(
//         particlesMaterial.uniforms.uVisibility,
//         { value: 0, duration: 0.7, ease: "power2.inOut" },
//         "<"
//       );

//       tl.addLabel("starfieldFadeIn", ">-1");
//       // --- STEP 5: Fade in starfield (always mounted layer, no jump) ---
//       tl.to(
//         ".starfield-layer",
//         {
//           opacity: 1,
//           duration: 3,
//           ease: "power2.inOut",
//         },
//         ">-3.5"
//       );
//       // tl.addLabel('flyingText');

//       // --- STEP 6: Flying text animation (merged) ---

//       const flyingTexts = document.querySelectorAll(".text-wrapper");
//       const textDuration = 8; // seconds each text animates
//       const overlap = 0.3; // 30% overlap

//       flyingTexts.forEach((el, i) => {
//         const startTime = i === 0 ? ">" : `>-=${textDuration * overlap + 0.5}`;

//         const labelName = `flyingText-${i}`;
//         tl.addLabel(labelName, startTime);

//         if (i === flyingTexts.length - 1) {
//           tl.fromTo(
//             el,
//             { opacity: 0, scale: 0.1 },
//             {
//               opacity: 1,
//               scale: 1.1,
//               y: 0,

//               ease: "power2.out",
//               duration: textDuration,
//             },
//             `afterSecondText`
//           );
//           tl.addLabel("thirdTextHold", "+=3");

//           tl.to(
//             el,
//             {
//               y: -300,
//               opacity: 0,
//               scale: 1.1,
//               duration: textDuration,
//               ease: "power2.inOut",
//             },
//             `thirdTextHold`
//           );
//         } else {
//           tl.addLabel(labelName, startTime);
//           tl.fromTo(
//             el,
//             { opacity: 0, scale: 0.1 },
//             {
//               opacity: 0,
//               scale: 1.1,

//               ease: "power2.inOut",
//               duration: textDuration,
//               onUpdate: function () {
//                 const p = this.progress();
//                 const fade = Math.pow(Math.sin(p * Math.PI), 2.2);
//                 gsap.set(el, { opacity: fade });
//               },
//             },
//             labelName
//           );
//         }

//         // 🌌 Change Starfield direction after 2nd flying text
//         if (i === 1) {
//           tl.addLabel("afterSecondText", ">");

//           // index 1 = 2nd text
//           tl.to(
//             window.starfieldUniforms.uDirection.value,
//             {
//               x: 0,
//               y: 1,
//               z: 0,
//               duration: 2,
//               ease: "power2.inOut",
//             },
//             `>-${textDuration * 0.33}`
//           );
//         }
//         // ✅ After final flying text disappears → start starfield morph
//       });

//       const starfieldMorphState = { value: 0 };

//       tl.to(
//         starfieldMorphState,
//         {
//           value: 1,
//           duration: 12,
//           ease: "power2.inOut",
//           onUpdate: () => {
//             if (window.starfieldMorphUniform) {
//               window.starfieldMorphUniform.value = starfieldMorphState.value;
//             }
//           },
//           onReverseUpdate: () => {
//             if (window.starfieldMorphUniform) {
//               window.starfieldMorphUniform.value = starfieldMorphState.value;
//             }
//           },
//         },
//         "<"
//       );

//       // --- STEP 7: Logo + service text synchronized animation ---

//       const serviceCount = SERVICE_DATA.length;
//       const TRANSITION_DURATION = 2.5;

//       // reset all texts and logo
//       gsap.set(".service-text", { opacity: 0 });

//       // start from the LAST one
//       setActiveServiceIndex(0);

//       tl.fromTo(
//         `.service-0`,
//         {
//           opacity: 0,
//           y: -100,
//           filter: "blur(12px)",
//         },
//         {
//           opacity: 1,
//           y: 0,
//           filter: "blur(0px)",
//           duration: 1.4,
//           ease: "power3.out",
//           ease: "power1.inOut",
//           onStart: () => setActiveServiceIndex(0),
//         },
//         ">-1"
//       );

//       // loop backwards
//       for (let i = 1; i < serviceCount; i++) {
//         const label = `service-${i}`;
//         tl.addLabel(label, `>+1.2`);

//         // fade out next (previous in index)
//         tl.to(
//           `.service-${i - 1}`,
//           {
//             opacity: 0,
//             y: -100,
//             filter: "blur(10px)",
//             duration: 1.2,
//             ease: "power2.inOut",
//           },
//           `>+${TRANSITION_DURATION * 0.8}`
//         );

//         // fade in previous (lower index)
//         tl.fromTo(
//           `.service-${i}`,
//           {
//             opacity: 0,
//             y: -100,
//             filter: "blur(12px)",
//           },
//           {
//             opacity: 1,
//             y: 0,
//             filter: "blur(0px)",
//             duration: 1.4,
//             ease: "power3.out",
//             onStart: () => setActiveServiceIndex(i),
//             onReverseComplete: () => {
//               requestAnimationFrame(() => {
//                 setActiveServiceIndex(i - 1 >= 0 ? i - 1 : 0);
//               });
//             },
//           },
//           "<"
//         );
//       }

//       // Cleanup when scrolling past the first service
//       tl.to(
//         {},
//         {
//           duration: 0.1,
//           onComplete: () => {
//             setActiveServiceIndex(serviceCount - 1);
//           },
//           onReverseComplete: () => {
//             // setActiveServiceIndex(0);
//           },
//         },
//         "serviceEnd"
//       );

//       // Slight upward movement for smooth exit

//       gsap.set(".statSection", { pointerEvents: "auto" });

//       gsap
//         .timeline({
//           scrollTrigger: {
//             trigger: ".statSection",
//             start: "top bottom", // when statSection enters viewport
//             end: "top top", // until statSection hits top
//             scrub: 1.2,
//           },
//         })
//         .to(
//           ".statSection",
//           {
//             opacity: 1,
//             ease: "none",
//           },
//           0
//         )
//         .to(
//           ".next-section",
//           {
//             // y: '-30vh', // slow parallax movement
//             opacity: 0,
//             ease: "none",
//           },
//           0
//         );

//       // after ALL tl.to() lines
//       // ----------------------------------------------------
//       ScrollTrigger.refresh(); // keep this here
//     }

//     let mouseX = 0;
//     let mouseY = 0;
//     const handleMouseMove = (event) => {
//       mouseX = (event.clientX / window.innerWidth) * 2 - 1;
//       mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
//     };
//     window.addEventListener("mousemove", handleMouseMove);

//     // --- FLOAT CONTROL BASED ON SCROLL ---
//     window.addEventListener("scroll", () => {
//       scrollY = window.scrollY;

//       if (scrollY > 5 && isFloating) {
//         // Stop floating
//         isFloating = false;
//       }

//       if (scrollY <= 5 && !isFloating) {
//         // Restart floating when user returns to top
//         isFloating = true;

//         // Reset reference time so animation continues smoothly
//         let baseTime = performance.now() * 0.001;
//       }
//     });
//     function applyFloating(time) {
//       if (slicesRef.current.length === 0) return;
//       if (initialSlicePositions.length !== slicesRef.current.length) return;

//       slicesRef.current.forEach((slice, i) => {
//         const basePos = initialSlicePositions[i];
//         const baseRot = initialSliceRotations[i];

//         if (!basePos || !baseRot) return;

//         const offset = 0.5;
//         const speed = 0.9 + i * 0.1;

//         slice.position.x = basePos.x + Math.sin(time * speed + offset) * 0.0035;
//         slice.position.y = basePos.y + Math.cos(time * speed + offset) * 0.0035;
//         slice.position.z = basePos.z + Math.sin(time * 0.5 + offset) * 0.003;

//         slice.rotation.x =
//           baseRot.x + Math.sin(time * speed * 0.3 + offset) * 0.008;
//         slice.rotation.y =
//           baseRot.y + Math.cos(time * speed * 0.25 + offset) * 0.008;
//       });
//     }

//     function animate() {
//       const time = performance.now() * 0.001;

//       if (particlesMaterial) {
//         particlesMaterial.uniforms.uTime.value = time;
//       }

//       if (
//         isFloating &&
//         slicesRef.current.length > 0 &&
//         initialSlicePositions.length === slicesRef.current.length
//       ) {
//         applyFloating(time);
//       }

//       // camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
//       // camera.position.y += (mouseY * 5 - camera.position.y) * 0.02;
//       renderer.render(scene, camera);
//     }
//     renderer.setAnimationLoop(animate);

//     // Cleanup function
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       // Dispose of Three.js resources if component unmounts
//     };
//   }, [isMobile, isTablet]);

//   return (
//     <main className="  bg-[#fafafa] font-sans text-black">
//       <div
//         id="scroll-spacer"
//         className="w-full scroll-spacer h-[1050vh] bg-[#0f0f0f]"
//       />
//       <div className="w-full h-full relative">
//         <div className="initial-animation fixed inset-0 z-[10] pointer-events-none bg-[#fafafa]">
//           {/* <ParticlesBg /> */}
//           <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
//             <FlowingParticles
//               flowAnimation={flowAnimation}
//               materialRef={flowingParticlesMaterialRef}
//             />
//           </Canvas>
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 h-full w-full  pointer-events-none"
//           />
//           <div className="absolute right-0 top-[20%] md:right-3 md:top-[38%]   initial-text items-center justify-center w-full md:w-fit pr-0 md:pr-10 md:px-16 lg:px-20   xl:px-32">
//             <h1 className="text-center    lg:text-6xl md:text-5xl text-4xl font-semibold leading-tight text-[#0f0f0f] ">
//               What you envision, <br />
//               We help you become.
//             </h1>
//           </div>
//           <div className="absolute  top-[11%]  pointer-events-none opacity-0 second-text text-center px-10 md:px-16 lg:px-32">
//             <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold leading-tight text-[#0f0f0f]">
//               Every need of your brand, under one roof, powered by one partner.
//             </h1>
//           </div>
//         </div>

//         <div className="starfield-layer fixed inset-0 z-[25] opacity-0 pointer-events-none bg-[#0f0f0f] text-[#fafafa]">
//           <StarfieldBackground activeIndex={activeServiceIndex} />
//           <div
//             ref={flyingTextRef}
//             className="absolute top-0 h-full w-full    pointer-events-none z-[25]"
//           >
//             {texts.map((t, i) => (
//               <div
//                 key={i}
//                 className="absolute top-[45%] sm:top-[47%] px-10 md:px-16 lg:px-32  text-wrapper w-full text-center "
//               >
//                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold  ">
//                   {t}
//                 </h1>
//               </div>
//             ))}
//           </div>
//           {/* Service Texts beside logo */}
//           <div className="absolute bottom-15 md:bottom-[29%] lg:bottom-[33%]  lg:right-[12%] md:right-[2%] w-full  h-[200px] md:w-[400px] md:h-[250px] flex items-center justify-center text-left   service-texts  ">
//             {SERVICE_DATA.map((service, i) => (
//               <div
//                 key={i}
//                 className={`absolute top-0 h-full w-full transition-opacity duration-700 service-text service-${i} opacity-0  flex flex-col items-center md:text-start  md:justify-center justify-start `}
//               >
//                 <h2
//                   className={`text-3xl md:text-4xl lg:text-5xl font-semibold w-full text-center md:text-left`}
//                 >
//                   {service.title}
//                 </h2>
//                 <p className=" text-lg md:text-xl lg:text-2xl mt-2  md:w-full w-[70%] text-center md:text-left">
//                   {service.subtext}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="statSection relative opacity-0 z-[50] pointer-events-auto ">
//           <StatsSection />
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Home;












































// "use client";

// import { Canvas } from "@react-three/fiber";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useCallback, useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
// import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
// import FlowingParticles from "../../components/homepage/ParticleBackground";
// import StarfieldBackground from "../../components/homepage/StarfieldBackground";
// import StatsSection from "../../components/homepage/Stats";
// import useDeviceType from "../../components/hooks/useDeviceType";

// // ✅ Register GSAP plugin once at module level
// gsap.registerPlugin(ScrollTrigger);

// // ✅ FIX 1: Cache loaders at module level
// const gltfLoader = new GLTFLoader();
// const rgbeLoader = new RGBELoader();

// // ✅ FIX 2: Create texture once at module level
// let _particleTexture = null;
// function getParticleTexture() {
//   if (_particleTexture) return _particleTexture;
//   if (typeof document === "undefined") return null;

//   const size = 128;
//   const canvas = document.createElement("canvas");
//   canvas.width = size;
//   canvas.height = size;
//   const ctx = canvas.getContext("2d");

//   ctx.clearRect(0, 0, size, size);
//   const cx = size / 2;
//   const cy = size / 2;
//   const coreR = Math.floor(size * 0.2);

//   ctx.imageSmoothingEnabled = false;
//   ctx.beginPath();
//   ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.fillStyle = "rgba(255,255,255,1)";
//   ctx.fill();

//   _particleTexture = new THREE.CanvasTexture(canvas);
//   _particleTexture.minFilter = THREE.LinearFilter;
//   _particleTexture.magFilter = THREE.LinearFilter;
//   _particleTexture.needsUpdate = true;
//   return _particleTexture;
// }

// // ✅ FIX 3: Pre-create colors at module level
// const COLOR_GRADIENT = [
//   "#7B3DAF",
//   "#9B54CD",
//   "#B56EE3",
//   "#CF89F5",
//   "#E9A4FF",
// ];

// const DARK_COLOR = new THREE.Color("#12001a");
// const LIGHT_COLOR = new THREE.Color("#a96cff");

// // ✅ FIX 4: Static data outside component
// const MESH_ORDER = {
//   Curve001: 2,
//   Curve002: 1,
//   Curve_1: 3,
//   Curve003: 4,
//   Curve004: 5,
//   Curve005: 6,
//   Curve006: 7,
// };

// const TEXTS = [
//   "You're visible everywhere, but remembered nowhere?",
//   "Your website and UI/UX look great in reviews, not in results.",
//   "Investors are interested, but not invested?",
// ];

// const SERVICE_DATA = [
//   {
//     title: "Branding/ Designing",
//     subtext: "Giving your ideas a form people can see, trust, and remember.",
//     className: "text-yellow-500",
//   },
//   {
//     title: "UI/UX Design",
//     subtext: "Crafted interfaces that feel effortless and intuitive.",
//     className: "text-red-500",
//   },
//   {
//     title: "Web Development",
//     subtext: "Building the home your brand deserves online.",
//     className: "text-yellow-500",
//   },
//   {
//     title: "Digital Marketing",
//     subtext: "Turning campaigns into constellations that people follow.",
//     className: "text-purple-600",
//   },
//   {
//     title: "Investor Relations",
//     subtext: "We help your finances find their true orbit.",
//     className: "text-green-500",
//   },
//   {
//     title: "Financial Advisory",
//     subtext: "Turning your milestones into meaningful narratives.",
//     className: "text-blue-500",
//   },
//   {
//     title: "Legal advice",
//     subtext: "Simplifying what's binding, strengthening what's bold.",
//     className: "text-indigo-500",
//   },
// ];

// // ✅ FIX 5: Shader code as constants
// const VERTEX_SHADER = `
//   attribute vec3 aRandom;
//   attribute float aSize;
//   attribute vec3 aColor;

//   uniform float uProgress;
//   uniform float uTime;
//   uniform float uSizeMultiplier;

//   varying float vProgress;
//   varying vec3 vColor;
//   varying float vDepth;

//   void main() {
//     vProgress = uProgress;
//     vColor = aColor;

//     vec3 explodeDir = normalize(vec3(0, (aRandom.y + 2.0) * 0.1, 1.0)) * (aRandom.z * 0.4) * uProgress;
//     vec3 exploded = position + explodeDir * 2.0 * aRandom.z * uProgress;

//     float orbitRadius = 0.2 + fract(aRandom.y) * 0.8;
//     float speed = 0.2 + fract(aRandom.z) * 0.9;

//     vec3 finalPosition = exploded;

//     finalPosition.x += sin(uTime * speed + aRandom.x) * orbitRadius * uProgress;
//     finalPosition.y += sin(uTime * speed + aRandom.y) * orbitRadius * uProgress;

//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_Position = projectionMatrix * mvPosition;

//     vDepth = mvPosition.z;
//     vec4 viewPos = modelViewMatrix * vec4(exploded, 1.0);
//     float dist = abs(viewPos.z);
//     float baseSize = 1.5;
//     float towardCamera = step(0.0, -explodeDir.z);
//     float sizeByDistance = mix(1.0, (1.0 / (dist * 0.35 + 1.0)), towardCamera);
//     float nearBoost = mix(1.0, 1.8, smoothstep(0.0, 0.0, -viewPos.z));
//     gl_PointSize = baseSize * sizeByDistance * nearBoost * 100.0 / -viewPos.z * uSizeMultiplier;
//   }
// `;

// const FRAGMENT_SHADER = `
//   uniform sampler2D uTexture;
//   uniform float uVisibility;
//   uniform vec3 uDarkColor;
//   uniform vec3 uLightColor;
  
//   varying float vProgress;
//   varying vec3 vColor;

//   void main() {
//     vec2 centeredCoord = gl_PointCoord - vec2(0.5);
//     if (length(centeredCoord) > 0.5) discard;
//     vec4 texColor = texture2D(uTexture, gl_PointCoord);

//     vec3 targetColor = mix(vColor, mix(uDarkColor, uLightColor, 0.4), smoothstep(0.0, 1.0, vProgress));
//     vec4 finalColor = vec4(targetColor, 1.0) * texColor;
//     finalColor.a *= uVisibility;
//     gl_FragColor = finalColor;
//   }
// `;

// const Home = () => {
//   const canvasRef = useRef(null);
//   const slicesRef = useRef([]);
//   const isFloatingRef = useRef(true);
//   const scrollYRef = useRef(0);
//   const initialSlicePositionsRef = useRef([]);
//   const initialSliceRotationsRef = useRef([]);
//   const particlesMaterialRef = useRef(null);
//   const timelineRef = useRef(null);
//   const rendererRef = useRef(null);
//   const sceneRef = useRef(null);

//   const [activeServiceIndex, setActiveServiceIndex] = useState(0);

//   const flowAnimation = useRef({ scrollSpeed: 0 });
//   const flowingParticlesMaterialRef = useRef();
//   const flyingTextRef = useRef(null);

//   const { isMobile, isTablet, isDesktop } = useDeviceType();

//   // ✅ FIX 6: Memoize spiral target based on device
//   const getSpiralTarget = useCallback(() => {
//     if (isMobile) {
//       return {
//         position: { x: 0.015, y: 0.05, z: -0.29 },
//         rotation: { x: -0.2, y: -1.5, z: 0 },
//         duration: 4,
//       };
//     } else if (isTablet) {
//       return {
//         position: { x: 0.18, y: 0.08, z: -0.2 },
//         rotation: { x: -0.16, y: -1.4, z: 0 },
//         duration: 4.5,
//       };
//     }
//     return {
//       position: { x: 0.21, y: 0.1, z: -0.22 },
//       rotation: { x: -0.181592653589793, y: -1.53159265358979, z: 0 },
//       duration: 5,
//     };
//   }, [isMobile, isTablet]);

//   useEffect(() => {
//     if (!canvasRef.current) return;

//     const spiralTarget = getSpiralTarget();
    
//     // ✅ Reset refs
//     slicesRef.current = [];
//     initialSlicePositionsRef.current = [];
//     initialSliceRotationsRef.current = [];
//     const logoMaterials = [];

//     // Scene setup
//     const scene = new THREE.Scene();
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(
//       75,
//       window.innerWidth / window.innerHeight,
//       0.1,
//       1000
//     );
//     camera.position.set(0, 0, 5);

//     // ✅ FIX 7: Optimized renderer settings
//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvasRef.current,
//       antialias: !isMobile,
//       alpha: true,
//       powerPreference: "high-performance",
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     rendererRef.current = renderer;

//     // Resize handler
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener("resize", handleResize);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 10, 5);
//     scene.add(directionalLight);

//     // HDR Environment
//     let hdrTexture = null;
//     rgbeLoader.load("/images/studio_small_03_1k.hdr", (hdrMap) => {
//       hdrMap.mapping = THREE.EquirectangularReflectionMapping;
//       scene.environment = hdrMap;
//       hdrTexture = hdrMap;
//     });

//     // ✅ FIX 8: Create shader material once
//     const createShaderMaterial = () => {
//       return new THREE.ShaderMaterial({
//         uniforms: {
//           uProgress: { value: 0.0 },
//           uTexture: { value: getParticleTexture() },
//           uVisibility: { value: 0.0 },
//           uTime: { value: 0.0 },
//           uSizeMultiplier: { value: 1.0 },
//           uMouse: { value: new THREE.Vector2(0.0, 0.0) },
//           uDarkColor: { value: DARK_COLOR },
//           uLightColor: { value: LIGHT_COLOR },
//         },
//         vertexShader: VERTEX_SHADER,
//         fragmentShader: FRAGMENT_SHADER,
//         transparent: true,
//         depthWrite: false,
//       });
//     };

//     // Create particle system
//     const createParticleSystem = (rawModel) => {
//       const samplingGroup = new THREE.Group();
//       samplingGroup.add(rawModel.clone());

//       samplingGroup.traverse((child) => {
//         if (child.isMesh) {
//           child.position.set(
//             spiralTarget.position.x,
//             spiralTarget.position.y,
//             spiralTarget.position.z
//           );
//           child.rotation.set(
//             spiralTarget.rotation.x,
//             spiralTarget.rotation.y,
//             spiralTarget.rotation.z
//           );
//         }
//       });

//       const geometries = [];
//       samplingGroup.updateWorldMatrix(true, true);
//       samplingGroup.traverse((child) => {
//         if (child.isMesh) {
//           const geometry = child.geometry.clone();
//           geometry.applyMatrix4(child.matrixWorld);
//           geometries.push(geometry);
//         }
//       });

//       if (geometries.length === 0) return;

//       const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);
//       const mergedMeshForSampling = new THREE.Mesh(mergedGeometry);

//       const sampler = new MeshSurfaceSampler(mergedMeshForSampling).build();
//       const numParticles = 30000;

//       const particlesGeometry = new THREE.BufferGeometry();
//       const positions = new Float32Array(numParticles * 3);
//       const randoms = new Float32Array(numParticles * 3);
//       const sizes = new Float32Array(numParticles);
//       const colors = new Float32Array(numParticles * 3);

//       // Find bounds for normalization
//       let minX = Infinity, maxX = -Infinity;
//       for (let i = 0; i < numParticles; i++) {
//         const newPosition = new THREE.Vector3();
//         sampler.sample(newPosition);
//         positions[i * 3] = newPosition.x;
//         positions[i * 3 + 1] = newPosition.y;
//         positions[i * 3 + 2] = newPosition.z;

//         minX = Math.min(minX, newPosition.x);
//         maxX = Math.max(maxX, newPosition.x);
//       }

//       // ✅ FIX 9: Optimized color interpolation
//       const gradientLength = COLOR_GRADIENT.length - 1;
     

//       for (let i = 0; i < numParticles; i++) {
//         const x = positions[i * 3];
//         const t = (x - minX) / (maxX - minX);

//         const gradientIndex = t * gradientLength;
//         const lowerIndex = Math.floor(gradientIndex);
//         const upperIndex = Math.ceil(gradientIndex);
//         const localT = gradientIndex - lowerIndex;

//          const color1 = new THREE.Color(COLOR_GRADIENT[lowerIndex]);
//         const color2 = new THREE.Color(COLOR_GRADIENT[upperIndex]);
//         const finalColor = color1.lerp(color2, localT);

//         colors[i * 3] = finalColor.r;
//         colors[i * 3 + 1] = finalColor.g;
//         colors[i * 3 + 2] = finalColor.b;

//         randoms[i * 3] = 0;
//         randoms[i * 3 + 1] = 0;
//         randoms[i * 3 + 2] = Math.random() * 5.0;

//         sizes[i] = 12 + Math.random() * 94;
//       }

//       particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//       particlesGeometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
//       particlesGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
//       particlesGeometry.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

//       const particlesMaterial = createShaderMaterial();
//       particlesMaterialRef.current = particlesMaterial;

//       const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
//       scene.add(particleSystem);

//       // ✅ FIX 10: Dispose merged geometry after use
//       mergedGeometry.dispose();

//       // Setup scroll animation
//       const checkAndSetupAnimation = () => {
//         if (flowingParticlesMaterialRef.current) {
//           setupScrollAnimation(logoMaterials, particlesMaterial, camera);
//         } else {
//           requestAnimationFrame(checkAndSetupAnimation);
//         }
//       };
//       checkAndSetupAnimation();

//       return particlesGeometry;
//     };

//     // Setup scroll animation
//     const setupScrollAnimation = (materials, particlesMaterial, camera) => {
//       gsap.set(".starfield-layer", { opacity: 0 });
//       gsap.set(".text-wrapper", { opacity: 0, scale: 0.1 });

//       const tl = gsap.timeline({
//         scrollTrigger: {
//           trigger: "#scroll-spacer",
//           start: "top top",
//           end: "100% bottom",
//           scrub: 1.8,
//           onUpdate: (self) => {
//             gsap.to(flowAnimation.current, {
//               scrollSpeed: self.getVelocity() * 0.005,
//               duration: 0.9,
//               overwrite: true,
//             });
//           },
//         },
//       });

//       timelineRef.current = tl;

//       // --- STEP 1: Move logo to center ---
//       tl.addLabel("initial");
      
//       if (isMobile) {
//         tl.to(camera.position, {
//           x: 0,
//           y: 0,
//           z: 8,
//           ease: "power1.inOut",
//           onUpdate: () => camera.updateProjectionMatrix(),
//         });
//       }

//       // Animate each spiral individually
//       slicesRef.current.forEach((slice, index) => {
//         const delay = index * 0.6;

//         tl.to(
//           slice.position,
//           {
//             ...spiralTarget.position,
//             duration: spiralTarget.duration,
//             ease: "power1.inOut",
//           },
//           delay
//         );

//         tl.to(
//           slice.rotation,
//           {
//             ...spiralTarget.rotation,
//             duration: spiralTarget.duration,
//             ease: "power1.inOut",
//           },
//           delay
//         );
//       });

//       tl.to(".initial-text", {
//         y: "-10vh",
//         opacity: 0,
//         duration: 3.5,
//         ease: "power1.inOut",
//       }, "<-3");

//       tl.to(".second-text", {
//         y: "2vh",
//         opacity: 1,
//         duration: 3.5,
//         ease: "power1.inOut",
//       }, ">+1");

//       tl.addLabel("rotation");
//       tl.to(".second-text", { opacity: 0, duration: 3.5, ease: "power1.inOut" }, ">");

//       // --- STEP 4: Particle explosion ---
//       tl.to(particlesMaterial.uniforms.uVisibility, { value: 1, duration: 4 }, ">1");

//       materials.forEach((mat) => {
//         tl.to(mat, { opacity: 0, duration: 0.8, ease: "power2.out" }, "<");
//       });

//       tl.to(particlesMaterial.uniforms.uProgress, { value: 1, duration: 10, ease: "power1.inOut" }, ">");

//       tl.to(camera, {
//         fov: 4,
//         duration: 10,
//         ease: "power1.inOut",
//         onUpdate: () => camera.updateProjectionMatrix(),
//       }, "<");

//       tl.to(particlesMaterial.uniforms.uSizeMultiplier, { value: 0, duration: 0.5, ease: "power2.in" }, ">-3");
//       tl.to(particlesMaterial.uniforms.uVisibility, { value: 0, duration: 0.7, ease: "power2.inOut" }, "<");

//       tl.addLabel("starfieldFadeIn", ">-1");

//       // --- STEP 5: Fade in starfield ---
//       tl.to(".starfield-layer", { opacity: 1, duration: 3, ease: "power2.inOut" }, ">-3.5");

//       // --- STEP 6: Flying text animation ---
//       const flyingTexts = document.querySelectorAll(".text-wrapper");
//       const textDuration = 8;
//       const overlap = 0.3;

//       flyingTexts.forEach((el, i) => {
//         const startTime = i === 0 ? ">" : `>-=${textDuration * overlap + 0.5}`;
//         const labelName = `flyingText-${i}`;
//         tl.addLabel(labelName, startTime);

//         if (i === flyingTexts.length - 1) {
//           tl.fromTo(
//             el,
//             { opacity: 0, scale: 0.1 },
//             {
//               opacity: 1,
//               scale: 1.1,
//               y: 0,
//               ease: "power2.out",
//               duration: textDuration,
//             },
//             "afterSecondText"
//           );
//           tl.addLabel("thirdTextHold", "+=3");
//           tl.to(el, {
//             y: -300,
//             opacity: 0,
//             scale: 1.1,
//             duration: textDuration,
//             ease: "power2.inOut",
//           }, "thirdTextHold");
//         } else {
//           tl.fromTo(
//             el,
//             { opacity: 0, scale: 0.1 },
//             {
//               opacity: 0,
//               scale: 1.1,
//               ease: "power2.inOut",
//               duration: textDuration,
//               onUpdate: function () {
//                 const p = this.progress();
//                 const fade = Math.pow(Math.sin(p * Math.PI), 2.2);
//                 gsap.set(el, { opacity: fade });
//               },
//             },
//             labelName
//           );
//         }

//         if (i === 1) {
//           tl.addLabel("afterSecondText", ">");
//           tl.to(
//             window.starfieldUniforms.uDirection.value,
//             {
//               x: 0,
//               y: 1,
//               z: 0,
//               duration: 2,
//               ease: "power2.inOut",
//             },
//             `>-${textDuration * 0.33}`
//           );
//         }
//       });

//       const starfieldMorphState = { value: 0 };
//       tl.to(starfieldMorphState, {
//         value: 1,
//         duration: 12,
//         ease: "power2.inOut",
//         onUpdate: () => {
//           if (window.starfieldMorphUniform) {
//             window.starfieldMorphUniform.value = starfieldMorphState.value;
//           }
//         },
//       }, "<");

//       // --- STEP 7: Service text animation ---
//       const serviceCount = SERVICE_DATA.length;
//       const TRANSITION_DURATION = 2.5;

//       gsap.set(".service-text", { opacity: 0 });
//       setActiveServiceIndex(0);

//       tl.fromTo(
//         ".service-0",
//         { opacity: 0, y: -100, filter: "blur(12px)" },
//         {
//           opacity: 1,
//           y: 0,
//           filter: "blur(0px)",
//           duration: 1.4,
//           ease: "power3.out",
//           onStart: () => setActiveServiceIndex(0),
//         },
//         ">-1"
//       );

//       for (let i = 1; i < serviceCount; i++) {
//         const label = `service-${i}`;
//         tl.addLabel(label, ">+1.2");

//         tl.to(`.service-${i - 1}`, {
//           opacity: 0,
//           y: -100,
//           filter: "blur(10px)",
//           duration: 1.2,
//           ease: "power2.inOut",
//         }, `>+${TRANSITION_DURATION * 0.8}`);

//         tl.fromTo(
//           `.service-${i}`,
//           { opacity: 0, y: -100, filter: "blur(12px)" },
//           {
//             opacity: 1,
//             y: 0,
//             filter: "blur(0px)",
//             duration: 1.4,
//             ease: "power3.out",
//             onStart: () => setActiveServiceIndex(i),
//             onReverseComplete: () => {
//               requestAnimationFrame(() => {
//                 setActiveServiceIndex(i - 1 >= 0 ? i - 1 : 0);
//               });
//             },
//           },
//           "<"
//         );
//       }

//       tl.to({}, {
//         duration: 0.1,
//         onComplete: () => setActiveServiceIndex(serviceCount - 1),
//       }, "serviceEnd");

//       gsap.set(".statSection", { pointerEvents: "auto" });

//       gsap.timeline({
//         scrollTrigger: {
//           trigger: ".statSection",
//           start: "top bottom",
//           end: "top top",
//           scrub: 1.2,
//         },
//       })
//         .to(".statSection", { opacity: 1, ease: "none" }, 0)
//         .to(".next-section", { opacity: 0, ease: "none" }, 0);

//       ScrollTrigger.refresh();
//     };

//     // Load GLTF model
//     let particlesGeometry = null;
//     gltfLoader.load(
//       "/models/model.glb",
//       (gltf) => {
//         const rawModel = gltf.scene;
//         scene.add(rawModel);

//         if (isMobile) {
//           rawModel.scale.set(14, 14, 6);
//           rawModel.position.set(0.8, -3.3, 0);
//         } else if (isTablet) {
//           rawModel.scale.set(17, 17, 4);
//           rawModel.position.set(-2.3, -2.4, 0);
//         } else {
//           rawModel.scale.set(17, 17, 4);
//           rawModel.position.set(-2.3, -2.8, 0);
//         }
//         rawModel.rotation.set(0, 0, 0);

//         rawModel.traverse((child) => {
//           if (child.isMesh) {
//             slicesRef.current.push(child);
//             child.material.transparent = true;
//             child.material.depthWrite = false;
//             logoMaterials.push(child.material);
//             initialSlicePositionsRef.current.push(child.position.clone());
//             initialSliceRotationsRef.current.push(child.rotation.clone());
//           }
//         });

//         slicesRef.current.sort((a, b) => MESH_ORDER[a.name] - MESH_ORDER[b.name]);

//         slicesRef.current.forEach((slice) => {
//           slice.position.set(0, 0, 0);
//           slice.rotation.set(0, 0, 0);
//         });

//         particlesGeometry = createParticleSystem(rawModel);
//       },
//       undefined,
//       (error) => console.error("GLTF Load Error:", error)
//     );

//     // Floating animation
//     const applyFloating = (time) => {
//       const slices = slicesRef.current;
//       const initialPositions = initialSlicePositionsRef.current;
//       const initialRotations = initialSliceRotationsRef.current;

//       if (slices.length === 0 || initialPositions.length !== slices.length) return;

//       slices.forEach((slice, i) => {
//         const basePos = initialPositions[i];
//         const baseRot = initialRotations[i];

//         if (!basePos || !baseRot) return;

//         const offset = 0.5;
//         const speed = 0.9 + i * 0.1;

//         slice.position.x = basePos.x + Math.sin(time * speed + offset) * 0.0035;
//         slice.position.y = basePos.y + Math.cos(time * speed + offset) * 0.0035;
//         slice.position.z = basePos.z + Math.sin(time * 0.5 + offset) * 0.003;

//         slice.rotation.x = baseRot.x + Math.sin(time * speed * 0.3 + offset) * 0.008;
//         slice.rotation.y = baseRot.y + Math.cos(time * speed * 0.25 + offset) * 0.008;
//       });
//     };

//     // Animation loop
//     const animate = () => {
//       const time = performance.now() * 0.001;

//       if (particlesMaterialRef.current) {
//         particlesMaterialRef.current.uniforms.uTime.value = time;
//       }

//       if (
//         isFloatingRef.current &&
//         slicesRef.current.length > 0 &&
//         initialSlicePositionsRef.current.length === slicesRef.current.length
//       ) {
//         applyFloating(time);
//       }

//       renderer.render(scene, camera);
//     };

//     renderer.setAnimationLoop(animate);

//     // Scroll handler for floating control
//     const handleScroll = () => {
//       scrollYRef.current = window.scrollY;

//       if (scrollYRef.current > 5 && isFloatingRef.current) {
//         isFloatingRef.current = false;
//       }

//       if (scrollYRef.current <= 5 && !isFloatingRef.current) {
//         isFloatingRef.current = true;
//       }
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });

//     // ✅ FIX 11: Comprehensive cleanup
//     return () => {
//       renderer.setAnimationLoop(null);

//       // Remove event listeners
//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("scroll", handleScroll);

//       // Kill GSAP animations
//       if (timelineRef.current) {
//         timelineRef.current.kill();
//       }
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

//       // Dispose Three.js resources
//       scene.traverse((object) => {
//         if (object.geometry) object.geometry.dispose();
//         if (object.material) {
//           if (Array.isArray(object.material)) {
//             object.material.forEach((mat) => mat.dispose());
//           } else {
//             object.material.dispose();
//           }
//         }
//       });

//       if (particlesGeometry) particlesGeometry.dispose();
//       if (particlesMaterialRef.current) particlesMaterialRef.current.dispose();
//       if (hdrTexture) hdrTexture.dispose();

//       renderer.dispose();
//     };
//   }, [isMobile, isTablet, getSpiralTarget]);

//   return (
//     <main className="bg-[#fafafa]  text-black">
//       <div
//         id="scroll-spacer"
//         className="w-full scroll-spacer h-[1050vh] bg-[#0f0f0f]"
//       />
//       <div className="w-full h-full relative">
//         <div className="initial-animation fixed inset-0 z-[10] pointer-events-none bg-[#fafafa]">
//           <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
//             <FlowingParticles
//               flowAnimation={flowAnimation}
//               materialRef={flowingParticlesMaterialRef}
//             />
//           </Canvas>
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 h-full w-full pointer-events-none"
//           />
//           <div className="absolute right-0 top-[20%] md:right-3 md:top-[38%] initial-text items-center justify-center w-full md:w-fit pr-0 md:pr-10 md:px-16 lg:px-20 xl:px-32">
//             <h1 className="text-center lg:text-6xl md:text-5xl text-4xl font-semibold leading-tight text-[#0f0f0f]">
//               What you envision, <br />
//               We help you become.
//             </h1>
//           </div>
//           <div className="absolute top-[11%] pointer-events-none opacity-0 second-text text-center px-10 md:px-16 lg:px-32">
//             <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold leading-tight text-[#0f0f0f]">
//               Every need of your brand, under one roof, powered by one partner.
//             </h1>
//           </div>
//         </div>

//         <div className="starfield-layer fixed inset-0 z-[25] opacity-0 pointer-events-none bg-[#0f0f0f] text-[#fafafa]">
//           <StarfieldBackground activeIndex={activeServiceIndex} />
//           <div
//             ref={flyingTextRef}
//             className="absolute top-0 h-full w-full pointer-events-none z-[25]"
//           >
//             {TEXTS.map((t, i) => (
//               <div
//                 key={i}
//                 className="absolute top-[45%] sm:top-[47%] px-10 md:px-16 lg:px-32 text-wrapper w-full text-center"
//               >
//                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
//                   {t}
//                 </h1>
//               </div>
//             ))}
//           </div>
//           <div className="absolute bottom-15 md:bottom-[29%] lg:bottom-[33%] lg:right-[12%] md:right-[2%] w-full h-[200px] md:w-[400px] md:h-[250px] flex items-center justify-center text-left service-texts">
//             {SERVICE_DATA.map((service, i) => (
//               <div
//                 key={i}
//                 className={`absolute top-0 h-full w-full transition-opacity duration-700 service-text service-${i} opacity-0 flex flex-col items-center md:text-start md:justify-center justify-start`}
//               >
//                 <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold w-full text-center md:text-left">
//                   {service.title}
//                 </h2>
//                 <p className="text-lg md:text-xl lg:text-2xl mt-2 md:w-full w-[70%] text-center md:text-left">
//                   {service.subtext}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="statSection relative opacity-0 z-[50] pointer-events-auto">
//           <StatsSection />
//         </div>
//       </div>
//     </main>
//   );
// };

// export default Home;
















// src/components/home/Home.jsx
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import useDeviceType from "../../components/hooks/useDeviceType";
import LoadingPlaceholder from "../../components/ui/LoadingPlaceholder";

// ✅ Register GSAP plugin once at module level
gsap.registerPlugin(ScrollTrigger);

// ✅ OPTIMIZATION 1: Dynamic imports with ssr: false for Three.js components
const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false,
  loading: () => <LoadingPlaceholder background="#fafafa" />,
});

const FlowingParticlesCanvas = dynamic(
  () => import("./FlowingParticlesCanvas"),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder background="#fafafa" />,
  }
);

const StarfieldBackground = dynamic(
  () => import("../../components/homepage/StarfieldBackground"),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder background="#0f0f0f" />,
  }
);

const StatsSection = dynamic(
  () => import("../../components/homepage/Stats"),
  {
    ssr: false,
    loading: () => <LoadingPlaceholder background="#0f0f0f" />,
  }
);

// ✅ Static data outside component
const TEXTS = [
  "You're visible everywhere, but remembered nowhere?",
  "Your website and UI/UX look great in reviews, not in results.",
  "Investors are interested, but not invested?",
];

const SERVICE_DATA = [
  {
    title: "Branding/ Designing",
    subtext: "Giving your ideas a form people can see, trust, and remember.",
  },
  {
    title: "UI/UX Design",
    subtext: "Crafted interfaces that feel effortless and intuitive.",
  },
  {
    title: "Web Development",
    subtext: "Building the home your brand deserves online.",
  },
  {
    title: "Digital Marketing",
    subtext: "Turning campaigns into constellations that people follow.",
  },
  {
    title: "Investor Relations",
    subtext: "We help your finances find their true orbit.",
  },
  {
    title: "Financial Advisory",
    subtext: "Turning your milestones into meaningful narratives.",
  },
  {
    title: "Legal advice",
    subtext: "Simplifying what's binding, strengthening what's bold.",
  },
];

const Home = () => {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [isStarfieldVisible, setIsStarfieldVisible] = useState(false);
  
  const flowAnimation = useRef({ scrollSpeed: 0 });
  const flowingParticlesMaterialRef = useRef();
  const flyingTextRef = useRef(null);
  const starfieldTriggerRef = useRef(null);

  const { isMobile, isTablet } = useDeviceType();

  // ✅ OPTIMIZATION 3: Defer StarfieldBackground - Load when approaching viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStarfieldVisible(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: "500px", // Start loading 500px before visible
        threshold: 0 
      }
    );

    // Observe a trigger point (around 30% scroll)
    const triggerElement = document.getElementById("starfield-trigger");
    if (triggerElement) {
      observer.observe(triggerElement);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="bg-[#fafafa] font-sans text-black">
      <div
        id="scroll-spacer"
        className="w-full scroll-spacer h-[1050vh] bg-[#0f0f0f]"
      />
      
      {/* Invisible trigger for starfield preloading */}
      <div 
        id="starfield-trigger" 
        ref={starfieldTriggerRef}
        className="fixed top-[30vh] left-0 w-1 h-1 pointer-events-none"
      />

      <div className="w-full h-full relative">
        <div className="initial-animation fixed inset-0 z-[10] pointer-events-none bg-[#fafafa]">
          {/* ✅ OPTIMIZATION 5: Suspense boundary for FlowingParticles */}
          <Suspense fallback={<LoadingPlaceholder background="#fafafa" />}>
            <FlowingParticlesCanvas
              flowAnimation={flowAnimation}
              materialRef={flowingParticlesMaterialRef}
            />
          </Suspense>

          {/* ✅ OPTIMIZATION 5: Suspense boundary for ThreeScene */}
          <Suspense fallback={<LoadingPlaceholder background="#fafafa" />}>
            <ThreeScene
              isMobile={isMobile}
              isTablet={isTablet}
              flowAnimation={flowAnimation}
              flowingParticlesMaterialRef={flowingParticlesMaterialRef}
              setActiveServiceIndex={setActiveServiceIndex}
            />
          </Suspense>

          <div className="absolute right-0 top-[20%] md:right-3 md:top-[38%] initial-text items-center justify-center w-full md:w-fit pr-0 md:pr-10 md:px-16 lg:px-20 xl:px-32">
            <h1 className="text-center lg:text-6xl md:text-5xl text-4xl font-semibold leading-tight text-[#0f0f0f]">
              What you envision, <br />
              We help you become.
            </h1>
          </div>
          <div className="absolute top-[11%] pointer-events-none opacity-0 second-text text-center px-10 md:px-16 lg:px-32">
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold leading-tight text-[#0f0f0f]">
              Every need of your brand, under one roof, powered by one partner.
            </h1>
          </div>
        </div>

        <div className="starfield-layer fixed inset-0 z-[25] opacity-0 pointer-events-none bg-[#0f0f0f] text-[#fafafa]">
          {/* ✅ OPTIMIZATION 3 & 5: Deferred + Suspense for StarfieldBackground */}
          {isStarfieldVisible ? (
            <Suspense fallback={<LoadingPlaceholder background="#0f0f0f" />}>
              <StarfieldBackground activeIndex={activeServiceIndex} />
            </Suspense>
          ) : (
            <LoadingPlaceholder background="#0f0f0f" />
          )}

          <div
            ref={flyingTextRef}
            className="absolute top-0 h-full w-full pointer-events-none z-[25]"
          >
            {TEXTS.map((t, i) => (
              <div
                key={i}
                className="absolute top-[45%] sm:top-[47%] px-10 md:px-16 lg:px-32 text-wrapper w-full text-center"
              >
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold">
                  {t}
                </h1>
              </div>
            ))}
          </div>
          <div className="absolute bottom-15 md:bottom-[29%] lg:bottom-[33%] lg:right-[12%] md:right-[2%] w-full h-[200px] md:w-[400px] md:h-[250px] flex items-center justify-center text-left service-texts">
            {SERVICE_DATA.map((service, i) => (
              <div
                key={i}
                className={`absolute top-0 h-full w-full transition-opacity duration-700 service-text service-${i} opacity-0 flex flex-col items-center md:text-start md:justify-center justify-start`}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold w-full text-center md:text-left">
                  {service.title}
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl mt-2 md:w-full w-[70%] text-center md:text-left">
                  {service.subtext}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ OPTIMIZATION 5: Suspense for StatsSection */}
        <div className="statSection relative opacity-0 z-[50] pointer-events-auto">
          <Suspense fallback={<LoadingPlaceholder background="#0f0f0f" className="min-h-[500px]" />}>
            <StatsSection />
          </Suspense>
        </div>
      </div>
    </main>
  );
};

export default Home;
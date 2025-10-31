"use client";
import { Canvas } from "@react-three/fiber";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import FlowingParticles from "../../components/ParticleBackground";
import ScrollServiceLogo from "../../components/ScrollServiceLogo";
import StarfieldBackground from "../../components/StarfieldBackground";
import StatsSection from "../../components/Stats";

// ✅ It's good practice to register the plugin once
gsap.registerPlugin(ScrollTrigger);

const Animation = () => {
  const canvasRef = useRef(null);
  const [showStarfield, setShowStarfield] = useState(false);
  const scrollLogoRef = useRef(null);

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const flowAnimation = useRef({ scrollSpeed: 0 });
  const flowingParticlesMaterialRef = useRef();
  // --- Flying Texts Setup ---
  const flyingTextRef = useRef(null);
  const texts = [
    "Text 1",
    "Text 2",
    "Text 3",
    "Text 4",
    "Text 5",
    "Text 6",
    "Text 7",
  ];
  const SERVICE_DATA = [
    {
      title: "Service 1",
      subtext: "Brand establishment and digital identity creation.",
      className: "text-purple-600",
    },
    {
      title: "Service 2",
      subtext: "Comprehensive digital marketing strategies.",
      className: "text-red-500",
    },
    {
      title: "Service 3",
      subtext: "Creative execution and dynamic content development.",
      className: "text-yellow-500",
    },
    {
      title: "Service 4",
      subtext: "Performance marketing, conversion tracking, and optimization.",
      className: "text-green-500",
    },
    {
      title: "Service 5",
      subtext: "Deep analytics, insights, and data-driven decision making.",
      className: "text-blue-500",
    },
    {
      title: "Service 6",
      subtext: "Scaling solutions globally and entering new markets.",
      className: "text-indigo-500",
    },
    {
      title: "Service 7",
      subtext:
        "Future-proofing your business through innovation and tech integration.",
      className: "text-pink-500",
    },
  ];

  // This function remains unchanged
  function createCircleTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, size, size);
    const cx = size / 2;
    const cy = size / 2;
    const coreR = Math.floor(size * 0.2);

    ctx.imageSmoothingEnabled = false;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      smoothTouch: true,
      touchMultiplier: 0.9,
      wheelMultiplier: 0.7,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
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
      { s: 6, p: [-1.1, 1.1, 0], r: [Math.PI / 2.12, 0.0, 0.0] },
      { s: 6, p: [-1.4, 0.7, 0], r: [Math.PI / 2.1, 0.4, 0.0] },
      { s: 5.8, p: [-1.5, 0.25, 0], r: [Math.PI / 2.2, 0.8, 0.0] },
      { s: 5.6, p: [-1.4, -0.2, 0], r: [Math.PI / 2.4, 1.2, 0.0] },
      { s: 5.3, p: [-1.1, -0.54, 0], r: [Math.PI / 2.6, 1.65, 0.0] },
      { s: 4.5, p: [-0.75, -0.7, 0], r: [Math.PI / 3, 2.1, 0.0] },
      { s: 3.8, p: [-0.46, -0.8, -0.11], r: [Math.PI / 3, 2.5, 0.0] },
    ];

    const loader = new GLTFLoader();
    let particlesMaterial = null;
    let logoGroup = null;
    const individualSpirals = [];
    loader.load(
      "/models/T3d.glb",
      (gltf) => {
        const sourceScene = gltf.scene;
        logoGroup = new THREE.Group();
        logoGroup.scale.set(1.15, 1.15, 0.15);

        // ✅ Set initial position to the left, as per the first image.
        // logoGroup.position.set(-3, -0.5, 0);
        // logoGroup.rotation.set(-0.1, 0.2, -0.2);

        const allMaterials = [];

        spiralConfigs.forEach((config) => {
          // Create a separate group for each spiral
          const spiralGroup = new THREE.Group();

          const modelClone = sourceScene.clone();
          modelClone.scale.setScalar(config.s);
          modelClone.position.fromArray(config.p);
          modelClone.rotation.fromArray(config.r);

          modelClone.traverse((child) => {
            if (child.isMesh && child.material) {
              const newMaterial = child.material.clone();
              newMaterial.transparent = true;
              newMaterial.depthWrite = false;
              child.material = newMaterial;
              allMaterials.push(newMaterial);
            }
          });

          spiralGroup.add(modelClone);

          // Set initial position (offset to the left)
          spiralGroup.position.set(-3, -0.5, 0);
          spiralGroup.rotation.set(-0.1, 0.2, -0.2);

          // Store reference to this spiral
          individualSpirals.push({
            group: spiralGroup,
            finalPosition: { x: -0.5, y: -2, z: 2 },
            finalRotation: {
              x: 0,
              y: spiralGroup.rotation.y - Math.PI / 8,
              z: spiralGroup.rotation.z - Math.PI / 2,
            },
          });

          logoGroup.add(spiralGroup);
        });

        scene.add(logoGroup);

        // // Create sampling group that matches the final assembled position
        // const samplingGroup = new THREE.Group();
        // samplingGroup.scale.set(1.15, 1.15, 0.15);

        // spiralConfigs.forEach((config) => {
        //   const modelClone = sourceScene.clone();
        //   modelClone.scale.setScalar(config.s);
        //   modelClone.position.fromArray(config.p);
        //   modelClone.rotation.fromArray(config.r);
        //   samplingGroup.add(modelClone);
        // });

        // // Position the sampling group at the final centered and rotated position
        // samplingGroup.position.set(-0.5, -2, 2);
        // samplingGroup.rotation.set(0, -Math.PI / 8, -Math.PI / 2);

        // Create the particle system from the rotated clone
        createParticleSystem(
          logoGroup,
          sourceScene,
          spiralConfigs,
          allMaterials,
          individualSpirals,
          scene,
          camera
        );
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    // createParticleSystem function remains largely unchanged
    function createParticleSystem(
      logoGroup,
      sourceScene,
      spiralConfigs,
      materials,
      spirals,
      scene,
      camera
    ) {
      // Create a temporary sampling group that matches the FINAL assembled state
      const samplingGroup = new THREE.Group();
      samplingGroup.scale.copy(logoGroup.scale);

      spiralConfigs.forEach((config, index) => {
        const modelClone = sourceScene.clone();
        modelClone.scale.setScalar(config.s);
        modelClone.position.fromArray(config.p);
        modelClone.rotation.fromArray(config.r);

        // Create wrapper to match spiral structure
        const spiralWrapper = new THREE.Group();
        spiralWrapper.add(modelClone);

        // Apply FINAL position and rotation
        spiralWrapper.position.set(
          spirals[index].finalPosition.x,
          spirals[index].finalPosition.y,
          spirals[index].finalPosition.z
        );
        spiralWrapper.rotation.set(
          spirals[index].finalRotation.x,
          spirals[index].finalRotation.y,
          spirals[index].finalRotation.z
        );

        samplingGroup.add(spiralWrapper);
      });

      const geometries = [];
      samplingGroup.updateWorldMatrix(true, true);
      samplingGroup.traverse((child) => {
        if (child.isMesh) {
          const geometry = child.geometry.clone();
          geometry.applyMatrix4(child.matrixWorld);
          geometries.push(geometry);
        }
      });

      if (geometries.length === 0) return;

      const mergedGeometry = BufferGeometryUtils.mergeGeometries(
        geometries,
        false
      );
      const mergedMeshForSampling = new THREE.Mesh(mergedGeometry);

      const sampler = new MeshSurfaceSampler(mergedMeshForSampling).build();
      const numParticles = 8000;

      const particlesGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(numParticles * 3);
      const randoms = new Float32Array(numParticles * 3);
      const sizes = new Float32Array(numParticles);
      const colors = new Float32Array(numParticles * 3);

      const colorPalette = [
        "#9F62FE", // sky blue
        "#DF8CFF",
        "#AB76E2",
      ];

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);

        positions[i * 3] = newPosition.x;
        positions[i * 3 + 1] = newPosition.y;
        positions[i * 3 + 2] = newPosition.z;

        randoms[i * 3] = 0;
        randoms[i * 3 + 1] = 0;
        randoms[i * 3 + 2] = Math.random() * 5.0;

        sizes[i] = 12 + Math.random() * 94;

        const colorHex =
          colorPalette[Math.floor(Math.random() * colorPalette.length)];
        const color = new THREE.Color(colorHex);

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      particlesGeometry.setAttribute(
        "aRandom",
        new THREE.BufferAttribute(randoms, 3)
      );
      particlesGeometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(sizes, 1)
      );
      particlesGeometry.setAttribute(
        "aColor",
        new THREE.BufferAttribute(colors, 3)
      );

      particlesMaterial = createShaderMaterial();
      const particleSystem = new THREE.Points(
        particlesGeometry,
        particlesMaterial
      );

      scene.add(particleSystem);
      if (flowingParticlesMaterialRef.current) {
        setupScrollAnimation(materials, spirals, particlesMaterial, camera);
      } else {
        const checkRefInterval = setInterval(() => {
          if (flowingParticlesMaterialRef.current) {
            setupScrollAnimation(materials, spirals, particlesMaterial, camera);
            clearInterval(checkRefInterval);
          }
        }, 100);
      }
    }

    let particleTexture = createCircleTexture();

    // createShaderMaterial function remains unchanged
    function createShaderMaterial() {
      const vertexShader = `
                attribute vec3 aRandom;
                attribute float aSize;
                attribute vec3 aColor;

                uniform float uProgress;
                uniform float uTime;

                uniform float uSizeMultiplier;

                varying float vProgress;
                varying vec3 vColor;

                void main() {
                     vProgress = uProgress;
    vColor = aColor;

    // float xSpread = (fract(sin(dot(position.xy ,vec2(12.9898,78.233))) * 43758.5453) - 0.5) * 2.0;
    vec3 explodeDir = normalize(vec3(0, (aRandom.y + 2.0) * 0.1, 1.0)) * (aRandom.z * 0.4) * uProgress;
    vec3 exploded = position + explodeDir * aRandom.z * uProgress;

    // ---------- floating orbit-based motion ----------
    float orbitRadius = 0.2 + fract(aRandom.y) * 0.0;
    float speed = 0.2 + fract(aRandom.z) * 0.1;

    // base exploded position
    vec3 finalPosition = exploded;

    // circular orbital motion applied during explosion
    finalPosition.x += cos(uTime * speed + aRandom.x) * orbitRadius * uProgress;
    finalPosition.y += sin(uTime * speed + aRandom.y) * orbitRadius * uProgress;

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vec4 viewPos = modelViewMatrix * vec4(exploded, 1.0);
    float dist = abs(viewPos.z);
    float baseSize = 1.0;
    float towardCamera = step(0.0, -explodeDir.z);
    float sizeByDistance = mix(1.0, (1.0 / (dist * 0.25 + 1.0)), towardCamera);
    float nearBoost = mix(1.0, 1.8, smoothstep(0.0, 0.0, -viewPos.z));
    gl_PointSize = baseSize * sizeByDistance * nearBoost * 80.0 / -viewPos.z;
                }
            `;
      const fragmentShader = `
                uniform sampler2D uTexture;
                uniform float uVisibility;
uniform vec3 uDarkColor;
uniform vec3 uLightColor;
                varying float vProgress;
                varying vec3 vColor;

                void main() {
                    vec2 centeredCoord = gl_PointCoord - vec2(0.5);
                    if (length(centeredCoord) > 0.5) discard;
                    vec4 texColor = texture2D(uTexture, gl_PointCoord);

                   vec3 targetColor = mix(vColor, mix(uDarkColor, uLightColor, 0.4), smoothstep(0.0, 1.0, vProgress));
                    vec4 finalColor = vec4(targetColor, 1.0) * texColor;
                    finalColor.a *= uVisibility;
                    gl_FragColor = finalColor;
                }
            `;
      return new THREE.ShaderMaterial({
        uniforms: {
          uProgress: { value: 0.0 },
          uTexture: { value: particleTexture },
          uVisibility: { value: 0.0 },
          uTime: { value: 0.0 },
          // uColor: { value: new THREE.Color("#AB76E2") }, // ✅ added single color uniform

          uSizeMultiplier: { value: 1.0 },
          uMouse: { value: new THREE.Vector2(0.0, 0.0) },
          uDarkColor: { value: new THREE.Color("#12001a") }, // blackish purple
          uLightColor: { value: new THREE.Color("#a96cff") }, // bright purple
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
      });
    }

    function setupScrollAnimation(
      materials,
      spirals,
      particlesMaterial,
      camera
    ) {
      // Make sure starfield starts hidden
      gsap.set(".starfield-layer", { opacity: 0 });
      gsap.set(".text-wrapper", { opacity: 0, scale: 0.1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".scroll-container",
          start: "top top",
          end: "100% bottom",
          scrub: 0.82, // smooth scroll-scrub
          // snap: {
          //   snapTo: "labelsDirectional",
          //   duration: 0.9, // instant transition to snap point
          //   delay: 0, // start snapping immediately when scroll stops
          //   ease: "none",
          //   inertia: false,
          // },

          onUpdate: (self) => {
            gsap.to(flowAnimation.current, {
              scrollSpeed: self.getVelocity() * 0.005,
              duration: 0.9,
              overwrite: true,
            });
          },
        },
      });

      // --- STEP 1: Move logo to center ---
      // tl.addLabel("initial");

      // Animate each spiral individually to center with rotation
      spirals.forEach((spiral, index) => {
        const delay = index * 0.3;

        // Move each spiral to center
        tl.to(
          spiral.group.position,
          {
            x: spiral.finalPosition.x,
            y: spiral.finalPosition.y,
            z: spiral.finalPosition.z,
            duration: 5,
            ease: "power1.inOut",
          },
          delay
        );

        // Rotate each spiral into place
        tl.to(
          spiral.group.rotation,
          {
            x: spiral.finalRotation.x,
            y: spiral.finalRotation.y,
            z: spiral.finalRotation.z,
            duration: 5,
            ease: "power1.inOut",
          },
          delay
        );
      });

      // --- STEP 3: Fade initial text ---
      tl.to(
        ".initial-text",
        { opacity: 0, duration: 3.5, ease: "power1.inOut" },
        "<-1"
      );

      tl.to(
        ".second-text",
        { opacity: 1, duration: 2.5, ease: "power1.inOut" },
        ">+1"
      );
      // tl.addLabel("rotation");
      tl.to(
        ".second-text",
        { opacity: 0, duration: 3, ease: "power1.inOut" },
        ">"
      );

      // --- STEP 4: Particle explosion ---

      tl.to(
        particlesMaterial.uniforms.uVisibility,
        { value: 1, duration: 5 },
        ">1"
      );
      tl.to(materials, { opacity: 0.0, duration: 0.5 }, "<");
      // tl.addLabel("particleConversion");
      tl.to(
        particlesMaterial.uniforms.uProgress,
        { value: 1, duration: 20, ease: "power1.inOut" },
        ">"
      );

      tl.to(
        camera,
        {
          fov: 5,
          duration: 50,
          ease: "power1.inOut",
          onUpdate: () => camera.updateProjectionMatrix(),
        },
        "<"
      );
      // tl.addLabel('beforeParticleFade', '>-5.5');
      tl.to(
        particlesMaterial.uniforms.uSizeMultiplier,
        { value: 0, duration: 2.5, ease: "power2.inOut" },
        ">-3"
      );
      if (
        flowingParticlesMaterialRef.current &&
        flowingParticlesMaterialRef.current.uniforms
      ) {
        tl.to(
          flowingParticlesMaterialRef.current.uniforms.uOpacity,
          {
            value: 0,
            duration: 1.5,
            ease: "power2.inOut",
          },
          ">-4"
        );
      }
      tl.to(
        particlesMaterial.uniforms.uVisibility,
        { value: 0, duration: 0.5, ease: "power2.inOut" },
        "<"
      );
      tl.addLabel("starfieldFadeIn", ">-1");
      // --- STEP 5: Fade in starfield (always mounted layer, no jump) ---
      tl.to(
        ".starfield-layer",
        {
          opacity: 1,
          duration: 3,
          ease: "power2.inOut",
        },
        ">-4"
      );
      // tl.addLabel('flyingText');

      // --- STEP 6: Flying text animation (merged) ---

      const flyingTexts = document.querySelectorAll(".text-wrapper");
      const textDuration = 8; // seconds each text animates
      const overlap = 0.3; // 30% overlap

      flyingTexts.forEach((el, i) => {
        const startTime = i === 0 ? ">" : `>-=${textDuration * overlap + 0.5}`;
        console.log(startTime);

        const labelName = `flyingText-${i}`;
        tl.addLabel(labelName, startTime);

        if (i === flyingTexts.length - 1) {
          tl.fromTo(
            el,
            { opacity: 0, scale: 0.1 },
            {
              opacity: 1,
              scale: 1.1,
              y: 0,
              ease: "power2.out",
              duration: textDuration * 0.6,
            },
            labelName
          );

          tl.to(
            el,
            {
              y: -300,
              opacity: 0,
              scale: 1.1,
              duration: textDuration,
              ease: "power2.inOut",
            },
            `>${textDuration * 0.4}`
          );
        } else {
          // 🔸 Normal animation for first 6 flying texts
          tl.fromTo(
            el,
            { opacity: 0, scale: 0.1 },
            {
              opacity: 0,
              scale: 1.1,
              ease: "power2.inOut",
              duration: textDuration,
              onUpdate: function () {
                const p = this.progress();
                const fade = Math.pow(Math.sin(p * Math.PI), 2.2);
                gsap.set(el, { opacity: fade });
              },
            },
            labelName
          );
        }
        // 🌌 Change Starfield direction after 6th flying text
        if (i === 5) {
          // index 5 = 6th text
          tl.to(
            window.starfieldUniforms.uDirection.value,
            {
              x: 0,
              y: 1,
              z: 0,
              duration: 2,
              ease: "power2.inOut",
            },
            `>${textDuration * 0.4}` // during fade transition to 7th
          );
        }
      });

      tl.to(
        ".starfield-layer",
        {
          opacity: 0,
          duration: 3,
          ease: "power2.inOut",
        },
        ">-1"
      );

      tl.addLabel("starfieldFadeOut");

      tl.to(
        flowingParticlesMaterialRef.current.uniforms.uOpacity,
        {
          value: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "<-3"
      );
      tl.addLabel("serviceSectionReveal");
      tl.to(
        ".next-section",
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power2.inOut",
        },
        ">0.5"
      );

      // --- STEP 7: Logo + service text synchronized animation ---

      const serviceCount = SERVICE_DATA.length;
      const TRANSITION_DURATION = 2.5;

      // reset all texts and logo
      gsap.set(".service-text", { opacity: 0 });
      gsap.set(".service-logo", { opacity: 0 });
      setActiveServiceIndex(0);

      tl.to(
        ".service-logo",
        {
          opacity: 1,
          duration: 2.8,
          ease: "power2.inOut",
        },
        ">-0.4"
      );

      tl.to(
        ".service-0",
        {
          opacity: 1,
          duration: 1.8,
          ease: "power2.inOut",
          onStart: () => setActiveServiceIndex(0),
        },
        "<"
      );

      for (let i = 1; i < serviceCount; i++) {
        const label = `service-${i}`;
        tl.addLabel(label, `>+1.2`);

        // fade out previous text
        tl.to(
          `.service-${i - 1}`,
          {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          `>+${TRANSITION_DURATION * 0.8}`
        ); // start mid-way for smooth crossfade

        // fade in next text and update logo slice simultaneously
        tl.to(
          `.service-${i}`,
          {
            opacity: 1,
            duration: 1,
            ease: "power2.inOut",
            onStart: () => setActiveServiceIndex(i),
            onReverseComplete: () => {
              requestAnimationFrame(() => {
                setActiveServiceIndex(i - 1 >= 0 ? i - 1 : 0);
              });
            },
          },
          "<"
        ); // overlap for smooth simultaneous transition
      }

      // 5️⃣ cleanup when scrolling past last service
      // tl.addLabel('serviceEnd', '>+1');
      tl.to(
        {},
        {
          duration: 0.1,
          onComplete: () => {
            // gsap.set('.service-text', { opacity: 0 });
            setActiveServiceIndex(serviceCount - 1);
          },
          onReverseComplete: () => {
            // gsap.set('.service-text', { opacity: 0 });
            setActiveServiceIndex(0);
          },
        },
        "serviceEnd"
      );
      // 5️⃣ Transition after last (7th) service text
      tl.addLabel("afterLastService", ">+1"); // small scroll gap after 7th text

      // Fade out flowing particles, service texts, and logo model
      tl.to(
        flowingParticlesMaterialRef.current.uniforms.uOpacity,
        {
          value: 0,
          duration: 4,
          ease: "power2.inOut",
        },
        ">+1"
      );

      // Slight upward movement for smooth exit
      tl.to(
        ".next-section",
        {
          y: -150,
          opacity: 0,
          duration: 4,
          ease: "power2.inOut",
        },
        "<"
      );

      tl.addLabel("statsReveal", ">+0.5");
      tl.to(
        ".statSection",
        {
          opacity: 1,
          duration: 3,
          ease: "power3.out",
        },
        "<-3"
      );
    }

    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    function animate() {
      if (particlesMaterial) {
        particlesMaterial.uniforms.uTime.value = performance.now() * 0.001;
      }
      // camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
      // camera.position.y += (mouseY * 5 - camera.position.y) * 0.02;
      renderer.render(scene, camera);
    }
    renderer.setAnimationLoop(animate);

    // Cleanup function
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      // Dispose of Three.js resources if component unmounts
    };
  }, []);

  return (
    <main className="relative bg-white  font-sans text-black">
      <Navbar />
      <div className="fixed inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <FlowingParticles
            flowAnimation={flowAnimation}
            materialRef={flowingParticlesMaterialRef}
          />
        </Canvas>
      </div>

      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 outline-none z-10"
      />

      {/* ✅ This container will hold all the text content */}
      <div className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-8">
          <div className="flex justify-between items-center w-full">
            {/* ✅ Placeholder for the logo space on the left */}
            <div className="w-1/2"></div>

            {/* ✅ Initial text on the right */}
            <div className="w-1/2 initial-text">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight text-black  ">
                One small step for your brand.
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Second text that appears on top */}
      <div className="fixed inset-x-0 top-[15%] z-20 pointer-events-none opacity-0 second-text text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-black">
          One <span className="text-purple-400">giant leap</span> towards the{" "}
          <br /> hall of fame.
        </h1>
      </div>

      <div className="scroll-container h-[1800vh]"></div>

      <div className="starfield-layer fixed inset-0 z-30 opacity-0 pointer-events-none">
        <StarfieldBackground />
        <div
          ref={flyingTextRef}
          className="fixed inset-0 flex items-center justify-center text-center pointer-events-none z-50"
        >
          {texts.map((t, i) => (
            <div key={i} className="absolute text-wrapper">
              <h1 className="text-8xl font-bold text-white">{t}</h1>
            </div>
          ))}
        </div>
      </div>

      <div className="next-section bg-black  text-white fixed inset-0 flex items-center justify-center opacity-0 z-50 ">
        <div className="service-logo fixed inset-0 opacity-1 ">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            {/* <primitive object={new AxesHelper(1)} /> */}
            <ScrollServiceLogo activeIndex={activeServiceIndex} />
          </Canvas>
        </div>

        {/* Service Texts beside logo */}
        <div className="absolute right-[10%] w-[400px] h-[200px] flex items-center justify-center text-left  space-y-6 service-texts ">
          {SERVICE_DATA.map((service, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 service-text service-${i} opacity-0 flex flex-col items-start justify-center`}
            >
              <h2 className={`text-6xl font-bold `}>{service.title}</h2>
              <p className="text-xl mt-2">{service.subtext}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="statSection opacity-0 z-0">
        <StatsSection />
      </div>
      <Footer />
    </main>
  );
};

export default Animation;

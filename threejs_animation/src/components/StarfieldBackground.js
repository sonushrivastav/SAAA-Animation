"use client";

import {
  BlendFunction,
  BloomEffect,
  EffectComposer,
  EffectPass,
  RenderPass,
} from "postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// 💡 Add the import for useControls from Leva
import { Leva, useControls } from "leva";

export default function StarfieldBackground({}) {
  const canvasRef = useRef(null);

  // 🌟 LEVA Controls Integration
  const controls = useControls({
    // Starfield Controls
    baseSpeed: {
      value: 0.5, // Used in the animate loop
      min: 0.01,
      max: 5.0,
      step: 0.01,
      label: "Base Speed",
    },
    spacing: { value: 87, min: 10, max: 200, step: 1, label: "Grid Spacing" }, // New control
    count: { value: 15, min: 1, max: 50, step: 1, label: "Grid Count" }, // New control
    sizeScale: {
      value: 200.0, // Used in uSizeScale uniform
      min: 100,
      max: 2000,
      step: 10,
      label: "Size Scale",
    },
    minOpacity: {
      value: 0.85,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Min Opacity",
    },
    maxOpacity: {
      value: 1.0,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Max Opacity",
    },
    opacityFalloff: {
      value: 500.0,
      min: 10,
      max: 2000,
      step: 10,
      label: "Opacity Falloff",
    },
    opacityOffset: {
      value: 140,
      min: -1000.0,
      max: 1000.0,
      step: 10,
      label: "Opacity Offset",
    },
    // Animation/Distortion Controls
    maxStretch: {
      value: 30.0, // Used in scroll listener
      min: 1.0,
      max: 100,
      step: 1,
      label: "Max Stretch X",
    },
    maxShrink: {
      value: 15.0, // Used in scroll listener
      min: 1.0,
      max: 50,
      step: 1,
      label: "Max Shrink Y",
    },
  });

  // ---

  function createCircleTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const cx = size / 2;
    const cy = size / 2;
    const coreR = Math.floor(size * 0.18); // smaller core for glow effect
    const outerR = Math.floor(size * 0.5); // glow radius

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true; // smooth gradient

    // Create radial gradient
    const gradient = ctx.createRadialGradient(cx, cy, coreR, cx, cy, outerR);
    gradient.addColorStop(0, "rgba(255,255,255,1)"); // core bright white
    gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)"); // fade out to transparent

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    // Create Three.js texture
    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    return tex;
  }

  const starData = useMemo(() => {
    const starPositions = [];
    const { spacing, count } = controls;
    const totalDepth = count * 10;

    for (let x = -count; x <= count; x++) {
      for (let y = -count; y <= count; y++) {
        if (y === 0 || x === 0) continue;
        for (let zLayer = -count; zLayer <= count; zLayer++) {
          const jitter = (Math.random() - 0.5) * 30;
          const z = zLayer * 40 + jitter;
          starPositions.push(x * spacing, y * spacing, z); // Using spacing control
        }
      }
    }

    const total = starPositions.length / 3;
    const sizes = new Float32Array(total);

    let zMin = Infinity,
      zMax = -Infinity;
    for (let i = 0; i < total; i++) {
      const z = starPositions[i * 3 + 2];
      if (z < zMin) zMin = z;
      if (z > zMax) zMax = z;
    }
    const zRange = zMax - zMin || 1.0;

    const minBase = 1.0;
    const maxBase = 14.0;

    for (let i = 0; i < total; i++) {
      const z = starPositions[i * 3 + 2];
      const normalized = (z - zMin) / zRange;
      const biased = Math.pow(normalized, 0.9);
      const base = minBase + biased * (maxBase - minBase);
      sizes[i] = base * (0.85 + Math.random() * 0.35);
    }

    return { starPositions, sizes, totalDepth, total };
  }, [controls.spacing, controls.count]);

  useEffect(() => {
    // We use the destructured values from the controls
    const { baseSpeed, spacing, count, sizeScale, maxStretch, maxShrink } =
      controls;

    const { starPositions, sizes, totalDepth, total } = starData;
    // Store globally so other component can use
    window.globalStarPositions = starPositions;

    const loader = new THREE.TextureLoader();
    const star = loader.load("/images/sp2.png");
    const scene = new THREE.Scene();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    new RGBELoader().load("/images/studio_small_03_1k.hdr", (hdrMap) => {
      hdrMap.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = hdrMap;
    });
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 🌟 Add postprocessing composer
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomEffect = new BloomEffect({
      intensity: 1.8, // controls glow brightness
      luminanceThreshold: 0.02, // lower = more glow
      luminanceSmoothing: 1.9,
      blendFunction: BlendFunction.ADD,
    });

    const bloomPass = new EffectPass(camera, bloomEffect);
    composer.addPass(bloomPass);

    // const colors = new Float32Array(total * 3);
    // const color = new THREE.Color();

    // for (let i = 0; i < total; i++) {
    //   // ✨ Generate a random color for each star
    //   color.setHSL(Math.random(), 0.7, 0.6);

    //   // ✨ Store the R, G, B components in the array
    //   colors[i * 3] = color.r;
    //   colors[i * 3 + 1] = color.g;
    //   colors[i * 3 + 2] = color.b;
    // }

    // starsGeometry.setAttribute(
    //   "color",
    //   new THREE.Float32BufferAttribute(colors, 3)
    // );

    // 🌈 Set single color for all particles
    const colors = new Float32Array(total * 3);
    const color = new THREE.Color();
    color.set("#ab76e2"); // 👈 change this hex value to your desired color

    for (let i = 0; i < total; i++) {
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    // Attach color attribute to geometry

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starPositions, 3)
    );
    starsGeometry.setAttribute(
      "aSize",
      new THREE.Float32BufferAttribute(sizes, 1)
    );
    starsGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    const starTexture = createCircleTexture();

    // 💡 Use sizeScale from controls
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: starTexture },
        uSizeScale: { value: controls.sizeScale },
        uStretchX: { value: 1.0 },
        uShrinkY: { value: 1.0 },
        uTime: { value: 0 },
        uSpiralProgress: { value: 0 },
        uMergeProgress: { value: 0 },
        uDirection: { value: new THREE.Vector3(0, 0, 1) }, // starts moving along Z-axis
        uSpeed: { value: controls.baseSpeed },

        uMinOpacity: { value: controls.minOpacity },
        uMaxOpacity: { value: controls.maxOpacity },
        uOpacityFalloff: { value: controls.opacityFalloff },
        uOpacityOffset: { value: controls.opacityOffset },
        vertexColors: true,
      },
      vertexShader: `
        attribute float aSize;
        attribute float aSpiral;
        attribute vec3 color;

        varying vec3 vColor;
        varying float vDepth;

        uniform float uSizeScale;
        uniform float uTime;
        uniform float uSpiralProgress;
        uniform float uMergeProgress;

        void main() {
          vec3 pos = position;

          vColor = color;

          // Spiral effect (unchanged)
          if (aSpiral > 0.5) {
            float angle = uTime * 2.0 + pos.z * 0.05;
            float radius = length(pos.xy) * (1.0 - uMergeProgress);

            vec3 spiralPos = vec3(
              cos(angle) * radius,
              sin(angle) * radius,
              pos.z
            );

            pos = mix(pos, spiralPos, uSpiralProgress);
          }

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          float depth = -mvPos.z;
          float safeDepth = max(8.0, depth);
          float perspective = uSizeScale / safeDepth;

          float size = aSize * perspective;
          size = clamp(size, 1.0, 160.0);

          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = size;

          vDepth = depth;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uStretchX;
        uniform float uShrinkY;
        varying vec3 vColor;
        varying float vDepth;

        uniform float uMinOpacity;
        uniform float uMaxOpacity;
        uniform float uOpacityFalloff;
        uniform float uOpacityOffset;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;

          // elongate vertically and shrink horizontally
          uv.x *= uStretchX;
          uv.y /= uShrinkY;

          uv += 0.5;

          vec4 tex = texture2D(uTexture, uv);
          if (tex.a < 0.05) discard;

          // Calculate opacity based on depth
          float normalizedDepth = clamp((vDepth + uOpacityOffset) / uOpacityFalloff, 0.0, 1.0);
          float finalOpacity = mix(uMaxOpacity, uMinOpacity, normalizedDepth);

          gl_FragColor = tex * vec4(vColor, finalOpacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    window.starfieldUniforms = material.uniforms;
    window.starfieldTotalDepth = totalDepth;
    const stars = new THREE.Points(starsGeometry, material);
    scene.add(stars);
    // gsap.to(camera.position, {
    //     z: 0,
    //     duration: 4,
    //     ease: 'power2.out',
    //     delay: 0.2,
    //     onUpdate: () => {
    //         camera.updateProjectionMatrix();
    //     },
    // });
    let lastScroll = window.scrollY;
    let scrollSpeed = 0;
    let velocity = 0;
    let targetSpeed = 0;

    window.addEventListener("scroll", () => {
      const newScroll = window.scrollY;
      velocity = newScroll - lastScroll;
      lastScroll = newScroll;
      scrollSpeed += velocity * 0.05;

      // 💡 Use maxStretch and maxShrink from controls
      // const stretchX = 1.0 + Math.min(Math.abs(velocity) * 0.08, maxStretch);
      // const shrinkY = 1.0 + Math.min(Math.abs(velocity) * 0.05, maxShrink);

      // gsap.to(material.uniforms.uStretchX, {
      //   value: stretchX,
      //   duration: 0.5,
      //   ease: "power2.out",
      //   onComplete: () => {
      //     gsap.to(material.uniforms.uStretchX, {
      //       value: 1.0,
      //       duration: 0.5,
      //       ease: "power2.out",
      //     });
      //   },
      // });

      // gsap.to(material.uniforms.uShrinkY, {
      //   value: shrinkY,
      //   duration: 0.5,
      //   ease: "power2.out",
      //   onComplete: () => {
      //     gsap.to(material.uniforms.uShrinkY, {
      //       value: 1.0,
      //       duration: 0.5,
      //       ease: "power2.out",
      //     });
      //   },
      // });
    });

    // 🖱 Mouse parallax
    const mouse = { x: 0, y: 0 };
    document.addEventListener("mousemove", (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = () => {
      material.uniforms.uTime.value = performance.now() / 1000;

      // Smoothly interpolate to target speed for fluid motion
      scrollSpeed += (targetSpeed - scrollSpeed) * 0.1;

      // Always move forward with baseSpeed, add scroll speed for reverse effect
      const currentSpeed = baseSpeed + scrollSpeed;

      // Move stars backward/forward based on total speed
      // Move stars along the current direction
      // 🌌 Move stars along direction vector
      const dir = material.uniforms.uDirection.value;
      stars.position.addScaledVector(dir, currentSpeed);

      // 🌠 Axis-agnostic wrapping
      const total = window.starfieldTotalDepth || totalDepth;
      const half = total / 2;

      if (
        Math.abs(dir.z) >= Math.abs(dir.x) &&
        Math.abs(dir.z) >= Math.abs(dir.y)
      ) {
        if (stars.position.z > half) stars.position.z -= total;
        if (stars.position.z < -half) stars.position.z += total;
      } else if (
        Math.abs(dir.y) >= Math.abs(dir.x) &&
        Math.abs(dir.y) >= Math.abs(dir.z)
      ) {
        if (stars.position.y > half) stars.position.y -= total;
        if (stars.position.y < -half) stars.position.y += total;
      } else {
        if (stars.position.x > half) stars.position.x -= total;
        if (stars.position.x < -half) stars.position.x += total;
      }

      // Decay scroll speed - returns to 0, leaving only baseSpeed
      targetSpeed *= 0.85;

      camera.position.x += (mouse.x * 15 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 15 - camera.position.y) * 0.03;
      // stars.position.x += (mouse.x * 15 - stars.position.x) * 0.03;
      // stars.position.y += (mouse.y * 15 - stars.position.y) * 0.03;

      // renderer.render(scene, camera);
      composer.render();
    };
    renderer.setAnimationLoop(animate);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      renderer.setAnimationLoop(null); // Use null instead of cancelAnimationFrame(animate) for modern usage
      window.removeEventListener("scroll", () => {}); // Need to properly remove the scroll listener
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      starTexture.dispose();
      material.dispose();
      starsGeometry.dispose();
    };
  }, [controls, starData]);

  return (
    <>
      <Leva hidden />

      <div className="fixed inset-0 z-0 bg-[#0f0f0f] ">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </>
  );
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { Leva, useControls } from "leva";

export default function StarfieldBackground({}) {
  const canvasRef = useRef(null);

  // 🌟 LEVA Controls Integration
  const controls = useControls({
    // Starfield Controls
    baseSpeed: {
      value: 0.5,
      min: 0.01,
      max: 5.0,
      step: 0.01,
      label: "Base Speed",
    },
    spacing: { value: 87, min: 10, max: 200, step: 1, label: "Grid Spacing" },
    count: { value: 15, min: 1, max: 50, step: 1, label: "Grid Count" },
    sizeScale: {
      value: 150.0,
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
    // 🌠 New Streak Controls
    streakLength: {
      value: 2.5,
      min: 0.0,
      max: 10.0,
      step: 0.1,
      label: "Streak Length",
    },
    streakIntensity: {
      value: 0.8,
      min: 0.0,
      max: 1.0,
      step: 0.01,
      label: "Streak Intensity",
    },
    streakThreshold: {
      value: 0.3,
      min: 0.0,
      max: 2.0,
      step: 0.05,
      label: "Speed Threshold",
    },
  });

  function createCircleTexture() {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const cx = size / 2;
    const cy = size / 2;
    const coreR = Math.floor(size * 0.18);
    const outerR = Math.floor(size * 0.5);

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;

    const gradient = ctx.createRadialGradient(cx, cy, coreR, cx, cy, outerR);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.4, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    return tex;
  }

  // 🌠 New function to create streak/trail texture
  function createStreakTexture() {
    const width = 128;
    const height = 512; // Longer for trail effect
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;

    // Create vertical gradient for streak
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255,255,255,1)"); // Bright head
    gradient.addColorStop(0.1, "rgba(255,255,255,0.9)");
    gradient.addColorStop(0.3, "rgba(200,220,255,0.6)"); // Slight blue tint
    gradient.addColorStop(0.6, "rgba(180,200,255,0.3)");
    gradient.addColorStop(1, "rgba(150,180,255,0)"); // Fade to transparent

    // Draw elongated ellipse
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      width / 2,
      height / 2,
      width / 3,
      height / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

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
          starPositions.push(x * spacing, y * spacing, z);
        }
      }
    }

    const total = starPositions.length / 3;
    const sizes = new Float32Array(total);
    const randomValues = new Float32Array(total); // For variation

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
      randomValues[i] = Math.random(); // Store random value for each particle
    }

    return { starPositions, sizes, randomValues, totalDepth };
  }, [controls.spacing, controls.count]);

  useEffect(() => {
    const { baseSpeed, spacing, count, sizeScale } = controls;
    const { starPositions, sizes, randomValues, totalDepth } = starData;

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
      "aRandom",
      new THREE.Float32BufferAttribute(randomValues, 1)
    );

    const starTexture = createCircleTexture();
    const streakTexture = createStreakTexture();

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: starTexture },
        uStreakTexture: { value: streakTexture },
        uSizeScale: { value: controls.sizeScale },
        uTime: { value: 0 },
        uDirection: { value: new THREE.Vector3(0, 0, 1) },
        uSpeed: { value: controls.baseSpeed },
        uMinOpacity: { value: controls.minOpacity },
        uMaxOpacity: { value: controls.maxOpacity },
        uOpacityFalloff: { value: controls.opacityFalloff },
        uOpacityOffset: { value: controls.opacityOffset },

        // 🌠 Streak uniforms
        uStreakLength: { value: controls.streakLength },
        uStreakIntensity: { value: controls.streakIntensity },
        uVelocity: { value: new THREE.Vector3(0, 0, 0) },
        uStreakThreshold: { value: controls.streakThreshold },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aRandom;

        varying float vDepth;
        varying float vSize;
        varying float vRandom;
        varying vec3 vPosition;
        varying vec3 vVelocity;

        uniform float uSizeScale;
        uniform float uTime;
        uniform vec3 uDirection;
        uniform vec3 uVelocity;

        void main() {
          vec3 pos = position;
          vPosition = pos;
          vRandom = aRandom;
          vVelocity = uVelocity;

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          float depth = -mvPos.z;
          float safeDepth = max(8.0, depth);
          float perspective = uSizeScale / safeDepth;

          float size = aSize * perspective;
          size = clamp(size, 1.0, 160.0);
          vSize = size;

          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = size;

          vDepth = depth;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        uniform sampler2D uStreakTexture;
        uniform float uMinOpacity;
        uniform float uMaxOpacity;
        uniform float uOpacityFalloff;
        uniform float uOpacityOffset;
        uniform float uStreakLength;
        uniform float uStreakIntensity;
        uniform vec3 uDirection;
        uniform float uStreakThreshold;

        varying float vDepth;
        varying float vSize;
        varying float vRandom;
        varying vec3 vPosition;
        varying vec3 vVelocity;

        void main() {
          vec2 uv = gl_PointCoord;
          
          // Calculate velocity magnitude
          float velocityMag = length(vVelocity);
          
          // Determine if we should show streak based on velocity and direction
          float isVertical = abs(uDirection.y);
          float showStreak = step(uStreakThreshold, velocityMag) * isVertical;
          
          // Calculate streak effect
          vec2 streakUV = uv;
          
          // Stretch UV based on velocity direction
          if (showStreak > 0.5) {
            // Align streak with movement direction
            vec2 dir = normalize(vVelocity.xy);
            float angle = atan(dir.y, dir.x) + 3.14159 / 2.0;
            
            // Rotate UV coordinates
            vec2 centered = uv - 0.5;
            float cosA = cos(angle);
            float sinA = sin(angle);
            streakUV = vec2(
              centered.x * cosA - centered.y * sinA,
              centered.x * sinA + centered.y * cosA
            ) + 0.5;
            
            // Stretch vertically for streak
            streakUV.y = (streakUV.y - 0.5) * (1.0 + velocityMag * uStreakLength) + 0.5;
          }
          
          // Sample textures
          vec4 dotColor = texture2D(uTexture, uv);
          vec4 streakColor = texture2D(uStreakTexture, streakUV);
          
          // Blend between dot and streak based on velocity
          float streakBlend = showStreak * uStreakIntensity * smoothstep(uStreakThreshold, uStreakThreshold + 0.5, velocityMag);
          vec4 finalTexture = mix(dotColor, streakColor, streakBlend);
          
          // Add brightness boost for fast-moving particles
          float speedBoost = 1.0 + (velocityMag * 0.3);
          finalTexture.rgb *= speedBoost;
          
          if (finalTexture.a < 0.05) discard;

          // Calculate opacity based on depth
          float normalizedDepth = clamp((vDepth + uOpacityOffset) / uOpacityFalloff, 0.0, 1.0);
          float finalOpacity = mix(uMaxOpacity, uMinOpacity, normalizedDepth);

          // Add subtle color variation to streaks
          vec3 streakTint = vec3(0.9, 0.95, 1.0); // Slight blue-white tint
          vec3 finalColor = mix(vec3(1.0), streakTint, streakBlend * 0.5);

          gl_FragColor = vec4(finalColor, finalOpacity) * finalTexture;
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

    let lastScroll = window.scrollY;
    let scrollSpeed = 0;
    let velocity = 0;
    let targetSpeed = 0;
    let lastPosition = new THREE.Vector3();
    let currentVelocity = new THREE.Vector3();

    window.addEventListener("scroll", () => {
      const newScroll = window.scrollY;
      velocity = newScroll - lastScroll;
      lastScroll = newScroll;
      scrollSpeed += velocity * 0.05;
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

      // Calculate velocity for streak effect
      const dir = material.uniforms.uDirection.value;
      const movement = dir.clone().multiplyScalar(currentSpeed);

      // Calculate actual velocity (change in position)
      const newPosition = stars.position.clone();
      currentVelocity.copy(newPosition).sub(lastPosition);
      lastPosition.copy(newPosition);

      // Update velocity uniform for shader
      material.uniforms.uVelocity.value.copy(currentVelocity);

      // Move stars along the current direction
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

      // Decay scroll speed
      targetSpeed *= 0.85;

      camera.position.x += (mouse.x * 15 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 15 - camera.position.y) * 0.03;

      renderer.render(scene, camera);
    };
    renderer.setAnimationLoop(animate);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      starTexture.dispose();
      streakTexture.dispose();
      material.dispose();
      starsGeometry.dispose();
    };
  }, [controls, starData]);

  return (
    <>
      <Leva hidden={false} />

      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_bottom,_#352355,_#0F0F0F,_#352355)]">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </>
  );
}

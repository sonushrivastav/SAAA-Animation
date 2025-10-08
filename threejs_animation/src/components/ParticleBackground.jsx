"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoModel } from "./LogoModel";
import { useControls } from "leva";

gsap.registerPlugin(ScrollTrigger);

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

// Create a few flow lines similar to your sketch
function createCurves(curveSpread = 1.5, yCurve = 1, zCurve = 1) {
  const curves = [];
  const numLines = 25; // number of flow lines
  const width = 22;

  for (let i = 0; i < numLines; i++) {
    const x = THREE.MathUtils.lerp(-width / 2, width / 2, i / (numLines - 1));
    console.log(x);

    const points = [];

    // top straight segment
    points.push(new THREE.Vector3(x * curveSpread, 22 + yCurve, -6 + zCurve));

    // gradually curve downward and outward
    points.push(
      new THREE.Vector3(x * 0.8 * curveSpread, 2 + yCurve, -3 + zCurve)
    );
    points.push(
      new THREE.Vector3(x * 1.2 * curveSpread, 0 + yCurve, 0 + zCurve)
    );
    points.push(
      new THREE.Vector3(x * 1.5 * curveSpread, -2 + yCurve, 3 + zCurve)
    );
    points.push(
      new THREE.Vector3(x * 2.0 * curveSpread, -3 + yCurve, 5 + zCurve)
    );

    curves.push(new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5));
  }
  return curves;
}

function FlowingParticles() {
  const groupRef = useRef();
  const lastScrollY = useRef(0);
    const flowMultiplierAnim = useRef({ value: 1 });
  const directionAnim = useRef({ value: 1 });

  const { particleSize, flowSpeed, curveSpread, yCurve, zCurve } = useControls({
    particleSize: { value: 0.28, min: 0.1, max: 0.5, step: 0.005 },
    flowSpeed: { value: 1, min: 0.1, max: 3, step: 0.005 },
    yCurve: { value: -3.4, min: -10, max: 13, step: 0.005 },
    zCurve: { value: -2.44, min: -10, max: 13, step: 0.005 },
    curveSpread: { value: 2.12, min: 0.5, max: 3, step: 0.005 },
  });

  const curves = useMemo(
    () => createCurves(curveSpread, yCurve, zCurve),
    [curveSpread, yCurve, zCurve]
  );

  const countPerCurve =   50;
  const totalParticles = curves.length * countPerCurve;

  // initial positions (will be updated each frame)
  const positions = useMemo(() => {
    const arr = new Float32Array(totalParticles * 3);
    // use getPointAt with evenly spaced u along arc length to get stable initial layout
    let i3 = 0;
    for (let i = 0; i < totalParticles; i++) {
      const curveIndex = Math.floor(i / countPerCurve);
      const idxInCurve = i % countPerCurve;
      // u in [0,1], evenly spaced using countPerCurve-1 to include endpoint
      const u = idxInCurve / Math.max(1, countPerCurve - 1);
      const pos = curves[curveIndex].getPointAt(u);
      arr[i3++] = pos.x;
      arr[i3++] = pos.y;
      arr[i3++] = pos.z;
    }
    return arr;
  }, [curves, totalParticles, countPerCurve]);

  const speeds = useMemo(
    () => new Float32Array(totalParticles).map(() => 0.02 + 0.01),
    [totalParticles]
  );

  // offsets: initial normalized positions along curve (even distribution)
  const offsets = useMemo(() => {
    const o = new Float32Array(totalParticles);
    for (let i = 0; i < totalParticles; i++) {
      const idxInCurve = (i % countPerCurve );
      o[i] = idxInCurve / Math.max(1, countPerCurve );
    }
    return o;
  }, [totalParticles, countPerCurve]);

  // Smooth scroll-based animation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (delta > 0) {
        gsap.killTweensOf(directionAnim.current);
        gsap.to(directionAnim.current, { value: 1, duration: 0.18, ease: "power2.out" });
      } else if (delta < 0) {
        gsap.killTweensOf(directionAnim.current);
        gsap.to(directionAnim.current, { value: -1, duration: 0.18, ease: "power2.out" });
      }

      const speedFactor = Math.min(Math.abs(delta) / 200, 2);
      gsap.killTweensOf(flowMultiplierAnim.current);
      gsap.to(flowMultiplierAnim.current, {
        value: 1 + speedFactor,
        duration: 0.28,
        ease: "power3.out",
        onComplete: () => gsap.to(flowMultiplierAnim.current, { value: 1, duration: 0.3, ease: "power1.out" }),
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const positionsArray = groupRef.current.geometry.attributes.position.array;
    const time = state.clock.elapsedTime;
    const dir = directionAnim.current.value;
    const fm = flowMultiplierAnim.current.value;

    // update positions along each curve using getPointAt(u) for uniform distribution along arc length
    let idx = 0;
    for (let i = 0; i < totalParticles; i++) {
      const curveIndex = Math.floor(i / countPerCurve);
      const speed = speeds[i];
      // compute u in [0,1] (arc-length normalized)
      let u = (offsets[i] + time * speed * flowSpeed * dir * fm * 1.22) % 1;
      if (u < 0) u += 1;

      // use getPointAt for even spacing along arc-length
      const pos = curves[curveIndex].getPointAt(u);
      positionsArray[idx++] = pos.x;
      positionsArray[idx++] = pos.y;
      positionsArray[idx++] = pos.z;
    }

    groupRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={groupRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        map={createCircleTexture()}
        color="#AB76E2"
        opacity={0.8}
        transparent
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function FlowingCurvedParticles() {
  const containerRef = useRef();

  return (
    <div
      ref={containerRef}
      className="w-full h-full fixed inset-0 top-0 left-0 "
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 5 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <LogoModel />
        <FlowingParticles />
      </Canvas>

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-cyan-400 text-3xl font-bold tracking-widest">
          Flowing Energy Field
        </h1>
      </div>
    </div>
  );
}

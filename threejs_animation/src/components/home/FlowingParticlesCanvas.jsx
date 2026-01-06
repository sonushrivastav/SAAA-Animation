// src/components/home/FlowingParticlesCanvas.jsx
"use client";

import { Canvas } from "@react-three/fiber";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// ✅ Dynamic import for FlowingParticles
const FlowingParticles = dynamic(
  () => import("../../components/homepage/ParticleBackground"),
  { ssr: false }
);

export default function FlowingParticlesCanvas({ flowAnimation, materialRef }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Suspense fallback={null}>
        <FlowingParticles
          flowAnimation={flowAnimation}
          materialRef={materialRef}
        />
      </Suspense>
    </Canvas>
  );
}
"use client";

import {
  Environment,
  MeshTransmissionMaterial,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import html2canvas from "html2canvas";

function useDOMAsEnvMap(selector) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    const element = document.querySelector(selector);
    if (!element) return;

    let frame;

    const capture = async () => {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        useCORS: true,
        scale: 0.4, // performance safe
      });

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;

      // FIX HERE
      tex.colorSpace = THREE.SRGBColorSpace;

      setTexture(tex);

      frame = requestAnimationFrame(capture);
    };

    capture();
    return () => cancelAnimationFrame(frame);
  }, [selector]);

  return texture;
}

function FloatingGlass({
  color = "#ffffff",
  speed = 1,
  amplitude = 0.05,
  rotationSpeed = 0.002,
  motionVariant = 0,
  mouseInfluence = false,
  envMap,
}) {
  const ref = useRef();
  const { nodes } = useGLTF("/models/Logo.glb");

  const mouse = useRef({ x: 0, y: 0 });

  // Mouse influence
  useEffect(() => {
    if (!mouseInfluence) return;

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseInfluence]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    // Floating motion paths
    const mesh = ref.current;

    switch (motionVariant) {
      case 0:
        mesh.rotation.y += rotationSpeed;
        mesh.position.x = Math.sin(t) * amplitude;
        mesh.position.y = Math.cos(t * 0.8) * amplitude * 0.8;
        break;
      case 1:
        mesh.rotation.y -= rotationSpeed * 0.7;
        mesh.position.x = Math.cos(t * 1.2) * amplitude * 1.2;
        mesh.position.y = Math.sin(t * 0.7) * amplitude * 0.9;
        break;
      case 2:
        mesh.rotation.x += rotationSpeed * 1.5;
        mesh.position.x = Math.sin(t * 0.6) * amplitude;
        mesh.position.y = Math.cos(t * 1.4) * amplitude;
        break;
      case 3:
        mesh.rotation.y += rotationSpeed * 0.5;
        mesh.rotation.x -= rotationSpeed * 0.2;
        mesh.position.x = Math.cos(t * 0.9) * amplitude * 0.7;
        mesh.position.y = Math.sin(t * 1.1) * amplitude;
        break;
    }

    // Mouse parallax
    if (mouseInfluence) {
      mesh.position.x += mouse.current.x * 0.05;
      mesh.position.y += mouse.current.y * 0.05;
    }
  });

  return (
    <mesh
      ref={ref}
      geometry={nodes.Text002.geometry}
      scale={[2, 2, 2]}
      rotation={[Math.PI / 2, Math.PI, 0.1]}
    >
      <MeshTransmissionMaterial
        // Glass look
        color={color}
        thickness={1.5}
        roughness={0}
        transmission={1}
        ior={1.2}
        chromaticAberration={0.03}
        backside={true}
        // ⭐ The magic: LiquidEther DOM background as envMap
        envMap={envMap}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

export default function ThreeGlass({
  color = "#844DE9",
  speed = 1,
  amplitude = 0.05,
  rotationSpeed = 0.002,
  motionVariant = 0,
  mouseInfluence = false,
}) {
  // Capture LiquidEther (your background div)
  const liquidEnv = useDOMAsEnvMap(".liquid-ether-bg");
  // ADD THIS CLASS to your LiquidEther wrapper div

  return (
    <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 1], fov: 75 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 2, 2]} intensity={2} />

      <Environment preset="city" />

      <FloatingGlass
        color={color}
        speed={speed}
        amplitude={amplitude}
        rotationSpeed={rotationSpeed}
        motionVariant={motionVariant}
        mouseInfluence={mouseInfluence}
        envMap={liquidEnv}
      />

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}

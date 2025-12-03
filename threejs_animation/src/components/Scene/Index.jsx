"use client";
import { Canvas } from "@react-three/fiber";
import Model from "./Model";
import { Environment, OrbitControls } from "@react-three/drei";

export default function Index() {
  return (
    <Canvas
      camera={{ position: [0, 1, 3], fov: 45 }}
      style={{ background: "green", width: "100%", height: "100vh" }}
    >
      <directionalLight intensity={2} position={[2, 2, 3]} />
      <OrbitControls />
      <color attach="background" args={["#1fc1d6"]} />
      <Model />
      {/* <Environment preset="city" /> */}
    </Canvas>
  );
}

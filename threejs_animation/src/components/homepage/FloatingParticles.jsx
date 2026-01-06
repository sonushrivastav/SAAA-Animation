// "use client";
// import { useFrame, useThree } from "@react-three/fiber";
// import { useMemo, useRef } from "react";
// import * as THREE from "three";

// export default function FloatingParticles() {
//   const count = 500;
//   const pointsRef = useRef();
//   const ringGroupRef = useRef();
//   const materialRef = useRef();
//   const { mouse } = useThree();

//   // 🌌 Particle positions
//   const positions = useMemo(() => {
//     const arr = new Float32Array(count * 3);
//     for (let i = 0; i < count; i++) {
//       arr[i * 3 + 0] = (Math.random() - 0.5) * 10;
//       arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
//       arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
//     }
//     return arr;
//   }, []);

//   //Memoized geometry
//   const geometry = useMemo(() => {
//     const g = new THREE.BufferGeometry();
//     g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
//     return g;
//   }, [positions]);

//   // 💡 Particle material
//   const material = useMemo(() => {
//     return new THREE.PointsMaterial({
//       color: new THREE.Color("#8f5aff"),
//       size: 0.03,
//       transparent: true,
//       opacity: 0.6,
//       blending: THREE.AdditiveBlending,
//       depthWrite: false,
//     });
//   }, []);

//   // Store material ref for animation updates
//   materialRef.current = material;

//   // 🔄 Memoized ring data (not full JSX, just config)
//   const ringConfigs = useMemo(() => {
//     return [0, 1, 2].map((i) => ({
//       position: [0, -3.5 + i * 1.15, 0],
//       innerRadius: 6.5 - i * 0.4,
//       outerRadius: 7 - i * 0.4,
//     }));
//   }, []);

//   // 🎮 Animations - optimized
//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime();

//     // 🌠 Smooth blinking of particles
//     if (materialRef.current) {
//       materialRef.current.opacity = 0.4 + Math.sin(t * 2) * 0.3;
//     }

//     // 🌫️ Subtle floating effect
//     if (pointsRef.current) {
//       pointsRef.current.rotation.y += 0.001;
//       pointsRef.current.position.y = Math.sin(t * 0.3) * 0.001;
//     }

//     // 🌀 Rings react to mouse
//     if (ringGroupRef.current) {
//       ringGroupRef.current.rotation.z = mouse.x * 0.005;
//       ringGroupRef.current.rotation.x = mouse.y * 0.3;
//     }
//   });

//   // 🔄 Create circular rings (multiple stacked circles)
// //   const rings = useMemo(() => {
// //     const arr = [];
// //     for (let i = 0; i < 3; i++) {
// //       arr.push(
// //         <mesh
// //           key={i}
// //           rotation={[-Math.PI / 2, 0, 0]}
// //           position={[0, -3.5 + i * 1.15, 0]}
// //         >
// //           <ringGeometry args={[6.5 - i * 0.4, 7 - i * 0.4, 64]} />
// //           <meshStandardMaterial
// //             color={"#8f5aff"}
// //             transparent
// //             opacity={0.2}
// //             emissive={"#7722ff"}
// //             emissiveIntensity={1.5}
// //             side={THREE.DoubleSide}
// //           />
// //         </mesh>
// //       );
// //     }
// //     return arr;
// //   }, []);

//   // 🎮 Animations
// //   useFrame(({ clock }) => {
// //     const t = clock.getElapsedTime();

// //     // 🌠 Smooth blinking of particles
// //     material.opacity = 0.4 + Math.sin(t * 2) * 0.3;

// //     // 🌫️ Subtle floating effect
// //     if (pointsRef.current) {
// //       pointsRef.current.rotation.y += 0.001;
// //       pointsRef.current.position.y = Math.sin(t * 0.3) * 0.001;
// //     }

// //     // 🌀 Rings react to mouse
// //     if (ringGroupRef.current) {
// //       ringGroupRef.current.rotation.z = mouse.x * 0.005;
// //       ringGroupRef.current.rotation.x = mouse.y * 0.3;
// //     }
// //   });

//   return (
//     <>
//       {/* <group ref={ringGroupRef}>{rings}</group>
//       <points ref={pointsRef} args={[geometry, material]} /> */}
//       <group ref={ringGroupRef}>
//         {ringConfigs.map((ring, i) => (
//           <mesh
//             key={i}
//             rotation={[-Math.PI / 2, 0, 0]}
//             position={ring.position}
//           >
//             <ringGeometry args={[ring.innerRadius, ring.outerRadius, 64]} />
//             <meshStandardMaterial
//               color="#8f5aff"
//               transparent
//               opacity={0.2}
//               emissive="#7722ff"
//               emissiveIntensity={1.5}
//               side={THREE.DoubleSide}
//             />
//           </mesh>
//         ))}
//       </group>
//       <points ref={pointsRef} geometry={geometry} material={material} />
//     </>
//   );
// }

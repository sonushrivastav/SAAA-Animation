// src/components/AnimationScene.jsx
"use client";
import { useEffect, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { forwardRef } from "react";

// Register the GSAP plugin once, can be in your main app file or here
gsap.registerPlugin(ScrollTrigger);

// Helper function to create the texture
function createCircleTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 4, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

// This is the main refactored 3D component
export function MainAnimation({
  logoGroupRef,
  particlesMaterialRef,
  allMaterialsRef,
  onSceneReady,
}) {
  const { scene, camera } = useThree(); // R3F hook to access the scene and camera
  const gltf = useGLTF("/models/T3d.glb"); // R3F hook for loading models

  // Refs to hold our Three.js objects
  //   const logoGroupRef = useRef();
  const particlesRef = useRef();
  //   const particlesMaterialRef = useRef();

  // Memoize complex objects so they are not recreated on every render
  const { particlesGeometry, allMaterials } = useMemo(() => {
    if (!gltf.scene) return { particlesGeometry: null, allMaterials: [] };

    const spiralConfigs = [
      { s: 6, p: [-1.1, 1.1, 0], r: [Math.PI / 2.12, 0.0, 0.0] },
      { s: 6, p: [-1.4, 0.7, 0], r: [Math.PI / 2.1, 0.4, 0.0] },
      { s: 5.8, p: [-1.5, 0.25, 0], r: [Math.PI / 2.2, 0.8, 0.0] },
      { s: 5.6, p: [-1.4, -0.2, 0], r: [Math.PI / 2.4, 1.2, 0.0] },
      { s: 5.3, p: [-1.1, -0.54, 0], r: [Math.PI / 2.6, 1.65, 0.0] },
      { s: 4.5, p: [-0.75, -0.7, 0], r: [Math.PI / 3, 2.1, 0.0] },
      { s: 3.8, p: [-0.46, -0.8, -0.11], r: [Math.PI / 3, 2.5, 0.0] },
    ];

    // Create the logo group for particle sampling
    const samplingGroup = new THREE.Group();
    samplingGroup.scale.set(1.15, 1.15, 1.15);
    samplingGroup.position.set(0, -2, 2); // Final centered position for correct sampling
    samplingGroup.rotation.set(-0.2, 0.6 - Math.PI / 4, 0 - Math.PI / 2);

    const materials = [];
    const geometries = [];

    spiralConfigs.forEach((config) => {
      const modelClone = gltf.scene.clone();
      modelClone.scale.setScalar(config.s);
      modelClone.position.fromArray(config.p);
      modelClone.rotation.fromArray(config.r);
      samplingGroup.add(modelClone);
    });

    samplingGroup.updateWorldMatrix(true, true);

    samplingGroup.traverse((child) => {
      if (child.isMesh) {
        const geometry = child.geometry.clone();
        geometry.applyMatrix4(child.matrixWorld);
        geometries.push(geometry);
        // We also need materials for the visible logo
        const newMaterial = child.material.clone();
        newMaterial.transparent = true;
        newMaterial.depthWrite = false;
        materials.push(newMaterial);
      }
    });

    // Create particle system from the sampled group
    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
    const sampler = new MeshSurfaceSampler(
      new THREE.Mesh(mergedGeometry)
    ).build();
    const numParticles = 2000;
    const pGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(numParticles * 3);
    const randoms = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);
    // const colors = new Float32Array(numParticles * 3);

    for (let i = 0; i < numParticles; i++) {
      const newPosition = new THREE.Vector3();
      sampler.sample(newPosition);
      positions.set([newPosition.x, newPosition.y, newPosition.z], i * 3);
      randoms.set(
        [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ],
        i * 3
      );
      sizes[i] = 8 + Math.random() * 128;
      // const color = new THREE.Color().setHSL(Math.random(), 0.7, 0.6);
      // colors.set([color.r, color.g, color.b], i * 3);
    }

    pGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeom.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
    pGeom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    // pGeom.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    return { particlesGeometry: pGeom, allMaterials: materials };
  }, [gltf]);

  // useEffect for setting up the GSAP scroll animation
  useEffect(() => {
    if (allMaterials) {
      allMaterialsRef.current = allMaterials;
    }
    if (onSceneReady) {
      onSceneReady();
    }
  }, [allMaterials, allMaterialsRef, onSceneReady]);

  // useFrame is the R3F equivalent of the animation loop
  useFrame((state) => {
    if (particlesMaterialRef.current) {
      particlesMaterialRef.current.uniforms.uTime.value =
        state.clock.getElapsedTime();
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight intensity={1} position={[5, 10, 5]} />

      {/* The visible logo group */}
      <group
        ref={logoGroupRef}
        scale={1.15}
        position={[-3, -0.5, 0]}
        rotation={[-0.2, 0.6, 0]}
      >
        {/* We map over the original configs to recreate the logo */}
        {useMemo(() => {
          const spiralConfigs = [
            { s: 6, p: [-1.1, 1.1, 0], r: [Math.PI / 2.12, 0.0, 0.0] },
            { s: 6, p: [-1.4, 0.7, 0], r: [Math.PI / 2.1, 0.4, 0.0] },
            { s: 5.8, p: [-1.5, 0.25, 0], r: [Math.PI / 2.2, 0.8, 0.0] },
            { s: 5.6, p: [-1.4, -0.2, 0], r: [Math.PI / 2.4, 1.2, 0.0] },
            { s: 5.3, p: [-1.1, -0.54, 0], r: [Math.PI / 2.6, 1.65, 0.0] },
            { s: 4.5, p: [-0.75, -0.7, 0], r: [Math.PI / 3, 2.1, 0.0] },
            { s: 3.8, p: [-0.46, -0.8, -0.11], r: [Math.PI / 3, 2.5, 0.0] },
          ];
          let matIndex = 0;
          return spiralConfigs.map((config, i) => {
            const clone = gltf.scene.clone();
            clone.traverse((child) => {
              if (child.isMesh) {
                child.material = allMaterials[matIndex++];
              }
            });
            return (
              <primitive
                key={i}
                object={clone}
                scale={config.s}
                position={config.p}
                rotation={config.r}
              />
            );
          });
        }, [gltf.scene, allMaterials])}
      </group>

      {/* The particle system */}
      {particlesGeometry && (
        <points ref={particlesRef}>
          <primitive object={particlesGeometry} attach="geometry" />
          <shaderMaterial
            ref={particlesMaterialRef}
            transparent
            depthWrite={false}
            uniforms={{
              uProgress: { value: 0.0 },
              uTexture: { value: createCircleTexture() },
              uVisibility: { value: 0.0 },
              uTime: { value: 0.0 },
              uSizeMultiplier: { value: 1.0 },
              uColor: { value: new THREE.Color("#AB76E2") }, // Change this hex value to any color you like!
            }}
            vertexShader={`
              attribute vec3 aRandom;
              attribute float aSize;
            //   attribute vec3 aColor;
               uniform vec3 uColor;
              uniform float uProgress;
              uniform float uTime;
              uniform float uSizeMultiplier;
              varying vec3 vColor;
              void main() {
                // vColor = aColor;
                                vColor = uColor;

              vec3 finalPosition = mix(position, aRandom, uProgress);
                float orbitRadius = 0.3 + fract(aRandom.y) * 0.2;
                float speed = 0.2 + fract(aRandom.z) * 0.5;
                finalPosition.x += cos(uTime * speed + aRandom.x) * orbitRadius * uProgress;
                finalPosition.y += sin(uTime * speed + aRandom.y) * orbitRadius * uProgress;
                vec4 modelViewPosition = modelViewMatrix * vec4(finalPosition, 1.0);
                gl_Position = projectionMatrix * modelViewPosition;
                gl_PointSize = aSize * uSizeMultiplier * (1.0 / -modelViewPosition.z);
              }
            `}
            fragmentShader={`
              uniform sampler2D uTexture;
              uniform float uVisibility;
              varying vec3 vColor;
              void main() {
                vec4 texColor = texture2D(uTexture, gl_PointCoord);
                vec4 finalColor = vec4(vColor, 1.0) * texColor;
                finalColor.a *= uVisibility;
                if (finalColor.a < 0.01) discard;
                gl_FragColor = finalColor;
              }
            `}
          />
        </points>
      )}
    </>
  );
}

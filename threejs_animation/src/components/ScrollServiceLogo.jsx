"use client";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

if (typeof window !== "undefined") gsap.registerPlugin();

// ---------- Shaders ----------
const vertexShader = `
uniform float uTime;
uniform float uSize;
uniform float uMorph;
uniform vec2 uMouse;

attribute vec3 aRandomPos;
attribute vec3 aTargetPos;
attribute float aRandom;
attribute vec3 aDir;
attribute vec3 aVel;
attribute float aPauseTimer;  // NEW: tracks pause time for each particle

varying float vRandom;
varying float vDist;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vRandom = aRandom;

  // ----------------------------
  // 1. Base Morph Position
  // ----------------------------
  vec3 base = mix(aRandomPos, aTargetPos, uMorph);

  // Tiny idle wobble
  vec3 wobble = vec3(
    sin(uTime * 0.4 + aRandom * 6.2831),
    cos(uTime * 0.3 + aRandom * 4.2831),
    sin(uTime * 0.25 + aRandom * 8.2831)
  ) * 0.012;

  vec3 pos = base + wobble;

  // ----------------------------
  // 2. Screen-Space Mouse Dist
  // ----------------------------
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vec4 projPos = projectionMatrix * mvPos;
  vec2 sp = projPos.xy / projPos.w;

  float dist = distance(sp, uMouse);
  vDist = dist;

  float influence = smoothstep(0.1, 0.0, dist) * uMorph;

  vec3 vel = aVel;
  float pauseTimer = aPauseTimer;

  // force strength based on mouse proximity
  float force = (0.62 * (1.0 - dist)) * influence;

  // Apply force along each particle's random direction (aDir)
  vel += aDir * force;

  // Some particles move more on X, some on Y, some both -> ADD Z TOO
  float r = hash(aRandom * 541.77);
  if (r > 0.75) {
    vel.z *= 6.0;
  } else if (r > 0.5) {
    vel.x *= 2.8;
  } else if (r > 0.25) {
    vel.y *= 5.8;
  } else {
    vel.xy *= 3.1;
  }

  // Dampen velocity so it doesn't explode
  vel *= 0.99;
  vel.z += (1.0 - dist) * influence * 0.5;

  // NEW: Check if particle should pause
  float velocityMag = length(vel);

  // If particle has significant velocity and is far from base, start pause timer
  if (velocityMag > 0.02 && distance(pos, base) > 0.5) {
    pauseTimer += 1.16; // increment timer (assuming ~60fps)
  } else {
    pauseTimer = 0.0; // reset timer when close to base
  }

  // Apply velocity only if not pausing (pause for 0.5 to 1.5 seconds based on aRandom)
  float pauseDuration = 5.5 + aRandom * 1.0;
  if (pauseTimer < pauseDuration) {
    pos += vel * 0.015;
  } else {
    // After pause, apply stronger return force
    vel *= 1.85; // stronger damping during return
  }

  // Restore force - stronger after pause period
  float restoreStrength = pauseTimer > pauseDuration ? 0.88 : 0.95;
  float restore = restoreStrength - influence * 0.9;
  pos = mix(pos, base, restore);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 uColorActive;
uniform vec3 uColorInactive;
uniform float uActiveMix;
uniform float uAlpha;
uniform float uTime;
varying float vRandom;
varying float vDist;

void main() {
  vec2 uv = gl_PointCoord;
  float d = length(uv - 0.5);
  if (d > 0.5) discard;

  vec3 baseColor = mix(uColorInactive, uColorActive, uActiveMix);
  float flicker = 0.85 + 0.15 * sin(vRandom * 8.0 + uTime * 1.5);
  float mouseGlow = 1.0 - smoothstep(0.0, 0.25, vDist);
  vec3 color = baseColor * (flicker + 2.2 + mouseGlow * 1.6);

  float alpha = (1.0 - smoothstep(0.3, 0.5, d)) * uAlpha;
  gl_FragColor = vec4(color, alpha);
}
`;

// ---------- Spiral Config ----------
export const spiralConfigs = [
  { s: 6, p: [-1.1, 1.1, 0], r: [Math.PI / 2.12, 0.0, 0.0] },
  { s: 6, p: [-1.4, 0.7, 0], r: [Math.PI / 2.1, 0.4, 0.0] },
  { s: 5.8, p: [-1.5, 0.25, 0], r: [Math.PI / 2.2, 0.8, 0.0] },
  { s: 5.6, p: [-1.4, -0.2, 0], r: [Math.PI / 2.4, 1.2, 0.0] },
  { s: 5.3, p: [-1.1, -0.54, 0], r: [Math.PI / 2.6, 1.65, 0.0] },
  { s: 4.5, p: [-0.75, -0.7, 0], r: [Math.PI / 3, 2.1, 0.0] },
  { s: 3.6, p: [-0.43, -0.8, -0.11], r: [Math.PI / 3, 2.5, 0.0] },
];

// ---------- Component ----------
export default function ParticlesMorphPerSlice({
  glbPath = "/models/model.glb",
  particleCount = 10000,
  size = 12,
  initialActiveIndex = 0,
  activeIndex = 0,
}) {
  const { scene } = useGLTF(glbPath);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const materialsRef = useRef([]);
  const pointsGroupRef = useRef();
  const slicesRef = useRef(null);

  slicesRef.current = [];

  scene.traverse((child) => {
    if (child.isMesh) {
      slicesRef.current.push(child);
    }
  });

  const order = {
    Curve001: 2,
    Curve002: 1,
    Curve_1: 3,
    Curve003: 4,
    Curve004: 5,
    Curve005: 6,
    Curve006: 7,
  };

  slicesRef.current.sort((a, b) => {
    return order[a.name] - order[b.name];
  });

  slicesRef.current.forEach((slice) => {
    slice.position.set(0, 0, 0);
    slice.rotation.set(0, 0, 0);
  });

  const VISUAL_POSITION = new THREE.Vector3(-2, -2, 0);
  const VISUAL_ROTATION = new THREE.Euler(0, 0.2, -Math.PI / 3.5);
  const VISUAL_SCALE = new THREE.Vector3(1.8, 1.8, 1.7);

  // mouse move
  useEffect(() => {
    const handleMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Build slices from GLB
  const slices = useMemo(() => {
    const samplers = [];
    slicesRef.current.forEach((child) => {
      if (child) {
        child.updateWorldMatrix(true, false);
        try {
          const sampler = new MeshSurfaceSampler(child).build();
          samplers.push({
            sampler,
            matrixWorld: child.matrixWorld.clone(),
            name: child.name,
          });
        } catch (err) {
          console.log("err", err);
        }
      }
    });

    const slicesCount = Math.max(1, samplers.length);
    const perSlice = Math.floor(particleCount / slicesCount);
    const remainder = particleCount - perSlice * slicesCount;

    let samplerIdx = 0;
    const out = [];

    for (let sIdx = 0; sIdx < slicesCount; sIdx++) {
      const count = perSlice + (sIdx === slicesCount - 1 ? remainder : 0);
      const aRandomPos = new Float32Array(count * 3);
      const aTargetPos = new Float32Array(count * 3);
      const aRandom = new Float32Array(count);
      const temp = new THREE.Vector3();

      const spacing = 0.3;
      const layerSpacing = 0.8;
      const jitterRange = 1.55;

      let generated = [];
      let n = 1;
      let m = 0;

      while (generated.length / 3 < count) {
        generated = [];
        for (let x = -n; x <= n; x++) {
          for (let y = -n; y <= n; y++) {
            if (x === 0 || y === 0) continue;
            for (let zLayer = -m; zLayer <= m; zLayer++) {
              const jitter = (Math.random() - 0.5) * jitterRange;
              const z = zLayer * layerSpacing + jitter;
              generated.push(x * spacing, y * spacing, z);
            }
          }
        }
        if (generated.length / 3 < count) {
          if (m < n) m++;
          else n++;
          if (n > 80 || m > 80) break;
        }
      }

      const totalGenerated = generated.length / 3;
      for (let i = 0; i < count; i++) {
        const srcIndex = i % totalGenerated;
        const px = generated[srcIndex * 3];
        const py = generated[srcIndex * 3 + 1];
        const pz = generated[srcIndex * 3 + 2];
        aRandomPos.set([px, py, pz], i * 3);
        aRandom[i] = Math.random();
      }

      let wrote = 0;
      while (wrote < count) {
        const samplerObj = samplers[sIdx];
        samplerIdx++;
        samplerObj.sampler.sample(temp);
        temp.applyMatrix4(samplerObj.matrixWorld);
        aTargetPos.set([temp.x, temp.y, temp.z], wrote * 3);
        wrote++;
      }

      out.push({ aRandomPos, aTargetPos, aRandom, count });
    }

    return out;
  }, [scene, particleCount]);

  // Create geometries + materials
  const meshesPerSlice = useMemo(() => {
    const items = [];
    for (let i = 0; i < slices.length; i++) {
      const { aRandomPos, aTargetPos, aRandom } = slices[i];

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(aRandomPos, 3)
      );
      geometry.setAttribute(
        "aRandomPos",
        new THREE.BufferAttribute(aRandomPos, 3)
      );
      geometry.setAttribute(
        "aTargetPos",
        new THREE.BufferAttribute(aTargetPos, 3)
      );
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandom, 3));

      const aDir = new Float32Array(aRandomPos.length);
      const aVel = new Float32Array(aRandomPos.length);
      const aPauseTimer = new Float32Array(aRandomPos.length / 3); // NEW: pause timer attribute

      geometry.setAttribute("aVel", new THREE.BufferAttribute(aVel, 3));
      geometry.getAttribute("aVel").setUsage(THREE.DynamicDrawUsage);

      geometry.setAttribute(
        "aPauseTimer",
        new THREE.BufferAttribute(aPauseTimer, 1)
      ); // NEW
      geometry.getAttribute("aPauseTimer").setUsage(THREE.DynamicDrawUsage);

      for (let i = 0; i < aDir.length; i += 3) {
        const rx = Math.random() * 2 - 1;
        const ry = Math.random() * 2 - 1;
        const rz = Math.random() * 2 - 1;

        const v = new THREE.Vector3(rx, ry, rz).normalize();

        aDir[i] = v.x;
        aDir[i + 1] = v.y;
        aDir[i + 2] = v.z;
      }

      geometry.setAttribute("aDir", new THREE.BufferAttribute(aDir, 3));

      const mat = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: size },
          uMorph: { value: 0.0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uColorActive: { value: new THREE.Color(0xab76e2) },
          uColorInactive: { value: new THREE.Color(0x52198c) },
          uActiveMix: { value: 0.0 },
          uAlpha: { value: i === 0 ? 1.0 : 0.15 },
        },
      });

      const points = new THREE.Points(geometry, mat);
      items.push({ points, material: mat });
    }
    return items;
  }, [slices, size]);

  // store refs
  useEffect(() => {
    materialsRef.current = meshesPerSlice.map((m) => m.material);
    window.particleMorphUniforms = materialsRef.current.map((m) => m.uniforms);
  }, [meshesPerSlice]);

  // active slice highlighting
  useEffect(() => {
    const idx =
      typeof activeIndex === "number" ? activeIndex : initialActiveIndex;
    materialsRef.current.forEach((mat, i) => {
      const isActive = i === idx;
      gsap.to(mat.uniforms.uAlpha, {
        value: isActive ? 1.0 : 0.15,
        duration: 1.3,
        ease: "none",
      });
      gsap.to(mat.uniforms.uActiveMix, {
        value: isActive ? 1.0 : 0.0,
        duration: 1.3,
        ease: "none",
      });
    });
  }, [activeIndex, initialActiveIndex]);

  // frame updates
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    materialsRef.current.forEach((mat) => {
      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouse.value.set(mouse.current.x, mouse.current.y);
    });
  });

  return (
    <group
      ref={pointsGroupRef}
      position={[-3, -2.7, 0]}
      rotation={[0, 0, -0.6]}
      scale={[17, 17, 8]}
    >
      {meshesPerSlice.map((m, idx) => (
        <primitive key={idx} object={m.points} />
      ))}
    </group>
  );
}

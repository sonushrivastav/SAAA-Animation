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
varying float vRandom;
varying float vDist;

void main() {
  vRandom = aRandom;

  vec3 randPos = aRandomPos;
  vec3 targetPos = aTargetPos;
  vec3 base = mix(randPos, targetPos, uMorph);

  vec3 wobble = vec3(
    sin(uTime * 0.4 + aRandom * 6.2831),
    cos(uTime * 0.3 + aRandom * 4.2831),
    sin(uTime * 0.25 + aRandom * 8.2831)
  ) * 0.01;

  vec3 pos = base + wobble;

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vec4 projPos = projectionMatrix * mvPos;
  vec2 screenPos = projPos.xy / projPos.w;

  float dist = distance(screenPos, uMouse);
  vDist = dist;

  float influence = smoothstep(0.24, 0.0, dist) * uMorph;
  vec2 dir = normalize(uMouse);
  pos += vec3(dir.x * influence * 0.25, dir.y * influence * 0.25, 0.0);

  float restore = 0.92 + 0.06 * sin(uTime * 0.2 + aRandom * 5.0);
  pos = mix(pos, base, restore * (1.0 - influence));

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
  glbPath = "/models/T3d.glb",
  particleCount = 10000,
  size = 12,
  initialActiveIndex = 0,
  activeIndex = 0,
}) {
  const { scene } = useGLTF(glbPath);
  const mouse = useRef(new THREE.Vector2(0, 0));
  const materialsRef = useRef([]);
  const pointsGroupRef = useRef();

  // desired visual transform that used to be applied to each primitive
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
    scene.traverse((child) => {
      if (child.isMesh) {
        child.updateWorldMatrix(true, false);
        try {
          const sampler = new MeshSurfaceSampler(child).build();
          samplers.push({ sampler, matrixWorld: child.matrixWorld.clone() });
        } catch (err) {}
      }
    });

    const slicesCount = spiralConfigs.length;
    const perSlice = Math.floor(particleCount / slicesCount);
    const remainder = particleCount - perSlice * slicesCount;
    const spiralMatrices = spiralConfigs.map((cfg) => {
      const m = new THREE.Matrix4();
      const s = new THREE.Vector3(cfg.s, cfg.s, cfg.s);
      const q = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(cfg.r[0], cfg.r[1], cfg.r[2])
      );
      m.compose(new THREE.Vector3(...cfg.p), q, s);
      return m;
    });

    // Prepare visual transform matrix that'll be applied only to target positions
    const visualMatrix = new THREE.Matrix4();
    visualMatrix.compose(
      VISUAL_POSITION,
      new THREE.Quaternion().setFromEuler(VISUAL_ROTATION),
      VISUAL_SCALE
    );

    let samplerIdx = 0;
    const samplersCount = Math.max(1, samplers.length);
    const out = [];

    for (let sIdx = 0; sIdx < slicesCount; sIdx++) {
      const count = perSlice + (sIdx === slicesCount - 1 ? remainder : 0);
      const aRandomPos = new Float32Array(count * 3);
      const aTargetPos = new Float32Array(count * 3);
      const aRandom = new Float32Array(count);
      const temp = new THREE.Vector3();

      // ------- START: centered star-grid / layered arrangement (replaces random positions) -------
      const spacing = 2.55; // distance between grid points in x/y
      const layerSpacing = 1.2; // spacing between z layers
      const jitterRange = 0.45; // random jitter applied to z

      let generated = [];
      let n = 1; // XY radius
      let m = 0; // Z layers on each side

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
        // aRandom[i] = Math.random();
      }
      // ------- END initial grid -------

      // target positions: sample model + spiral matrix + bake visual transform
      let wrote = 0;
      while (wrote < count) {
        const samplerObj = samplers[samplerIdx % samplersCount];
        samplerIdx++;
        samplerObj.sampler.sample(temp); // sample model in its world space
        temp.applyMatrix4(samplerObj.matrixWorld); // transform to world
        temp.applyMatrix4(spiralMatrices[sIdx]); // apply slice spiral local transform
        temp.applyMatrix4(visualMatrix); // ===== bake visual transform into TARGET
        aTargetPos.set([temp.x, temp.y, temp.z], wrote * 3);
        wrote++;
      }

      out.push({ aRandomPos, aTargetPos, aRandom, count });
    }

    return out;
  }, [scene, particleCount]);

  // Create geometries + materials (no primitive-level transforms)
  const meshesPerSlice = useMemo(() => {
    const items = [];
    for (let i = 0; i < slices.length; i++) {
      const { aRandomPos, aTargetPos, aRandom } = slices[i];

      const geometry = new THREE.BufferGeometry();
      // INITIAL geometry positions are stored in 'position' attribute -> this is the centered grid
      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(aRandomPos, 3)
      );
      geometry.setAttribute(
        "aRandomPos",
        new THREE.BufferAttribute(aRandomPos, 3)
      );
      // TARGET positions baked with the visual transform are stored in aTargetPos
      geometry.setAttribute(
        "aTargetPos",
        new THREE.BufferAttribute(aTargetPos, 3)
      );
      geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandom, 3));

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
        duration: 1.2,
        ease: "power2.out",
      });
      gsap.to(mat.uniforms.uActiveMix, {
        value: isActive ? 1.0 : 0.0,
        duration: 1.2,
        ease: "power2.out",
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

  // RENDER: primitives have identity transforms — visual transform baked into aTargetPos only
  return (
    <group
      ref={pointsGroupRef}
      position={[0, 0, 0]}
      rotation={[0, 0, 0]}
      scale={[1, 1, 1]}
    >
      {meshesPerSlice.map((m, idx) => (
        <primitive key={idx} object={m.points} />
      ))}
    </group>
  );
}

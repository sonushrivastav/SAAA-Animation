'use client';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

if (typeof window !== 'undefined') gsap.registerPlugin();

// 🎨 GLSL Shaders
const vertexShader = `
uniform float uTime;
uniform float uSize;
uniform vec2 uMouse; // normalized mouse (-1..1)
attribute vec3 aBasePos;
attribute float aRandom;
varying float vRandom;
varying float vDist;

// --- Smoother pseudo-noise (sinusoidal, stable over time) ---
float smoothNoise(vec3 p) {
  return sin(p.x * 2.0 + uTime * 0.3) *
         cos(p.y * 2.2 + uTime * 0.35) *
         sin(p.z * 1.7 + uTime * 0.25);
}

void main() {
  vRandom = aRandom;

  vec3 pos = aBasePos;

  // --- Convert position to screen space ---
  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  vec4 projPos = projectionMatrix * mvPos;
  vec2 screenPos = projPos.xy / projPos.w;

  // --- Distance from mouse ---
  float dist = distance(screenPos, uMouse);
  vDist = dist;

  // --- Influence radius (smaller + smoother falloff) ---
  float influence = 1.0 - smoothstep(0.0, 0.18, dist); // smaller area

  // --- Gentle noise-driven displacement ---
  float n = smoothNoise(pos * 0.6 + vec3(aRandom * 10.0));
  vec3 displaced = pos + normalize(pos + 0.001) * n * influence * 0.05; // small strength

  // --- Subtle continuous breathing motion ---
  displaced += vec3(
    sin(uTime * 0.2 + aRandom * 6.2831) * 0.015,
    cos(uTime * 0.25 + aRandom * 3.2831) * 0.015,
    sin(uTime * 0.22 + aRandom * 4.2831) * 0.015
  );

  // --- Smooth return-to-rest ---
  float relax = smoothstep(0.1, 0.25, dist);
  pos = mix(displaced, aBasePos, relax);

  // --- Final projection ---
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

  // base color blend
  vec3 baseColor = mix(uColorInactive, uColorActive, uActiveMix);

  // brightness based on distance + random flicker
  float flicker = 0.85 + 0.25 * sin(vRandom * 10.0 + uTime * 1.5);
  float mouseGlow = 1.0 - smoothstep(0.0, 0.35, vDist);
  vec3 color = baseColor * (flicker + mouseGlow * 1.2);

  float alpha = (1.0 - smoothstep(0.3, 0.5, d)) * uAlpha;
  gl_FragColor = vec4(color, alpha);
}


`;

// Spiral config for slices
export const spiralConfigs = [
    { s: 6, p: [-1.1, 1.1, 0], r: [Math.PI / 2.12, 0.0, 0.0] },
    { s: 6, p: [-1.4, 0.7, 0], r: [Math.PI / 2.1, 0.4, 0.0] },
    { s: 5.8, p: [-1.5, 0.25, 0], r: [Math.PI / 2.2, 0.8, 0.0] },
    { s: 5.6, p: [-1.4, -0.2, 0], r: [Math.PI / 2.4, 1.2, 0.0] },
    { s: 5.3, p: [-1.1, -0.54, 0], r: [Math.PI / 2.6, 1.65, 0.0] },
    { s: 4.5, p: [-0.75, -0.7, 0], r: [Math.PI / 3, 2.1, 0.0] },
    { s: 3.6, p: [-0.43, -0.8, -0.11], r: [Math.PI / 3, 2.5, 0.0] },
];

const ScrollServiceLogo = ({ activeIndex }) => {
    const { scene } = useGLTF('/models/T3d.glb');
    const groupRef = useRef();
    const sliceRefs = useRef([]);
    // const { viewport } = useThree();

    // 🌀 Convert each slice to particles with MeshSurfaceSampler
    const slices = useMemo(() => {
        const instances = [];

        spiralConfigs.forEach((cfg, index) => {
            const modelGroup = new THREE.Group();
            const meshes = [];

            scene.traverse(child => {
                if (child.isMesh) {
                    // ✅ Make sure the mesh world matrix is up to date
                    child.updateWorldMatrix(true, false);

                    // ✅ Build the surface sampler
                    const sampler = new MeshSurfaceSampler(child).build();

                    const count = 4000; // number of points
                    const positions = new Float32Array(count * 3);
                    const randoms = new Float32Array(count);
                    const basePositions = new Float32Array(count * 3);

                    const tempPosition = new THREE.Vector3();

                    for (let i = 0; i < count; i++) {
                        sampler.sample(tempPosition);

                        // ✅ Apply the mesh’s world transform to every sampled point
                        tempPosition.applyMatrix4(child.matrixWorld);

                        positions.set([tempPosition.x, tempPosition.y, tempPosition.z], i * 3);
                        basePositions.set([tempPosition.x, tempPosition.y, tempPosition.z], i * 3);

                        randoms[i] = Math.random();
                    }

                    const geometry = new THREE.BufferGeometry();
                    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
                    geometry.setAttribute('aBasePos', new THREE.BufferAttribute(basePositions, 3)); // 👈 new

                    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

                    const material = new THREE.ShaderMaterial({
                        vertexShader,
                        fragmentShader,
                        transparent: false,
                        depthWrite: false,
                        // blending: THREE.AdditiveBlending,
                        uniforms: {
                            uTime: { value: 0 },
                            uAlpha: { value: index === 0 ? 1 : 0.2 },
                            uSize: { value: 20.0 }, // ✅ particle size
                            uColorActive: { value: new THREE.Color(0xcfaff0) },
                            uColorInactive: { value: new THREE.Color(0x52198c) },
                            uActiveMix: { value: 0.0 }, // 0 = all inactive, 1 = all active
                            uMouse: { value: new THREE.Vector2(0, 0) }, // ✅ add mouse uniform
                        },
                    });

                    const points = new THREE.Points(geometry, material);
                    meshes.push(points);
                    modelGroup.add(points);
                }
            });

            modelGroup.scale.set(cfg.s, cfg.s, cfg.s);
            modelGroup.position.fromArray(cfg.p);
            modelGroup.rotation.fromArray(cfg.r);

            instances.push({ model: modelGroup, meshes });
        });

        return instances;
    }, [scene]);

    // 🔆 Animate alpha on scroll (activeIndex)
    useEffect(() => {
        sliceRefs.current.forEach((meshes, i) => {
            const isActive = i === activeIndex;

            meshes.forEach(m => {
                gsap.to(m.material.uniforms.uAlpha, {
                    value: isActive ? 1 : 0.15,
                    duration: 1.5,
                    ease: 'power2.out',
                });

                gsap.to(m.material.uniforms.uActiveMix, {
                    value: isActive ? 1 : 0,
                    duration: 1.5,
                    ease: 'power2.out',
                });
            });
        });
    }, [activeIndex]);

    const mouse = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const handleMouseMove = e => {
            // Convert to normalized device coordinates (-1 to 1)
            mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // ⏰ Animate over time
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        sliceRefs.current.forEach(meshes => {
            meshes.forEach(m => {
                m.material.uniforms.uTime.value = t;
                m.material.uniforms.uMouse.value.copy(mouse.current);
            });
        });
    });

    return (
        <group
            ref={groupRef}
            scale={[1.8, 1.8, 1.7]}
            position={[-2, -2, 0]}
            rotation={[0, 0.2, -Math.PI / 3.5]}
        >
            {slices.map(({ model, meshes }, index) => (
                <primitive
                    key={index}
                    object={model}
                    ref={() => {
                        sliceRefs.current[index] = meshes;
                    }}
                />
            ))}
        </group>
    );
};

export default ScrollServiceLogo;

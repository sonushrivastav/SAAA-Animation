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
varying float vDist;
varying float vRandom;

float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vRandom = aRandom;

  vec3 base = aBasePos;
  vec3 pos = base;

  // Project position to screen space (clip-space)
  vec4 mvPos = modelViewMatrix * vec4(base, 1.0);
  vec4 projPos = projectionMatrix * mvPos;
  vec2 screenPos = projPos.xy / projPos.w;

  float dist = distance(screenPos, uMouse);
  vDist = dist;

  float influence = smoothstep(0.24, 0.0, dist);

  vec2 dir = normalize( uMouse);
  vec3 displaced = base;

  float strength = 0.055;
//   displaced.x += dir.x * influence *  0.25;
  displaced.y += dir.y * influence *  0.25;


  // Viscous return with slow easing
  float ease = smoothstep(0.0, 0.3, influence);
  pos = mix(base, displaced, ease * 0.9);

  pos += vec3(
    sin(uTime * 0.4 + aRandom * 6.2831) * 0.01,
    cos(uTime * 0.3 + aRandom * 4.2831) * 0.01,
    sin(uTime * 0.25 + aRandom * 8.2831) * 0.008
  );

  // --- Smooth push-back to base ---
  float restore = 0.93 + 0.05 * sin(uTime * 0.2 + aRandom * 5.0);
  pos = mix(pos, base, restore * (1.0 - influence));

  // Final projection
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
  float flicker = 0.85 + 0.15 * sin(vRandom * 8.0 + uTime * 1.5);
 float mouseGlow = 1.0 - smoothstep(0.0, 0.25, vDist);
vec3 color = baseColor * (flicker + 2.5 + mouseGlow * 1.5);


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

                    const count = 2000; // number of points
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
                    geometry.setAttribute('aBasePos', new THREE.BufferAttribute(basePositions, 3));
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
                            uSize: { value: 15.0 }, // ✅ particle size
                            uColorActive: { value: new THREE.Color(0xab76e2) },
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

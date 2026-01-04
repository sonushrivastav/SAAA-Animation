'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler';

// 💡 Add the import for useControls from Leva
import { Leva, useControls } from 'leva';
import useDeviceType from '../hooks/useDeviceType';

export default function StarfieldBackground({ activeIndex = -1 }) {
    const canvasRef = useRef(null);
    const { isMobile, isTablet, isDesktop } = useDeviceType();

    // 🌟 LEVA Controls Integration
    const controls = useControls({
        // Starfield Controls
        baseSpeed: {
            value: 0.5, // Used in the animate loop
            min: 0.01,
            max: 5.0,
            step: 0.01,
            label: 'Base Speed',
        },
        spacing: { value: 87, min: 10, max: 200, step: 1, label: 'Grid Spacing' },
        count: { value: 15, min: 1, max: 50, step: 1, label: 'Grid Count' },
        sizeScale: {
            value: 350.0, // Used in uSizeScale uniform
            min: 100,
            max: 2000,
            step: 10,
            label: 'Size Scale',
        },
        minOpacity: {
            value: 0.85,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Min Opacity',
        },
        maxOpacity: {
            value: 1.0,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Max Opacity',
        },
        opacityFalloff: {
            value: 500.0,
            min: 10,
            max: 2000,
            step: 10,
            label: 'Opacity Falloff',
        },
        opacityOffset: {
            value: 140,
            min: -1000.0,
            max: 1000.0,
            step: 10,
            label: 'Opacity Offset',
        },
        // Animation/Distortion Controls
        maxStretch: {
            value: 30.0, // Used in scroll listener
            min: 1.0,
            max: 100,
            step: 1,
            label: 'Max Stretch X',
        },
        maxShrink: {
            value: 15.0, // Used in scroll listener
            min: 1.0,
            max: 50,
            step: 1,
            label: 'Max Shrink Y',
        },
        repulseRadius: { value: 0.5, min: 0.1, max: 10.0, step: 0.1, label: 'Magnet Radius' },
        repulseStrength: { value: 2.0, min: 0.1, max: 20.0, step: 0.1, label: 'Magnet Strength' },
    });

    function createCircleTexture() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const cx = size / 2;
        const cy = size / 2;
        const coreR = Math.floor(size * 0.18); // smaller core for glow effect
        const outerR = Math.floor(size * 0.5); // glow radius

        ctx.clearRect(0, 0, size, size);
        ctx.imageSmoothingEnabled = true; // smooth gradient

        // Create radial gradient
        const gradient = ctx.createRadialGradient(cx, cy, coreR, cx, cy, outerR);
        gradient.addColorStop(0, 'rgba(255,255,255,1)'); // core bright white
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,0.5)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)'); // fade out to transparent

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.fill();

        // Create Three.js texture
        const tex = new THREE.CanvasTexture(canvas);
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;

        return tex;
    }

    const starData = useMemo(() => {
        const starPositions = [];
        const count = isMobile ? 18 : 15;
        const spacing = isMobile ? 50 : 87;

        const totalDepth = count * 10;

        for (let x = -count; x <= count; x++) {
            for (let y = -count; y <= count; y++) {
                if (y === 0 || x === 0) continue;
                for (let zLayer = -count; zLayer <= count; zLayer++) {
                    const jitter = (Math.random() - 0.5) * 30;
                    const z = zLayer * 40 + jitter;
                    starPositions.push(x * spacing, y * spacing, z);
                }
            }
        }

        const total = starPositions.length / 3;
        const sizes = new Float32Array(total);

        let zMin = Infinity,
            zMax = -Infinity;
        for (let i = 0; i < total; i++) {
            const z = starPositions[i * 3 + 2];
            if (z < zMin) zMin = z;
            if (z > zMax) zMax = z;
        }
        const zRange = zMax - zMin || 1.0;

        const minBase = 1.0;
        const maxBase = 14.0;

        for (let i = 0; i < total; i++) {
            const z = starPositions[i * 3 + 2];
            const normalized = (z - zMin) / zRange;
            const biased = Math.pow(normalized, 0.9);
            const base = minBase + biased * (maxBase - minBase);
            sizes[i] = base * (0.85 + Math.random() * 0.35);
        }

        return { starPositions, sizes, totalDepth, total };
    }, [controls.spacing, controls.count, isMobile]);

    useEffect(() => {
        // We use the destructured values from the controls
        const { baseSpeed, spacing, count, sizeScale, maxStretch, maxShrink } = controls;

        const { starPositions, sizes, totalDepth, total } = starData;
        // Store globally so other component can use
        window.globalStarPositions = starPositions;

        const loader = new THREE.TextureLoader();
        // const star = loader.load('/images/testImages/sp2.png'); // Unused
        const scene = new THREE.Scene();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 5);
        scene.add(directionalLight);

        new RGBELoader().load('/images/studio_small_03_1k.hdr', hdrMap => {
            hdrMap.mapping = THREE.EquirectangularReflectionMapping;
            scene.environment = hdrMap;
        });
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // 🌈 Set single color for all particles
        const colors = new Float32Array(total * 3);
        const color = new THREE.Color();
        color.set('#ab76e2'); // 👈 change this hex value to your desired color

        for (let i = 0; i < total; i++) {
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        starsGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
        starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const starTexture = createCircleTexture();
        const gltfLoader = new GLTFLoader();
        const meshes = [];

        gltfLoader.load('/models/model.glb', gltf => {
            // 1️⃣ Apply transforms EXACTLY like rendered logo
            if (isMobile) {
                gltf.scene.position.set(-1.5, -0, 0);
                gltf.scene.rotation.set(0, 0, -Math.PI / 2);
                gltf.scene.scale.set(10, 10, 7);
            } else if (isTablet) {
                gltf.scene.position.set(-2, -2.5, 0);
                gltf.scene.rotation.set(0, 0, -0.25);
                gltf.scene.scale.set(14, 14, 9);
            } else {
                gltf.scene.position.set(-3, -3.3, 0);
                gltf.scene.rotation.set(0, 0, -0.6);
                gltf.scene.scale.set(20, 20, 10);
            }
            gltf.scene.updateWorldMatrix(true, true);

            const geometries = [];

            // 2️⃣ Collect geometries with world transform baked in
            gltf.scene.traverse(child => {
                if (!child.isMesh) return;

                const geo = child.geometry.clone();
                geo.applyMatrix4(child.matrixWorld); // 🔥 bake transform ONCE
                geometries.push(geo);
                meshes.push(child);
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
            meshes.sort((a, b) => {
                return order[a.name] - order[b.name];
            });

            if (!geometries.length) return;

            if (meshes.length === 0) return;

            // 💡 CHANGE 2: Sample proportionally from each mesh and TAG them
            const targetPositions = new Float32Array(total * 3);
            const shapeIndices = new Float32Array(total); // New array to store ID (0-6)

            const tempPosition = new THREE.Vector3();
            let currentOffset = 0;

            // We distribute the total particles across the 7 meshes
            // (Simple division, or you can calculate surface area for perfect evenness)
            const particlesPerMesh = Math.floor(total / meshes.length);

            meshes.forEach((mesh, meshIndex) => {
                // Apply world matrix to geometry for sampling
                const samplerMesh = new THREE.Mesh(
                    mesh.geometry.clone(),
                    new THREE.MeshBasicMaterial()
                );
                samplerMesh.geometry.applyMatrix4(mesh.matrixWorld);

                const sampler = new MeshSurfaceSampler(samplerMesh).build();

                // Determine how many dots this specific mesh gets
                // The last mesh gets the remainder to ensure we fill the array
                const count =
                    meshIndex === meshes.length - 1 ? total - currentOffset : particlesPerMesh;

                for (let i = 0; i < count; i++) {
                    sampler.sample(tempPosition);

                    const index = currentOffset + i;
                    targetPositions[index * 3 + 0] = tempPosition.x;
                    targetPositions[index * 3 + 1] = tempPosition.y;
                    targetPositions[index * 3 + 2] = tempPosition.z;

                    // TAG THIS PARTICLE with the mesh index!
                    shapeIndices[index] = meshIndex;
                }
                currentOffset += count;
            });

            starsGeometry.setAttribute('aTarget', new THREE.BufferAttribute(targetPositions, 3));

            // Add the new attribute to geometry
            starsGeometry.setAttribute('aShapeIndex', new THREE.BufferAttribute(shapeIndices, 1));
        });

        // 💡 Use sizeScale from controls

        const raycaster = new THREE.Raycaster();
        // Create a plane at Z=0 (where your logo roughly sits)
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const planeIntersectPoint = new THREE.Vector3();

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: starTexture },
                uSizeScale: { value: controls.sizeScale },
                uStretchX: { value: 1.0 },
                uShrinkY: { value: 1.0 },
                uTime: { value: 0 },
                uSpiralProgress: { value: 0 },
                uMergeProgress: { value: 0 },
                uDirection: { value: new THREE.Vector3(0, 0, 1) },
                uSpeed: { value: controls.baseSpeed },
                uMorph: { value: 0 },
                uMeshPosition: { value: new THREE.Vector3(0, 0, 0) },
                uActiveIndex: { value: { activeIndex } }, // Passed from prop
                uHighlightColor: { value: new THREE.Color('#844DE9') },
                uMinOpacity: { value: controls.minOpacity },
                uMaxOpacity: { value: controls.maxOpacity },
                uOpacityFalloff: { value: controls.opacityFalloff },
                uOpacityOffset: { value: controls.opacityOffset },
                uMousePos: { value: new THREE.Vector3(0, 0, 0) },
                uRepulseRadius: { value: controls.repulseRadius },
                uRepulseStrength: { value: controls.repulseStrength },
                vertexColors: true,
            },
            vertexShader: `
        attribute float aSize;
        attribute float aSpiral;
        attribute vec3 color;
        attribute vec3 aTarget;
attribute float aShapeIndex;
        varying vec3 vColor;
        varying float vDepth;
        varying float vMorphFactor; // Pass morph state to fragment
varying float vShapeIndex;
        uniform float uSizeScale;
        uniform float uTime;
        uniform float uSpiralProgress;
        uniform float uMergeProgress;
        uniform float uMorph;
        uniform vec3 uMeshPosition;

        // 👇 NEW UNIFORMS
    uniform vec3 uMousePos;
    uniform float uRepulseRadius;
    uniform float uRepulseStrength;

        void main() {
          vec3 pos = position;
          vColor = color;
          vShapeIndex = aShapeIndex;
          vMorphFactor = uMorph;

          // Spiral effect
          if (aSpiral > 0.5) {
            float angle = uTime * 2.0 + pos.z * 0.05;
            float radius = length(pos.xy) * (1.0 - uMergeProgress);
            vec3 spiralPos = vec3(cos(angle) * radius, sin(angle) * radius, pos.z);
            pos = mix(pos, spiralPos, uSpiralProgress);
          }

          // Morphing Logic
          vec3 localTarget = aTarget - uMeshPosition;
          pos = mix(pos, localTarget, uMorph);

      // -----------------------------------------------------------
                  // 🧲 INDIVIDUAL PARTICLE MAGNETISM
                  // -----------------------------------------------------------
                  // Only apply when the logo is fully formed (> 0.9)
                  if (uMorph > 0.90) {
                      // 1. Calculate distance from this SPECIFIC particle to the mouse
                      // We use 'aTarget' because that is the particle's fixed world position
                      float dist = distance(aTarget.xy, uMousePos.xy);

                      // 2. If the mouse is close to this particle...
                      if (dist < uRepulseRadius) {
                          // 3. Calculate direction: "Run away from mouse!"
                          vec3 repulseDir = normalize(aTarget - uMousePos);

                          // 4. Calculate force: Stronger at center, weaker at edges
                          float force = (uRepulseRadius - dist) / uRepulseRadius;
                          force = pow(force, 2.0) * uRepulseStrength; // Smooth curve

                          // 5. Move ONLY this particle
                          pos += repulseDir * force;
                      }
                  }
                  // -----------------------------------------------------------

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          float depth = -mvPos.z;

          // -------------------------------------------------------------
          // 💡 KEY FIX: Dynamic Sizing
          // -------------------------------------------------------------
          // 1. Defined a fixed, smaller size for the logo shape (e.g., 20.0)
          // 2. Mix between the random star size (aSize) and the fixed shape size
          float shapeBaseSize = 0.1; // Adjust this number to make shape points smaller/larger
          float currentBaseSize = mix(aSize, shapeBaseSize, uMorph);

          // Apply perspective
          float safeDepth = max(8.0, depth);
          float perspective = uSizeScale / safeDepth;
          float size = currentBaseSize * perspective;

          // -------------------------------------------------------------
          // 💡 KEY FIX: Clamping
          // -------------------------------------------------------------
          // When morphed, we allow points to be smaller to define edges better
          float minSize = mix(1.0, 0.5, uMorph);
          float maxSize = mix(160.0, 50.0, uMorph); // Cap max size heavily when morphed

          gl_Position = projectionMatrix * mvPos;
          gl_PointSize = clamp(size, minSize, maxSize);

          vDepth = depth;
        }
      `,
            fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uStretchX;
        uniform float uShrinkY;

        varying vec3 vColor;
        varying float vDepth;
        varying float vMorphFactor; // Receive morph state
varying float vShapeIndex;
        uniform float uMinOpacity;
        uniform float uMaxOpacity;
        uniform float uOpacityFalloff;
        uniform float uOpacityOffset;

        uniform float uActiveIndex;
                uniform vec3 uHighlightColor;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;

          // elongate vertically and shrink horizontally
          uv.x *= uStretchX;
          uv.y /= uShrinkY;

          uv += 0.5;

          vec4 tex = texture2D(uTexture, uv);

          // 💡 KEY FIX: Sharpen texture when morphed
          // If we are fully morphed, we discard soft edges more aggressively
          // to prevent the "blob" look
          float alphaThreshold = mix(0.05, 0.2, vMorphFactor);
          if (tex.a < alphaThreshold) discard;

          // Calculate opacity based on depth
          float normalizedDepth = clamp((vDepth + uOpacityOffset) / uOpacityFalloff, 0.0, 1.0);
          float finalOpacity = mix(uMaxOpacity, uMinOpacity, normalizedDepth);

          // Optional: Boost opacity slightly when formed to make it crisp
          finalOpacity = mix(finalOpacity, 1.0, vMorphFactor * 0.5);
          vec3 finalColor = vColor;
          if (abs(vShapeIndex - uActiveIndex) < 0.1) {
                        // Mix based on morph factor so it only highlights when formed
                        finalColor = mix(vColor, uHighlightColor, vMorphFactor);
                    }

          gl_FragColor = tex * vec4(finalColor, finalOpacity);
        }
      `,
            transparent: true,
            depthWrite: false,
        });

        window.starfieldUniforms = material.uniforms;
        window.starfieldTotalDepth = totalDepth;
        window.starfieldMorphUniform = material.uniforms.uMorph;

        const stars = new THREE.Points(starsGeometry, material);
        scene.add(stars);

        let lastScroll = window.scrollY;
        let scrollSpeed = 0;
        let velocity = 0;
        let targetSpeed = 0;

        window.addEventListener('scroll', () => {
            const newScroll = window.scrollY;
            velocity = newScroll - lastScroll;
            lastScroll = newScroll;
            scrollSpeed += velocity * 0.05;
        });

        // ... existing mouse listener ...
        const mouse = { x: 0, y: 0 };
        document.addEventListener('mousemove', e => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        const animate = () => {
            material.uniforms.uTime.value = performance.now() / 1000;

            // Smoothly interpolate to target speed for fluid motion
            scrollSpeed += (targetSpeed - scrollSpeed) * 0.1;
            const morph = material.uniforms.uMorph.value;

            // Always move forward with baseSpeed, add scroll speed for reverse effect
            const currentSpeed = baseSpeed + scrollSpeed;

            // 🌌 Move stars along direction vector
            const dir = material.uniforms.uDirection.value;

            // Only move the container if we are NOT fully morphed
            if (morph < 0.99) {
                stars.position.addScaledVector(dir, currentSpeed);
            }

            // Update the uniform so the shader knows where the container is
            material.uniforms.uMeshPosition.value.copy(stars.position);

            // 🌠 Axis-agnostic wrapping
            const total = window.starfieldTotalDepth || totalDepth;
            const half = total / 2;

            if (Math.abs(dir.z) >= Math.abs(dir.x) && Math.abs(dir.z) >= Math.abs(dir.y)) {
                if (stars.position.z > half) stars.position.z -= total;
                if (stars.position.z < -half) stars.position.z += total;
            } else if (Math.abs(dir.y) >= Math.abs(dir.x) && Math.abs(dir.y) >= Math.abs(dir.z)) {
                if (stars.position.y > half) stars.position.y -= total;
                if (stars.position.y < -half) stars.position.y += total;
            } else {
                if (stars.position.x > half) stars.position.x -= total;
                if (stars.position.x < -half) stars.position.x += total;
            }

            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(plane, planeIntersectPoint);

            // Send this 3D point to the shader
            material.uniforms.uMousePos.value.copy(planeIntersectPoint);

            // Update the uniform

            // Decay scroll speed - returns to 0, leaving only baseSpeed
            targetSpeed *= 0.85;

            renderer.render(scene, camera);
        };
        renderer.setAnimationLoop(animate);

        // Resize
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        return () => {
            renderer.setAnimationLoop(null);
            window.removeEventListener('scroll', () => {});
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            starTexture.dispose();
            material.dispose();
            starsGeometry.dispose();
        };
    }, [controls, starData, isMobile]); // added isMobile to dependency
    // 💡 NEW EFFECT: Updates the shader color instantly when activeIndex changes
    useEffect(() => {
        // Check if the uniforms have been created and assigned to window
        if (window.starfieldUniforms) {
            window.starfieldUniforms.uActiveIndex.value = activeIndex;
        }
    }, [activeIndex]);
    return (
        <>
            <Leva hidden />
            <div className=" pointer-events-none ">
                <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
            </div>
        </>
    );
}

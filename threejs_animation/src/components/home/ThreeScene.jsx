// src/components/home/ThreeScene.jsx
"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ✅ OPTIMIZATION 1: Dynamic Three.js imports - only load when component mounts
let THREE = null;
let GLTFLoader = null;
let MeshSurfaceSampler = null;
let BufferGeometryUtils = null;
let RGBELoader = null;
let DRACOLoader = null;

const loadThreeDependencies = async () => {
  if (THREE) return; // Already loaded

  const [
    threeModule,
    gltfModule,
    samplerModule,
    bufferUtilsModule,
    rgbeModule,
    dracoModule,
  ] = await Promise.all([
    import("three"),
    import("three/addons/loaders/GLTFLoader.js"),
    import("three/addons/math/MeshSurfaceSampler.js"),
    import("three/addons/utils/BufferGeometryUtils.js"),
    import("three/examples/jsm/loaders/RGBELoader"),
    import("three/addons/loaders/DRACOLoader.js"),
  ]);

  THREE = threeModule;
  GLTFLoader = gltfModule.GLTFLoader;
  MeshSurfaceSampler = samplerModule.MeshSurfaceSampler;
  BufferGeometryUtils = bufferUtilsModule;
  RGBELoader = rgbeModule.RGBELoader;
  DRACOLoader = dracoModule.DRACOLoader;
};

gsap.registerPlugin(ScrollTrigger);

// ✅ Static data
const MESH_ORDER = {
  Curve001: 2,
  Curve002: 1,
  Curve_1: 3,
  Curve003: 4,
  Curve004: 5,
  Curve005: 6,
  Curve006: 7,
};

const SERVICE_COUNT = 7;

// ✅ Shader code as constants
const VERTEX_SHADER = `
  attribute vec3 aRandom;
  attribute float aSize;
  attribute vec3 aColor;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSizeMultiplier;

  varying float vProgress;
  varying vec3 vColor;
  varying float vDepth;

  void main() {
    vProgress = uProgress;
    vColor = aColor;

    vec3 explodeDir = normalize(vec3(0, (aRandom.y + 2.0) * 0.1, 1.0)) * (aRandom.z * 0.4) * uProgress;
    vec3 exploded = position + explodeDir * 2.0 * aRandom.z * uProgress;

    float orbitRadius = 0.2 + fract(aRandom.y) * 0.8;
    float speed = 0.2 + fract(aRandom.z) * 0.9;

    vec3 finalPosition = exploded;

    finalPosition.x += sin(uTime * speed + aRandom.x) * orbitRadius * uProgress;
    finalPosition.y += sin(uTime * speed + aRandom.y) * orbitRadius * uProgress;

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vDepth = mvPosition.z;
    vec4 viewPos = modelViewMatrix * vec4(exploded, 1.0);
    float dist = abs(viewPos.z);
    float baseSize = 1.5;
    float towardCamera = step(0.0, -explodeDir.z);
    float sizeByDistance = mix(1.0, (1.0 / (dist * 0.35 + 1.0)), towardCamera);
    float nearBoost = mix(1.0, 1.8, smoothstep(0.0, 0.0, -viewPos.z));
    gl_PointSize = baseSize * sizeByDistance * nearBoost * 100.0 / -viewPos.z * uSizeMultiplier;
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uTexture;
  uniform float uVisibility;
  uniform vec3 uDarkColor;
  uniform vec3 uLightColor;
  
  varying float vProgress;
  varying vec3 vColor;

  void main() {
    vec2 centeredCoord = gl_PointCoord - vec2(0.5);
    if (length(centeredCoord) > 0.5) discard;
    vec4 texColor = texture2D(uTexture, gl_PointCoord);

    vec3 targetColor = mix(vColor, mix(uDarkColor, uLightColor, 0.4), smoothstep(0.0, 1.0, vProgress));
    vec4 finalColor = vec4(targetColor, 1.0) * texColor;
    finalColor.a *= uVisibility;
    gl_FragColor = finalColor;
  }
`;

// Texture cache
let _particleTexture = null;
function getParticleTexture() {
  if (_particleTexture) return _particleTexture;
  if (typeof document === "undefined" || !THREE) return null;

  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, size, size);
  const cx = size / 2;
  const cy = size / 2;
  const coreR = Math.floor(size * 0.2);

  ctx.imageSmoothingEnabled = false;
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fill();

  _particleTexture = new THREE.CanvasTexture(canvas);
  _particleTexture.minFilter = THREE.LinearFilter;
  _particleTexture.magFilter = THREE.LinearFilter;
  _particleTexture.needsUpdate = true;
  return _particleTexture;
}

export default function ThreeScene({
  isMobile,
  isTablet,
  flowAnimation,
  flowingParticlesMaterialRef,
  setActiveServiceIndex,
}) {
  const canvasRef = useRef(null);
  const slicesRef = useRef([]);
  const isFloatingRef = useRef(true);
  const scrollYRef = useRef(0);
  const initialSlicePositionsRef = useRef([]);
  const initialSliceRotationsRef = useRef([]);
  const particlesMaterialRef = useRef(null);
  const timelineRef = useRef(null);
  const rendererRef = useRef(null);
  const isInitializedRef = useRef(false);

  const getSpiralTarget = useCallback(() => {
    if (isMobile) {
      return {
        position: { x: 0.015, y: 0.05, z: -0.29 },
        rotation: { x: -0.2, y: -1.5, z: 0 },
        duration: 4,
      };
    } else if (isTablet) {
      return {
        position: { x: 0.18, y: 0.08, z: -0.2 },
        rotation: { x: -0.16, y: -1.4, z: 0 },
        duration: 4.5,
      };
    }
    return {
      position: { x: 0.21, y: 0.1, z: -0.22 },
      rotation: { x: -0.181592653589793, y: -1.53159265358979, z: 0 },
      duration: 5,
    };
  }, [isMobile, isTablet]);

  useEffect(() => {
    if (!canvasRef.current || isInitializedRef.current) return;

    let renderer = null;
    let scene = null;
    let animationId = null;
    let hdrTexture = null;
    let particlesGeometry = null;

    const init = async () => {
      // ✅ OPTIMIZATION 1: Load Three.js dynamically
      await loadThreeDependencies();

      if (!canvasRef.current) return;
      isInitializedRef.current = true;

      const spiralTarget = getSpiralTarget();

      // Reset refs
      slicesRef.current = [];
      initialSlicePositionsRef.current = [];
      initialSliceRotationsRef.current = [];
      const logoMaterials = [];

      // Scene setup
      scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 5);

      // Optimized renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      // Resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", handleResize);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 5);
      scene.add(directionalLight);

      // ✅ OPTIMIZATION 4: Load optimized HDR (use 512px version)
      const rgbeLoader = new RGBELoader();
      rgbeLoader.load("/images/studio_small_03_512.hdr", (hdrMap) => {
        hdrMap.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = hdrMap;
        hdrTexture = hdrMap;
      });

      // Pre-create colors
      const DARK_COLOR = new THREE.Color("#12001a");
      const LIGHT_COLOR = new THREE.Color("#a96cff");

      // Create shader material
      const createShaderMaterial = () => {
        return new THREE.ShaderMaterial({
          uniforms: {
            uProgress: { value: 0.0 },
            uTexture: { value: getParticleTexture() },
            uVisibility: { value: 0.0 },
            uTime: { value: 0.0 },
            uSizeMultiplier: { value: 1.0 },
            uMouse: { value: new THREE.Vector2(0.0, 0.0) },
            uDarkColor: { value: DARK_COLOR },
            uLightColor: { value: LIGHT_COLOR },
          },
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          transparent: true,
          depthWrite: false,
        });
      };

      // Create particle system
      const createParticleSystem = (rawModel) => {
        const samplingGroup = new THREE.Group();
        samplingGroup.add(rawModel.clone());

        samplingGroup.traverse((child) => {
          if (child.isMesh) {
            child.position.set(
              spiralTarget.position.x,
              spiralTarget.position.y,
              spiralTarget.position.z
            );
            child.rotation.set(
              spiralTarget.rotation.x,
              spiralTarget.rotation.y,
              spiralTarget.rotation.z
            );
          }
        });

        const geometries = [];
        samplingGroup.updateWorldMatrix(true, true);
        samplingGroup.traverse((child) => {
          if (child.isMesh) {
            const geometry = child.geometry.clone();
            geometry.applyMatrix4(child.matrixWorld);
            geometries.push(geometry);
          }
        });

        if (geometries.length === 0) return null;

        const mergedGeometry = BufferGeometryUtils.mergeGeometries(
          geometries,
          false
        );
        const mergedMeshForSampling = new THREE.Mesh(mergedGeometry);

        const sampler = new MeshSurfaceSampler(mergedMeshForSampling).build();
        const numParticles = 30000;

        const newParticlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(numParticles * 3);
        const randoms = new Float32Array(numParticles * 3);
        const sizes = new Float32Array(numParticles);
        const colors = new Float32Array(numParticles * 3);

        const colorGradient = [
          "#7B3DAF",
          "#9B54CD",
          "#B56EE3",
          "#CF89F5",
          "#E9A4FF",
        ];

        let minX = Infinity,
          maxX = -Infinity;
        for (let i = 0; i < numParticles; i++) {
          const newPosition = new THREE.Vector3();
          sampler.sample(newPosition);
          positions[i * 3] = newPosition.x;
          positions[i * 3 + 1] = newPosition.y;
          positions[i * 3 + 2] = newPosition.z;

          minX = Math.min(minX, newPosition.x);
          maxX = Math.max(maxX, newPosition.x);
        }

        for (let i = 0; i < numParticles; i++) {
          const x = positions[i * 3];
          const t = (x - minX) / (maxX - minX);
          const gradientIndex = t * (colorGradient.length - 1);
          const lowerIndex = Math.floor(gradientIndex);
          const upperIndex = Math.ceil(gradientIndex);
          const localT = gradientIndex - lowerIndex;

          const color1 = new THREE.Color(colorGradient[lowerIndex]);
          const color2 = new THREE.Color(colorGradient[upperIndex]);
          const finalColor = color1.lerp(color2, localT);

          colors[i * 3] = finalColor.r;
          colors[i * 3 + 1] = finalColor.g;
          colors[i * 3 + 2] = finalColor.b;

          randoms[i * 3] = 0;
          randoms[i * 3 + 1] = 0;
          randoms[i * 3 + 2] = Math.random() * 5.0;

          sizes[i] = 12 + Math.random() * 94;
        }

        newParticlesGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        newParticlesGeometry.setAttribute(
          "aRandom",
          new THREE.BufferAttribute(randoms, 3)
        );
        newParticlesGeometry.setAttribute(
          "aSize",
          new THREE.BufferAttribute(sizes, 1)
        );
        newParticlesGeometry.setAttribute(
          "aColor",
          new THREE.BufferAttribute(colors, 3)
        );

        const particlesMaterial = createShaderMaterial();
        particlesMaterialRef.current = particlesMaterial;

        const particleSystem = new THREE.Points(
          newParticlesGeometry,
          particlesMaterial
        );
        scene.add(particleSystem);

        mergedGeometry.dispose();

        const checkAndSetupAnimation = () => {
          if (flowingParticlesMaterialRef.current) {
            setupScrollAnimation(logoMaterials, particlesMaterial, camera, spiralTarget);
          } else {
            requestAnimationFrame(checkAndSetupAnimation);
          }
        };
        checkAndSetupAnimation();

        return newParticlesGeometry;
      };

      // Setup scroll animation
      const setupScrollAnimation = (materials, particlesMaterial, camera, spiralTarget) => {
        gsap.set(".starfield-layer", { opacity: 0 });
        gsap.set(".text-wrapper", { opacity: 0, scale: 0.1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "#scroll-spacer",
            start: "top top",
            end: "100% bottom",
            scrub: 1.8,
            onUpdate: (self) => {
              gsap.to(flowAnimation.current, {
                scrollSpeed: self.getVelocity() * 0.005,
                duration: 0.9,
                overwrite: true,
              });
            },
          },
        });

        timelineRef.current = tl;

        tl.addLabel("initial");

        if (isMobile) {
          tl.to(camera.position, {
            x: 0,
            y: 0,
            z: 8,
            ease: "power1.inOut",
            onUpdate: () => camera.updateProjectionMatrix(),
          });
        }

        slicesRef.current.forEach((slice, index) => {
          const delay = index * 0.6;

          tl.to(
            slice.position,
            {
              ...spiralTarget.position,
              duration: spiralTarget.duration,
              ease: "power1.inOut",
            },
            delay
          );

          tl.to(
            slice.rotation,
            {
              ...spiralTarget.rotation,
              duration: spiralTarget.duration,
              ease: "power1.inOut",
            },
            delay
          );
        });

        tl.to(
          ".initial-text",
          {
            y: "-10vh",
            opacity: 0,
            duration: 3.5,
            ease: "power1.inOut",
          },
          "<-3"
        );

        tl.to(
          ".second-text",
          {
            y: "2vh",
            opacity: 1,
            duration: 3.5,
            ease: "power1.inOut",
          },
          ">+1"
        );

        tl.addLabel("rotation");
        tl.to(
          ".second-text",
          { opacity: 0, duration: 3.5, ease: "power1.inOut" },
          ">"
        );

        tl.to(
          particlesMaterial.uniforms.uVisibility,
          { value: 1, duration: 4 },
          ">1"
        );

        materials.forEach((mat) => {
          tl.to(mat, { opacity: 0, duration: 0.8, ease: "power2.out" }, "<");
        });

        tl.to(
          particlesMaterial.uniforms.uProgress,
          { value: 1, duration: 10, ease: "power1.inOut" },
          ">"
        );

        tl.to(
          camera,
          {
            fov: 4,
            duration: 10,
            ease: "power1.inOut",
            onUpdate: () => camera.updateProjectionMatrix(),
          },
          "<"
        );

        tl.to(
          particlesMaterial.uniforms.uSizeMultiplier,
          { value: 0, duration: 0.5, ease: "power2.in" },
          ">-3"
        );

        tl.to(
          particlesMaterial.uniforms.uVisibility,
          { value: 0, duration: 0.7, ease: "power2.inOut" },
          "<"
        );

        tl.addLabel("starfieldFadeIn", ">-1");

        tl.to(
          ".starfield-layer",
          { opacity: 1, duration: 3, ease: "power2.inOut" },
          ">-3.5"
        );

        const flyingTexts = document.querySelectorAll(".text-wrapper");
        const textDuration = 8;
        const overlap = 0.3;

        flyingTexts.forEach((el, i) => {
          const startTime =
            i === 0 ? ">" : `>-=${textDuration * overlap + 0.5}`;
          const labelName = `flyingText-${i}`;
          tl.addLabel(labelName, startTime);

          if (i === flyingTexts.length - 1) {
            tl.fromTo(
              el,
              { opacity: 0, scale: 0.1 },
              {
                opacity: 1,
                scale: 1.1,
                y: 0,
                ease: "power2.out",
                duration: textDuration,
              },
              "afterSecondText"
            );
            tl.addLabel("thirdTextHold", "+=3");
            tl.to(
              el,
              {
                y: -300,
                opacity: 0,
                scale: 1.1,
                duration: textDuration,
                ease: "power2.inOut",
              },
              "thirdTextHold"
            );
          } else {
            tl.fromTo(
              el,
              { opacity: 0, scale: 0.1 },
              {
                opacity: 0,
                scale: 1.1,
                ease: "power2.inOut",
                duration: textDuration,
                onUpdate: function () {
                  const p = this.progress();
                  const fade = Math.pow(Math.sin(p * Math.PI), 2.2);
                  gsap.set(el, { opacity: fade });
                },
              },
              labelName
            );
          }

          if (i === 1) {
            tl.addLabel("afterSecondText", ">");
            tl.to(
              window.starfieldUniforms?.uDirection?.value || { x: 0, y: 0, z: 1 },
              {
                x: 0,
                y: 1,
                z: 0,
                duration: 2,
                ease: "power2.inOut",
              },
              `>-${textDuration * 0.33}`
            );
          }
        });

        const starfieldMorphState = { value: 0 };
        tl.to(
          starfieldMorphState,
          {
            value: 1,
            duration: 12,
            ease: "power2.inOut",
            onUpdate: () => {
              if (window.starfieldMorphUniform) {
                window.starfieldMorphUniform.value = starfieldMorphState.value;
              }
            },
          },
          "<"
        );

        const TRANSITION_DURATION = 2.5;

        gsap.set(".service-text", { opacity: 0 });
        setActiveServiceIndex(0);

        tl.fromTo(
          ".service-0",
          { opacity: 0, y: -100, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power3.out",
            onStart: () => setActiveServiceIndex(0),
          },
          ">-1"
        );

        for (let i = 1; i < SERVICE_COUNT; i++) {
          tl.addLabel(`service-${i}`, ">+1.2");

          tl.to(
            `.service-${i - 1}`,
            {
              opacity: 0,
              y: -100,
              filter: "blur(10px)",
              duration: 1.2,
              ease: "power2.inOut",
            },
            `>+${TRANSITION_DURATION * 0.8}`
          );

          tl.fromTo(
            `.service-${i}`,
            { opacity: 0, y: -100, filter: "blur(12px)" },
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 1.4,
              ease: "power3.out",
              onStart: () => setActiveServiceIndex(i),
              onReverseComplete: () => {
                requestAnimationFrame(() => {
                  setActiveServiceIndex(i - 1 >= 0 ? i - 1 : 0);
                });
              },
            },
            "<"
          );
        }

        tl.to(
          {},
          {
            duration: 0.1,
            onComplete: () => setActiveServiceIndex(SERVICE_COUNT - 1),
          },
          "serviceEnd"
        );

        gsap.set(".statSection", { pointerEvents: "auto" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".statSection",
              start: "top bottom",
              end: "top top",
              scrub: 1.2,
            },
          })
          .to(".statSection", { opacity: 1, ease: "none" }, 0)
          .to(".next-section", { opacity: 0, ease: "none" }, 0);

        ScrollTrigger.refresh();
      };

      // ✅ OPTIMIZATION 2: Setup Draco loader for compressed GLB
      const gltfLoader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/"); // You need to add draco decoder files
      gltfLoader.setDRACOLoader(dracoLoader);

      // Load GLTF model (use compressed version if available)
      gltfLoader.load(
        "/models/model-draco.glb", // ✅ Use Draco-compressed model
        (gltf) => {
          const rawModel = gltf.scene;
          scene.add(rawModel);

          if (isMobile) {
            rawModel.scale.set(14, 14, 6);
            rawModel.position.set(0.8, -3.3, 0);
          } else if (isTablet) {
            rawModel.scale.set(17, 17, 4);
            rawModel.position.set(-2.3, -2.4, 0);
          } else {
            rawModel.scale.set(17, 17, 4);
            rawModel.position.set(-2.3, -2.8, 0);
          }
          rawModel.rotation.set(0, 0, 0);

          rawModel.traverse((child) => {
            if (child.isMesh) {
              slicesRef.current.push(child);
              child.material.transparent = true;
              child.material.depthWrite = false;
              logoMaterials.push(child.material);
              initialSlicePositionsRef.current.push(child.position.clone());
              initialSliceRotationsRef.current.push(child.rotation.clone());
            }
          });

          slicesRef.current.sort(
            (a, b) => MESH_ORDER[a.name] - MESH_ORDER[b.name]
          );

          slicesRef.current.forEach((slice) => {
            slice.position.set(0, 0, 0);
            slice.rotation.set(0, 0, 0);
          });

          particlesGeometry = createParticleSystem(rawModel);
        },
        undefined,
        (error) => {
          console.error("GLTF Load Error:", error);
          // Fallback to non-compressed model
          gltfLoader.load("/models/model.glb", (gltf) => {
            // Same loading logic...
          });
        }
      );

      // Floating animation
      const applyFloating = (time) => {
        const slices = slicesRef.current;
        const initialPositions = initialSlicePositionsRef.current;
        const initialRotations = initialSliceRotationsRef.current;

        if (slices.length === 0 || initialPositions.length !== slices.length)
          return;

        slices.forEach((slice, i) => {
          const basePos = initialPositions[i];
          const baseRot = initialRotations[i];

          if (!basePos || !baseRot) return;

          const offset = 0.5;
          const speed = 0.9 + i * 0.1;

          slice.position.x =
            basePos.x + Math.sin(time * speed + offset) * 0.0035;
          slice.position.y =
            basePos.y + Math.cos(time * speed + offset) * 0.0035;
          slice.position.z = basePos.z + Math.sin(time * 0.5 + offset) * 0.003;

          slice.rotation.x =
            baseRot.x + Math.sin(time * speed * 0.3 + offset) * 0.008;
          slice.rotation.y =
            baseRot.y + Math.cos(time * speed * 0.25 + offset) * 0.008;
        });
      };

      // Animation loop
      const animate = () => {
        const time = performance.now() * 0.001;

        if (particlesMaterialRef.current) {
          particlesMaterialRef.current.uniforms.uTime.value = time;
        }

        if (
          isFloatingRef.current &&
          slicesRef.current.length > 0 &&
          initialSlicePositionsRef.current.length === slicesRef.current.length
        ) {
          applyFloating(time);
        }

        renderer.render(scene, camera);
      };

      renderer.setAnimationLoop(animate);

      // Scroll handler
      const handleScroll = () => {
        scrollYRef.current = window.scrollY;

        if (scrollYRef.current > 5 && isFloatingRef.current) {
          isFloatingRef.current = false;
        }

        if (scrollYRef.current <= 5 && !isFloatingRef.current) {
          isFloatingRef.current = true;
        }
      };

      window.addEventListener("scroll", handleScroll, { passive: true });

      // Store cleanup references
      return { renderer, scene, handleResize, handleScroll, hdrTexture, particlesGeometry };
    };

    let cleanupRefs = null;

    init().then((refs) => {
      cleanupRefs = refs;
    });

    // Cleanup
    return () => {
      if (cleanupRefs) {
        const { renderer, scene, handleResize, handleScroll, hdrTexture, particlesGeometry } = cleanupRefs;

        renderer?.setAnimationLoop(null);

        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);

        if (timelineRef.current) {
          timelineRef.current.kill();
        }
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

        scene?.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((mat) => mat.dispose());
            } else {
              object.material.dispose();
            }
          }
        });

        if (particlesGeometry) particlesGeometry.dispose();
        if (particlesMaterialRef.current) particlesMaterialRef.current.dispose();
        if (hdrTexture) hdrTexture.dispose();

        renderer?.dispose();
      }

      isInitializedRef.current = false;
    };
  }, [isMobile, isTablet, getSpiralTarget, flowAnimation, flowingParticlesMaterialRef, setActiveServiceIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 h-full w-full pointer-events-none"
    />
  );
}
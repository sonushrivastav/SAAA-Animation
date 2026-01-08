// "use client";
// import { Environment, PerspectiveCamera, useGLTF } from "@react-three/drei";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Suspense, useEffect, useMemo, useRef } from "react";

// // Pre-loading helps prevent the "jump" when a user scrolls to the section
// // Replace these with your actual compressed model paths
// // useGLTF.preload('/models/investor.glb');
// // useGLTF.preload('/models/finance.glb');
// // useGLTF.preload('/models/grow.glb');

// function GlassModel({
//   url,
//   floating = true,
//   speed = 1,
//   amplitude = 0.05,
//   motionVariant = 0,
//   mouseInfluence = true,
//   rotateY = false,
// }) {
//   // Dynamic Preloader
//   useEffect(() => {
//     if (url) useGLTF.preload(url);
//   }, [url]);

//   // 1. Optimized Loading with Draco support
//   // This uses a public CDN for the decoder so you don't have to host it

//   const { scene: originalScene } = useGLTF(
//     url,
//     "https://www.gstatic.com/draco/versioned/decoders/1.5.5/"
//   );

//   // 2. Memoize the cloned scene to prevent memory leaks on re-render
//   const scene = useMemo(() => {
//     const clone = originalScene.clone();
//     clone.traverse((child) => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//         // child.material.transparent = true;
//         // child.material.opacity = 0.9;
//       }
//     });
//     return clone;
//   }, [originalScene]);

//   const ref = useRef();
//   const mouse = useRef({ x: 0, y: 0 });

//   useEffect(() => {
//     if (!mouseInfluence) return;
//     const handleMouseMove = (e) => {
//       mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
//       mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
//     };
//     window.addEventListener("mousemove", handleMouseMove, { passive: true });
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [mouseInfluence]);

//   useFrame(({ clock, invalidate }) => {
//     if (!ref.current) return;
//     invalidate();

//     const t = clock.getElapsedTime() * speed;
//     const mesh = ref.current;

//     if (rotateY) {
//       mesh.rotation.y += 0.01;
//     } else {
//       mesh.rotation.x += 0.01;

//       mesh.rotation.y += 0.01;
//     }

//     // Base floating logic
//     switch (motionVariant) {
//       case 0:
//         mesh.position.x = Math.sin(t) * amplitude;
//         mesh.position.y = Math.cos(t * 0.8) * amplitude * 0.8;
//         break;

//       case 1:
//         mesh.position.x = Math.cos(t * 1.2) * amplitude * 1.2;
//         mesh.position.y = Math.sin(t * 0.7) * amplitude * 0.9;
//         break;

//       case 2:
//         mesh.position.x = Math.sin(t * 0.6) * amplitude;
//         mesh.position.y = Math.cos(t * 1.4) * amplitude;
//         break;

//       case 3:
//         mesh.position.x = Math.cos(t * 0.9) * amplitude * 0.7;
//         mesh.position.y = Math.sin(t * 1.1) * amplitude;
//         break;
//     }

//     // Mouse parallax
//     if (mouseInfluence) {
//       mesh.position.x += mouse.current.x * 0.05;
//       mesh.position.y += mouse.current.y * 0.05;
//     }
//   });

//   return (
//     <group ref={ref} position={[0, 0, 0]} scale={[4.5, 4.5, 4.5]}>
//       <primitive position={[0.08, -0.4, 0]} object={scene} />
//     </group>
//   );
// }

// function Loader() {
//   return (
//     <mesh>
//       <sphereGeometry args={[0.5, 16, 16]} />
//       <meshStandardMaterial color="#844de9" wireframe />
//     </mesh>
//   );
// }

// export default function ThreeGlass({
//   modelUrl,
//   speed = 1,
//   amplitude = 0.05,
//   motionVariant = 0,
//   mouseInfluence = false,
//   rotateY = false,
// }) {
//   return (
//     <div className="w-full h-full ">
//       <Canvas
//         shadows={false}
//         frameloop="demand"
//         gl={{
//           alpha: true,
//           antialias: true,
//           powerPreference: "high-performance",
//         }}
//         dpr={[1, 2]} // Limits resolution on high-density screens for speed
//       >
//         <PerspectiveCamera makeDefault position={[0, 0, 5]} />
//         <ambientLight intensity={0.5} />
//         <pointLight position={[10, 10, 10]} intensity={1} />
//         <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

//         <Environment preset="sunset" />

//         <Suspense fallback={<Loader />}>
//           <GlassModel
//             url={modelUrl}
//             speed={speed}
//             amplitude={amplitude}
//             motionVariant={motionVariant}
//             mouseInfluence={mouseInfluence}
//             rotateY={rotateY}
//           />
//         </Suspense>
//       </Canvas>
//     </div>
//   );
// }


// src/components/servicePage/FloatingGlass.jsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

// ✅ MODULE LEVEL: Cached loaders
let gltfLoader = null;
let dracoLoader = null;
let rgbeLoader = null;
let cachedEnvMap = null;

const getGLTFLoader = () => {
  if (!gltfLoader) {
    gltfLoader = new GLTFLoader();
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/");
    gltfLoader.setDRACOLoader(dracoLoader);
  }
  return gltfLoader;
};

const getRGBELoader = () => {
  if (!rgbeLoader) {
    rgbeLoader = new RGBELoader();
  }
  return rgbeLoader;
};

// ✅ MODULE LEVEL: Cache loaded models
const modelCache = new Map();

const loadModel = (url) => {
  if (modelCache.has(url)) {
    return Promise.resolve(modelCache.get(url));
  }
  
  return new Promise((resolve, reject) => {
    getGLTFLoader().load(
      url,
      (gltf) => {
        modelCache.set(url, gltf);
        resolve(gltf);
      },
      undefined,
      reject
    );
  });
};

// ✅ PRELOAD all models at module level
const MODEL_URLS = ["/models/design.glb", "/models/build.glb", "/models/grow.glb"];
MODEL_URLS.forEach((url) => loadModel(url));

export default function ThreeGlass({
  modelUrl,
  speed = 1,
  amplitude = 0.05,
  motionVariant = 0,
  mouseInfluence = false,
  rotateY = false,
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const groupRef = useRef(null); // ✅ Group for animation (like original)
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef(null);
  const isVisibleRef = useRef(true);
  const clockRef = useRef(new THREE.Clock());

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ✅ Setup renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
      stencil: false,
    });
    
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ✅ Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ✅ Setup camera (same as original)
    const camera = new THREE.PerspectiveCamera(
      75, // ✅ Original FOV
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5); // ✅ Original position
    cameraRef.current = camera;

    // ✅ Lighting (same as original)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(-10, 10, 10);
    spotLight.angle = 0.15;
    spotLight.penumbra = 1;
    scene.add(spotLight);

    // ✅ Load environment map (cached)
    if (!cachedEnvMap) {
      getRGBELoader().load("/images/studio_small_03_1k.hdr", (hdrMap) => {
        hdrMap.mapping = THREE.EquirectangularReflectionMapping;
        cachedEnvMap = hdrMap;
        scene.environment = cachedEnvMap;
      });
    } else {
      scene.environment = cachedEnvMap;
    }

    // ✅ Create group for animation (same as original)
    const group = new THREE.Group();
    group.position.set(0, 0, 0); // ✅ Original group position
    group.scale.set(4.5, 4.5, 4.5); // ✅ Original scale from your code
    scene.add(group);
    groupRef.current = group;

    // ✅ Load model from cache
    loadModel(modelUrl).then((gltf) => {
      const model = gltf.scene.clone();
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          child.frustumCulled = true;
        }
      });
      
      // ✅ Original model position inside group
      model.position.set(0.08, -0.4, 0);
      group.add(model);
    });

    // ✅ Mouse handler (throttled)
    let lastMouseUpdate = 0;
    const handleMouseMove = (e) => {
      if (!mouseInfluence) return;
      const now = performance.now();
      if (now - lastMouseUpdate < 32) return;
      lastMouseUpdate = now;
      
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // ✅ Visibility observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // ✅ Resize handler (debounced)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // ✅ Animation loop (same logic as original)
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current || !groupRef.current) return;

      const t = clockRef.current.getElapsedTime() * speed;
      const mesh = groupRef.current;

      // ✅ Original rotation logic
      if (rotateY) {
        mesh.rotation.y += 0.01;
      } else {
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
      }

      // ✅ Original motion variants (same as your code)
      switch (motionVariant) {
        case 0:
          mesh.position.x = Math.sin(t) * amplitude;
          mesh.position.y = Math.cos(t * 0.8) * amplitude * 0.8;
          break;
        case 1:
          mesh.position.x = Math.cos(t * 1.2) * amplitude * 1.2;
          mesh.position.y = Math.sin(t * 0.7) * amplitude * 0.9;
          break;
        case 2:
          mesh.position.x = Math.sin(t * 0.6) * amplitude;
          mesh.position.y = Math.cos(t * 1.4) * amplitude;
          break;
        case 3:
          mesh.position.x = Math.cos(t * 0.9) * amplitude * 0.7;
          mesh.position.y = Math.sin(t * 1.1) * amplitude;
          break;
      }

      // ✅ Original mouse parallax
      if (mouseInfluence) {
        mesh.position.x += mouseRef.current.x * 0.05;
        mesh.position.y += mouseRef.current.y * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ✅ Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      clearTimeout(resizeTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, speed, amplitude, motionVariant, mouseInfluence, rotateY]);

  return <div ref={containerRef} className="w-full h-full" />;
}
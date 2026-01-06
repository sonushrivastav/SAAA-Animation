// "use client";

// import { useFrame } from "@react-three/fiber";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useControls } from "leva";
// import { useMemo, useRef } from "react";
// import * as THREE from "three";

// gsap.registerPlugin(ScrollTrigger);

// function createCircleTexture() {
//   const size = 128;
//   const canvas = document.createElement("canvas");
//   canvas.width = size;
//   canvas.height = size;
//   const ctx = canvas.getContext("2d");

//   ctx.clearRect(0, 0, size, size);
//   const cx = size / 2;
//   const cy = size / 2;
//   const coreR = Math.floor(size * 0.2);

//   ctx.imageSmoothingEnabled = false;
//   ctx.beginPath();
//   ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.fillStyle = "rgba(255,255,255,1)";
//   ctx.fill();

//   const tex = new THREE.CanvasTexture(canvas);
//   tex.minFilter = THREE.LinearFilter;
//   tex.magFilter = THREE.LinearFilter;
//   tex.needsUpdate = true;
//   return tex;
// }

// // Create flow lines
// function createCurves(curveSpread = 1.5, yCurve = 1, zCurve = 1) {
//   const curves = [];
//   const numLines = 25;
//   const width = 22;

//   for (let i = 0; i < numLines; i++) {
//     const x = THREE.MathUtils.lerp(-width / 2, width / 2, i / (numLines - 1));
//     const points = [];

//     points.push(new THREE.Vector3(x * curveSpread, 22 + yCurve, -6 + zCurve));
//     points.push(
//       new THREE.Vector3(x * 0.8 * curveSpread, 2 + yCurve, -3 + zCurve)
//     );
//     points.push(
//       new THREE.Vector3(x * 1.2 * curveSpread, 0 + yCurve, 0 + zCurve)
//     );
//     points.push(
//       new THREE.Vector3(x * 1.5 * curveSpread, -2 + yCurve, 3 + zCurve)
//     );
//     points.push(
//       new THREE.Vector3(x * 2.0 * curveSpread, -3 + yCurve, 5 + zCurve)
//     );

//     curves.push(new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5));
//   }
//   return curves;
// }

// export default function FlowingParticles({ flowAnimation, materialRef }) {
//   const groupRef = useRef();
  

//   const {
//     minSize,
//     maxSize,
//     flowSpeed,
//     curveSpread,
//     yCurve,
//     zCurve,
//     startPoint,
//     endPoint,
//   } = useControls({
//     minSize: { value: 0.2, min: 0.05, max: 0.5, step: 0.01 },
//     maxSize: { value: 0.35, min: 0.2, max: 1.5, step: 0.01 },
//     flowSpeed: { value: 1, min: 0.1, max: 3, step: 0.01 },
//     yCurve: { value: -5.8, min: -10, max: 13, step: 0.01 },
//     zCurve: { value: -2.44, min: -10, max: 13, step: 0.01 },
//     curveSpread: { value: 2.12, min: -10, max: 10, step: 0.01 },
//     startPoint: { value: 0.3, min: 0.0, max: 1.0, step: 0.01 },
//     endPoint: { value: 0.6, min: 0.0, max: 1.0, step: 0.01 },
//   });

//   const curves = useMemo(
//     () => createCurves(curveSpread, yCurve, zCurve),
//     [curveSpread, yCurve, zCurve]
//   );

//   const countPerCurve = 50;
//   const totalParticles = curves.length * countPerCurve;

//   // positions
//   const positions = useMemo(() => {
//     const arr = new Float32Array(totalParticles * 3);
//     let i3 = 0;
//     for (let i = 0; i < totalParticles; i++) {
//       const curveIndex = Math.floor(i / countPerCurve);
//       const idxInCurve = i % countPerCurve;
//       const u = idxInCurve / Math.max(1, countPerCurve - 1);
//       const pos = curves[curveIndex].getPointAt(u);
//       arr[i3++] = pos.x;
//       arr[i3++] = pos.y;
//       arr[i3++] = pos.z;
//     }
//     return arr;
//   }, [curves, totalParticles, countPerCurve]);

//   // speeds
//   const speeds = useMemo(
//     () => new Float32Array(totalParticles).map(() => 0.02 + 0.01),
//     [totalParticles]
//   );

//   // offsets
//   const offsets = useMemo(() => {
//     const o = new Float32Array(totalParticles);
//     for (let i = 0; i < totalParticles; i++) {
//       const idxInCurve = i % countPerCurve;
//       o[i] = idxInCurve / Math.max(1, countPerCurve);
//     }
//     return o;
//   }, [totalParticles, countPerCurve]);

//   // sizes per particle (dynamic)
//   const sizes = useMemo(
//     () => new Float32Array(totalParticles).fill(minSize),
//     [totalParticles, minSize]
//   );

//   useFrame((state, delta) => {
//     if (!groupRef.current) return;

//     const positionsArray = groupRef.current.geometry.attributes.position.array;
//     const sizesArray = groupRef.current.geometry.attributes.size.array;
//     // const currentScrollSpeed = scrollState.current.scrollSpeed;
//     const currentScrollSpeed = flowAnimation.current.scrollSpeed;
//     // scrollState.current.scrollSpeed *= 0.9;

//     let idx = 0;
//     for (let i = 0; i < totalParticles; i++) {
//       const curveIndex = Math.floor(i / countPerCurve);
//       const speed = speeds[i];

//       offsets[i] +=
//         delta * speed * flowSpeed + currentScrollSpeed * speed * 0.01;
//       5;
//       let u = offsets[i] % 1.0;
//       if (u < 0) u += 1.0;

//       const pos = curves[curveIndex].getPointAt(u);
//       positionsArray[idx++] = pos.x;
//       positionsArray[idx++] = pos.y;
//       positionsArray[idx++] = pos.z;

//       // 🔽 Size interpolation logic
//       if (u >= startPoint && u <= endPoint) {
//         const t = (u - startPoint) / (endPoint - startPoint); // 0 → 1
//         sizesArray[i] = THREE.MathUtils.lerp(minSize, maxSize, t);
//       } else if (u > endPoint) {
//         sizesArray[i] = maxSize;
//       } else {
//         sizesArray[i] = minSize;
//       }
//     }

//     groupRef.current.geometry.attributes.position.needsUpdate = true;
//     groupRef.current.geometry.attributes.size.needsUpdate = true;
//   });

//   return (
//     <points ref={groupRef}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={positions.length / 3}
//           array={positions}
//           itemSize={3}
//         />
//         {/* 🔽 Added size attribute */}
//         <bufferAttribute
//           attach="attributes-size"
//           count={sizes.length}
//           array={sizes}
//           itemSize={1}
//         />
//       </bufferGeometry>

//       {/* 🔽 Using shaderMaterial to support per-particle size */}
//       <shaderMaterial
//         ref={materialRef}
//         transparent
//         blending={THREE.AdditiveBlending}
//         uniforms={{
//           pointTexture: { value: createCircleTexture() },
//           color: { value: new THREE.Color("#AB76E2") }, // uniform color
//           uOpacity: { value: 1.0 },
//         }}
//         vertexShader={`
//     attribute float size;
//     uniform vec3 color;
//     varying vec3 vColor;
//     void main() {
//       vColor = color;
//       vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//       gl_PointSize = size * (300.0 / -mvPosition.z); // perspective scale
//       gl_Position = projectionMatrix * mvPosition;
//     }
//   `}
//         fragmentShader={`
//     uniform sampler2D pointTexture;
//     varying vec3 vColor;
//                 uniform float uOpacity;

//     void main() {
//       vec4 finalColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
//                 // 5. Multiply the final alpha by the opacity uniform
//                 finalColor.a *= uOpacity;
//                 if (finalColor.a < 0.01) discard;
//                 gl_FragColor = finalColor;
//     }
//   `}
//       />
//     </points>
//   );
// }


"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// ✅ FIX: Move texture creation OUTSIDE component - created once
const circleTexture = (() => {
  if (typeof document === "undefined") return null;
  
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

  const tex = new THREE.CanvasTexture(canvas);
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
})();

// ✅ FIX: Static config values (removed leva for production)
const CONFIG = {
  minSize: 0.2,
  maxSize: 0.35,
  flowSpeed: 1,
  curveSpread: 2.12,
  yCurve: -5.8,
  zCurve: -2.44,
  startPoint: 0.3,
  endPoint: 0.6,
};

// ✅ FIX: Create curves outside component with static values
function createCurves(curveSpread, yCurve, zCurve) {
  const curves = [];
  const numLines = 25;
  const width = 22;

  for (let i = 0; i < numLines; i++) {
    const x = THREE.MathUtils.lerp(-width / 2, width / 2, i / (numLines - 1));
    const points = [
      new THREE.Vector3(x * curveSpread, 22 + yCurve, -6 + zCurve),
      new THREE.Vector3(x * 0.8 * curveSpread, 2 + yCurve, -3 + zCurve),
      new THREE.Vector3(x * 1.2 * curveSpread, 0 + yCurve, 0 + zCurve),
      new THREE.Vector3(x * 1.5 * curveSpread, -2 + yCurve, 3 + zCurve),
      new THREE.Vector3(x * 2.0 * curveSpread, -3 + yCurve, 5 + zCurve),
    ];
    curves.push(new THREE.CatmullRomCurve3(points, false, "centripetal", 0.5));
  }
  return curves;
}

export default function FlowingParticles({ flowAnimation, materialRef }) {
  const groupRef = useRef();
  const offsetsRef = useRef(null);

  // ✅ Memoize curves - only created once
  const curves = useMemo(
    () => createCurves(CONFIG.curveSpread, CONFIG.yCurve, CONFIG.zCurve),
    []
  );

  const countPerCurve = 50;
  const totalParticles = curves.length * countPerCurve;

  // ✅ Memoize positions
  const positions = useMemo(() => {
    const arr = new Float32Array(totalParticles * 3);
    let i3 = 0;
    for (let i = 0; i < totalParticles; i++) {
      const curveIndex = Math.floor(i / countPerCurve);
      const idxInCurve = i % countPerCurve;
      const u = idxInCurve / Math.max(1, countPerCurve - 1);
      const pos = curves[curveIndex].getPointAt(u);
      arr[i3++] = pos.x;
      arr[i3++] = pos.y;
      arr[i3++] = pos.z;
    }
    return arr;
  }, [curves, totalParticles]);

  // ✅ Memoize speeds
  const speeds = useMemo(
    () => new Float32Array(totalParticles).map(() => 0.02 + 0.01),
    [totalParticles]
  );

  // ✅ Initialize offsets once and store in ref (mutable)
  useEffect(() => {
    const o = new Float32Array(totalParticles);
    for (let i = 0; i < totalParticles; i++) {
      const idxInCurve = i % countPerCurve;
      o[i] = idxInCurve / Math.max(1, countPerCurve);
    }
    offsetsRef.current = o;
  }, [totalParticles, countPerCurve]);

  // ✅ Memoize sizes
  const sizes = useMemo(
    () => new Float32Array(totalParticles).fill(CONFIG.minSize),
    [totalParticles]
  );

  // ✅ Memoize shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      uniforms: {
        pointTexture: { value: circleTexture },
        color: { value: new THREE.Color("#AB76E2") },
        uOpacity: { value: 1.0 },
      },
      vertexShader: `
        attribute float size;
        uniform vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float uOpacity;
        varying vec3 vColor;
        void main() {
          vec4 finalColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
          finalColor.a *= uOpacity;
          if (finalColor.a < 0.01) discard;
          gl_FragColor = finalColor;
        }
      `,
    });
  }, []);

  // ✅ Set materialRef for external access
  useEffect(() => {
    if (materialRef) {
      materialRef.current = shaderMaterial;
    }
  }, [shaderMaterial, materialRef]);

  useFrame((state, delta) => {
    if (!groupRef.current || !offsetsRef.current) return;

    const positionsArray = groupRef.current.geometry.attributes.position.array;
    const sizesArray = groupRef.current.geometry.attributes.size.array;
    const offsets = offsetsRef.current;
    const currentScrollSpeed = flowAnimation?.current?.scrollSpeed || 0;

    const { minSize, maxSize, flowSpeed, startPoint, endPoint } = CONFIG;

    let idx = 0;
    for (let i = 0; i < totalParticles; i++) {
      const curveIndex = Math.floor(i / countPerCurve);
      const speed = speeds[i];

      offsets[i] += delta * speed * flowSpeed + currentScrollSpeed * speed * 0.01;
      let u = offsets[i] % 1.0;
      if (u < 0) u += 1.0;

      const pos = curves[curveIndex].getPointAt(u);
      positionsArray[idx++] = pos.x;
      positionsArray[idx++] = pos.y;
      positionsArray[idx++] = pos.z;

      // Size interpolation
      if (u >= startPoint && u <= endPoint) {
        const t = (u - startPoint) / (endPoint - startPoint);
        sizesArray[i] = THREE.MathUtils.lerp(minSize, maxSize, t);
      } else if (u > endPoint) {
        sizesArray[i] = maxSize;
      } else {
        sizesArray[i] = minSize;
      }
    }

    groupRef.current.geometry.attributes.position.needsUpdate = true;
    groupRef.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={groupRef} material={shaderMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
}

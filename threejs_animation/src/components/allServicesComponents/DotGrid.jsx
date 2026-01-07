// "use client";
// import { gsap } from "gsap";
// import { InertiaPlugin } from "gsap/InertiaPlugin";
// import { useCallback, useEffect, useMemo, useRef } from "react";

// gsap.registerPlugin(InertiaPlugin);

// const throttle = (func, limit) => {
//   let lastCall = 0;
//   return function (...args) {
//     const now = performance.now();
//     if (now - lastCall >= limit) {
//       lastCall = now;
//       func.apply(this, args);
//     }
//   };
// };

// function hexToRgb(hex) {
//   const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
//   if (!m) return { r: 0, g: 0, b: 0 };
//   return {
//     r: parseInt(m[1], 16),
//     g: parseInt(m[2], 16),
//     b: parseInt(m[3], 16),
//   };
// }

// const DotGrid = ({
//   dotSize = 16,
//   gap = 32,
//   baseColor = "#5227FF",
//   activeColor = "#5227FF",
//   proximity = 150,
//   speedTrigger = 100,
//   shockRadius = 250,
//   shockStrength = 5,
//   maxSpeed = 5000,
//   resistance = 750,
//   returnDuration = 1.5,
//   className = "",
//   style,
// }) => {
//   const wrapperRef = useRef(null);
//   const canvasRef = useRef(null);
//   const dotsRef = useRef([]);
//   const pointerRef = useRef({
//     x: 0,
//     y: 0,
//     vx: 0,
//     vy: 0,
//     speed: 0,
//     lastTime: 0,
//     lastX: 0,
//     lastY: 0,
//   });
//   const isVisibleRef = useRef(false);
//   const isScrollingRef = useRef(false);

//   const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
//   const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

//   const circlePath = useMemo(() => {
//     if (typeof window === "undefined" || !window.Path2D) return null;

//     const p = new Path2D();
//     p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
//     return p;
//   }, [dotSize]);

//   const buildGrid = useCallback(() => {
//     const wrap = wrapperRef.current;
//     const canvas = canvasRef.current;
//     if (!wrap || !canvas) return;

//     const { width, height } = wrap.getBoundingClientRect();
//     const dpr = window.devicePixelRatio || 1;

//     canvas.width = width * dpr;
//     canvas.height = height * dpr;
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;
//     const ctx = canvas.getContext("2d");
//     if (ctx) ctx.scale(dpr, dpr);

//     const cols = Math.floor((width + gap) / (dotSize + gap));
//     const rows = Math.floor((height + gap) / (dotSize + gap));
//     const cell = dotSize + gap;

//     const gridW = cell * cols - gap;
//     const gridH = cell * rows - gap;

//     const extraX = width - gridW;
//     const extraY = height - gridH;

//     const startX = extraX / 2 + dotSize / 2;
//     const startY = extraY / 2 + dotSize / 2;

//     const dots = [];
//     for (let y = 0; y < rows; y++) {
//       for (let x = 0; x < cols; x++) {
//         const cx = startX + x * cell;
//         const cy = startY + y * cell;
//         dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
//       }
//     }
//     dotsRef.current = dots;
//   }, [dotSize, gap]);
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         isVisibleRef.current = entry.isIntersecting;
//       },
//       { threshold: 0.15 }
//     );

//     if (wrapperRef.current) observer.observe(wrapperRef.current);

//     return () => observer.disconnect();
//   }, []);
//   useEffect(() => {
//     let t;
//     const onScroll = () => {
//       isScrollingRef.current = true;
//       clearTimeout(t);
//       t = setTimeout(() => {
//         isScrollingRef.current = false;
//       }, 120);
//     };

//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   useEffect(() => {
//     if (!circlePath) return;

//     let rafId;
//     const proxSq = proximity * proximity;

//     const draw = () => {
//       if (!isVisibleRef.current) {
//         rafId = requestAnimationFrame(draw);
//         return;
//       }
//       const canvas = canvasRef.current;
//       if (!canvas) return;
//       const ctx = canvas.getContext("2d");
//       if (!ctx) return;
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const { x: px, y: py } = pointerRef.current;

//       for (const dot of dotsRef.current) {
//         const ox = dot.cx + dot.xOffset;
//         const oy = dot.cy + dot.yOffset;
//         const dx = dot.cx - px;
//         const dy = dot.cy - py;
//         const dsq = dx * dx + dy * dy;

//         let style = baseColor;
//         if (dsq <= proxSq) {
//           const dist = Math.sqrt(dsq);
//           const t = 1 - dist / proximity;
//           const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
//           const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
//           const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
//           style = `rgb(${r},${g},${b})`;
//         }

//         ctx.save();
//         ctx.translate(ox, oy);
//         ctx.fillStyle = style;
//         ctx.fill(circlePath);
//         ctx.restore();
//       }

//       rafId = requestAnimationFrame(draw);
//     };

//     draw();
//     return () => cancelAnimationFrame(rafId);
//   }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

//   useEffect(() => {
//     buildGrid();
//     let ro = null;
//     if ("ResizeObserver" in window) {
//       ro = new ResizeObserver(buildGrid);
//       wrapperRef.current && ro.observe(wrapperRef.current);
//     } else {
//       window.addEventListener("resize", buildGrid);
//     }
//     return () => {
//       if (ro) ro.disconnect();
//       else window.removeEventListener("resize", buildGrid);
//     };
//   }, [buildGrid]);

//   useEffect(() => {
//     const onMove = (e) => {
//       if (isScrollingRef.current) return;

//       if (!canvasRef.current) return;
//       const now = performance.now();
//       const pr = pointerRef.current;
//       const dt = pr.lastTime ? now - pr.lastTime : 16;
//       const dx = e.clientX - pr.lastX;
//       const dy = e.clientY - pr.lastY;
//       let vx = (dx / dt) * 1000;
//       let vy = (dy / dt) * 1000;
//       let speed = Math.hypot(vx, vy);
//       if (speed > maxSpeed) {
//         const scale = maxSpeed / speed;
//         vx *= scale;
//         vy *= scale;
//         speed = maxSpeed;
//       }
//       pr.lastTime = now;
//       pr.lastX = e.clientX;
//       pr.lastY = e.clientY;
//       pr.vx = vx;
//       pr.vy = vy;
//       pr.speed = speed;

//       const rect = canvasRef.current.getBoundingClientRect();
//       pr.x = e.clientX - rect.left;
//       pr.y = e.clientY - rect.top;

//       for (const dot of dotsRef.current) {
//         const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
//         if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
//           dot._inertiaApplied = true;
//           gsap.killTweensOf(dot);
//           const pushX = dot.cx - pr.x + vx * 0.005;
//           const pushY = dot.cy - pr.y + vy * 0.005;
//           gsap.to(dot, {
//             inertia: { xOffset: pushX, yOffset: pushY, resistance },
//             onComplete: () => {
//               gsap.to(dot, {
//                 xOffset: 0,
//                 yOffset: 0,
//                 duration: returnDuration,
//                 ease: "elastic.out(1,0.75)",
//               });
//               dot._inertiaApplied = false;
//             },
//           });
//         }
//       }
//     };

//     const onClick = (e) => {
//       if (!canvasRef.current) return;
//       const rect = canvasRef.current.getBoundingClientRect();
//       const cx = e.clientX - rect.left;
//       const cy = e.clientY - rect.top;
//       for (const dot of dotsRef.current) {
//         const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
//         if (dist < shockRadius && !dot._inertiaApplied) {
//           dot._inertiaApplied = true;
//           gsap.killTweensOf(dot);
//           const falloff = Math.max(0, 1 - dist / shockRadius);
//           const pushX = (dot.cx - cx) * shockStrength * falloff;
//           const pushY = (dot.cy - cy) * shockStrength * falloff;
//           gsap.to(dot, {
//             inertia: { xOffset: pushX, yOffset: pushY, resistance },
//             onComplete: () => {
//               gsap.to(dot, {
//                 xOffset: 0,
//                 yOffset: 0,
//                 duration: returnDuration,
//                 ease: "elastic.out(1,0.75)",
//               });
//               dot._inertiaApplied = false;
//             },
//           });
//         }
//       }
//     };

//     const throttledMove = throttle(onMove, 50);
//     window.addEventListener("mousemove", throttledMove, { passive: true });
//     window.addEventListener("click", onClick);

//     return () => {
//       window.removeEventListener("mousemove", throttledMove);
//       window.removeEventListener("click", onClick);
//     };
//   }, [
//     maxSpeed,
//     speedTrigger,
//     proximity,
//     resistance,
//     returnDuration,
//     shockRadius,
//     shockStrength,
//   ]);

//   return (
//     <section
//       className={`p-1 flex items-center justify-center h-full w-full relative ${className}`}
//       style={style}
//     >
//       <div ref={wrapperRef} className="w-full h-full relative">
//         <canvas
//           ref={canvasRef}
//           className="absolute inset-0 w-full h-full pointer-events-none"
//         />
//       </div>
//     </section>
//   );
// };

// export default DotGrid;



"use client";

import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";

// Register plugin once at module level
if (typeof window !== "undefined") {
  gsap.registerPlugin(InertiaPlugin);
}

// Optimized throttle with requestAnimationFrame
const rafThrottle = (callback) => {
  let requestId = null;
  let lastArgs = null;

  const later = () => {
    requestId = null;
    callback(...lastArgs);
  };

  return (...args) => {
    lastArgs = args;
    if (requestId === null) {
      requestId = requestAnimationFrame(later);
    }
  };
};

// Pre-compute hex to RGB - memoized outside component
const hexToRgbCache = new Map();
function hexToRgb(hex) {
  if (hexToRgbCache.has(hex)) return hexToRgbCache.get(hex);
  
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  
  const result = {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
  hexToRgbCache.set(hex, result);
  return result;
}

const DotGrid = memo(function DotGrid({
  dotSize = 16,
  gap = 32,
  baseColor = "#5227FF",
  activeColor = "#5227FF",
  proximity = 150,
  speedTrigger = 100,
  shockRadius = 250,
  shockStrength = 5,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = "",
  style,
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({
    x: -1000,
    y: -1000,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });
  const isVisibleRef = useRef(false);
  const isScrollingRef = useRef(false);
  const rafIdRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Memoize color calculations
  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);
  const proxSq = useMemo(() => proximity * proximity, [proximity]);

  // Build grid - optimized with typed arrays consideration
  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // Cap DPR at 2 for performance

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    const cell = dotSize + gap;
    const cols = Math.floor((width + gap) / cell);
    const rows = Math.floor((height + gap) / cell);

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const startX = (width - gridW) / 2 + dotSize / 2;
    const startY = (height - gridH) / 2 + dotSize / 2;

    // Pre-allocate array
    const totalDots = rows * cols;
    const dots = new Array(totalDots);
    
    let index = 0;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        dots[index++] = {
          cx: startX + x * cell,
          cy: startY + y * cell,
          xOffset: 0,
          yOffset: 0,
          _inertiaApplied: false,
        };
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  // Intersection observer for visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const wrapper = wrapperRef.current;
    if (wrapper) observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => {
      isScrollingRef.current = true;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Main draw loop - optimized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const radius = dotSize / 2;

    const draw = () => {
      rafIdRef.current = requestAnimationFrame(draw);

      // Skip if not visible
      if (!isVisibleRef.current) return;

      const dots = dotsRef.current;
      if (dots.length === 0) return;

      const { width, height } = canvas;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      ctx.clearRect(0, 0, width / dpr, height / dpr);

      const { x: px, y: py } = pointerRef.current;
      const dotsLen = dots.length;

      // Batch similar colored dots
      ctx.beginPath();
      
      for (let i = 0; i < dotsLen; i++) {
        const dot = dots[i];
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        // Determine color
        let fillStyle = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = (baseRgb.r + (activeRgb.r - baseRgb.r) * t) | 0;
          const g = (baseRgb.g + (activeRgb.g - baseRgb.g) * t) | 0;
          const b = (baseRgb.b + (activeRgb.b - baseRgb.b) * t) | 0;
          fillStyle = `rgb(${r},${g},${b})`;
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
    };

    rafIdRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [baseColor, activeRgb, baseRgb, proxSq, proximity, dotSize]);

  // Resize observer
  useEffect(() => {
    buildGrid();

    const ro = new ResizeObserver(() => {
      // Debounce resize
      requestAnimationFrame(buildGrid);
    });

    const wrapper = wrapperRef.current;
    if (wrapper) ro.observe(wrapper);

    return () => ro.disconnect();
  }, [buildGrid]);

  // Mouse/touch interactions - optimized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMove = rafThrottle((e) => {
      if (isScrollingRef.current || !isVisibleRef.current) return;

      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const dx = clientX - pr.lastX;
      const dy = clientY - pr.lastY;
      
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.sqrt(vx * vx + vy * vy);

      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }

      pr.lastTime = now;
      pr.lastX = clientX;
      pr.lastY = clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvas.getBoundingClientRect();
      pr.x = clientX - rect.left;
      pr.y = clientY - rect.top;

      // Only process nearby dots when speed is high enough
      if (speed > speedTrigger) {
        const dots = dotsRef.current;
        const proxSqLocal = proximity * proximity;

        for (let i = 0, len = dots.length; i < len; i++) {
          const dot = dots[i];
          if (dot._inertiaApplied) continue;

          const ddx = dot.cx - pr.x;
          const ddy = dot.cy - pr.y;
          const distSq = ddx * ddx + ddy * ddy;

          if (distSq < proxSqLocal) {
            dot._inertiaApplied = true;
            gsap.killTweensOf(dot);

            const pushX = ddx + vx * 0.005;
            const pushY = ddy + vy * 0.005;

            gsap.to(dot, {
              inertia: { xOffset: pushX, yOffset: pushY, resistance },
              onComplete: () => {
                gsap.to(dot, {
                  xOffset: 0,
                  yOffset: 0,
                  duration: returnDuration,
                  ease: "elastic.out(1,0.75)",
                });
                dot._inertiaApplied = false;
              },
            });
          }
        }
      }
    });

    const onClick = (e) => {
      if (!canvas || !isVisibleRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const shockRadiusSq = shockRadius * shockRadius;

      const dots = dotsRef.current;
      for (let i = 0, len = dots.length; i < len; i++) {
        const dot = dots[i];
        if (dot._inertiaApplied) continue;

        const dx = dot.cx - cx;
        const dy = dot.cy - cy;
        const distSq = dx * dx + dy * dy;

        if (distSq < shockRadiusSq) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);

          const dist = Math.sqrt(distSq);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = dx * shockStrength * falloff;
          const pushY = dy * shockStrength * falloff;

          gsap.to(dot, {
            inertia: { xOffset: pushX, yOffset: pushY, resistance },
            onComplete: () => {
              gsap.to(dot, {
                xOffset: 0,
                yOffset: 0,
                duration: returnDuration,
                ease: "elastic.out(1,0.75)",
              });
              dot._inertiaApplied = false;
            },
          });
        }
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("click", onClick);
    };
  }, [
    maxSpeed,
    speedTrigger,
    proximity,
    resistance,
    returnDuration,
    shockRadius,
    shockStrength,
  ]);

  return (
    <section
      className={`p-1 flex items-center justify-center h-full w-full relative ${className}`}
      style={style}
    >
      <div ref={wrapperRef} className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />
      </div>
    </section>
  );
});

export default DotGrid;
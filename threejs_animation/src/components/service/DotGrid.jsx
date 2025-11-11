"use client";
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import ScrollStack, {
  ScrollStackItem,
} from "../../components/service/ScrollStack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger, InertiaPlugin);

const Card = React.forwardRef(({ title, items, description }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 w-[90%] max-w-4xl h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#1a0f2e] border border-white/10 shadow-2xl text-white p-8 flex justify-between gap-8"
      style={{ willChange: "transform" }}
    >
      {/* Left content */}
      <div className="flex-1 flex flex-col">
        <span className="inline-block w-fit text-[10px] font-bold text-white uppercase tracking-[0.2em] bg-purple-600 px-3 py-1.5 rounded mb-4">
          {title}
        </span>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-md">
          {description}
        </p>
        <ul className="space-y-3 text-gray-300 text-sm flex-1">
          {items.map((it, i) => (
            <li
              key={i}
              className="hover:text-white transition-colors duration-200"
            >
              {it}
            </li>
          ))}
        </ul>
      </div>

      {/* Right placeholder (3D model area) */}
      <div className="flex-1 flex items-center justify-center border border-white/10 rounded-lg bg-[#0d0619] p-6 text-center">
        <div>
          <p className="font-semibold text-white text-sm mb-2">
            3D Model (Glass Morphism)
          </p>
          <p className="text-gray-500 text-xs break-words leading-relaxed">
            ref: https://in.pinterest.com/
            <br />
            pin/33284484741592100/
          </p>
        </div>
      </div>
    </div>
  );
});
Card.displayName = "Card";
const throttle = (func, limit) => {
  let lastCall = 0;
  return function (...args) {
    const now = performance.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

const DotGrid = ({
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
}) => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const pointerRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    speed: 0,
    lastTime: 0,
    lastX: 0,
    lastY: 0,
  });

  const baseRgb = useMemo(() => hexToRgb(baseColor), [baseColor]);
  const activeRgb = useMemo(() => hexToRgb(activeColor), [activeColor]);

  const circlePath = useMemo(() => {
    if (typeof window === "undefined" || !window.Path2D) return null;

    const p = new Path2D();
    p.arc(0, 0, dotSize / 2, 0, Math.PI * 2);
    return p;
  }, [dotSize]);

  const buildGrid = useCallback(() => {
    const wrap = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const { width, height } = wrap.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    const cols = Math.floor((width + gap) / (dotSize + gap));
    const rows = Math.floor((height + gap) / (dotSize + gap));
    const cell = dotSize + gap;

    const gridW = cell * cols - gap;
    const gridH = cell * rows - gap;

    const extraX = width - gridW;
    const extraY = height - gridH;

    const startX = extraX / 2 + dotSize / 2;
    const startY = extraY / 2 + dotSize / 2;

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cx = startX + x * cell;
        const cy = startY + y * cell;
        dots.push({ cx, cy, xOffset: 0, yOffset: 0, _inertiaApplied: false });
      }
    }
    dotsRef.current = dots;
  }, [dotSize, gap]);

  useEffect(() => {
    if (!circlePath) return;

    let rafId;
    const proxSq = proximity * proximity;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: px, y: py } = pointerRef.current;

      for (const dot of dotsRef.current) {
        const ox = dot.cx + dot.xOffset;
        const oy = dot.cy + dot.yOffset;
        const dx = dot.cx - px;
        const dy = dot.cy - py;
        const dsq = dx * dx + dy * dy;

        let style = baseColor;
        if (dsq <= proxSq) {
          const dist = Math.sqrt(dsq);
          const t = 1 - dist / proximity;
          const r = Math.round(baseRgb.r + (activeRgb.r - baseRgb.r) * t);
          const g = Math.round(baseRgb.g + (activeRgb.g - baseRgb.g) * t);
          const b = Math.round(baseRgb.b + (activeRgb.b - baseRgb.b) * t);
          style = `rgb(${r},${g},${b})`;
        }

        ctx.save();
        ctx.translate(ox, oy);
        ctx.fillStyle = style;
        ctx.fill(circlePath);
        ctx.restore();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafId);
  }, [proximity, baseColor, activeRgb, baseRgb, circlePath]);

  useEffect(() => {
    buildGrid();
    let ro = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(buildGrid);
      wrapperRef.current && ro.observe(wrapperRef.current);
    } else {
      window.addEventListener("resize", buildGrid);
    }
    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", buildGrid);
    };
  }, [buildGrid]);

  useEffect(() => {
    const onMove = (e) => {
      const now = performance.now();
      const pr = pointerRef.current;
      const dt = pr.lastTime ? now - pr.lastTime : 16;
      const dx = e.clientX - pr.lastX;
      const dy = e.clientY - pr.lastY;
      let vx = (dx / dt) * 1000;
      let vy = (dy / dt) * 1000;
      let speed = Math.hypot(vx, vy);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        vx *= scale;
        vy *= scale;
        speed = maxSpeed;
      }
      pr.lastTime = now;
      pr.lastX = e.clientX;
      pr.lastY = e.clientY;
      pr.vx = vx;
      pr.vy = vy;
      pr.speed = speed;

      const rect = canvasRef.current.getBoundingClientRect();
      pr.x = e.clientX - rect.left;
      pr.y = e.clientY - rect.top;

      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - pr.x, dot.cy - pr.y);
        if (speed > speedTrigger && dist < proximity && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const pushX = dot.cx - pr.x + vx * 0.005;
          const pushY = dot.cy - pr.y + vy * 0.005;
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

    const onClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const dot of dotsRef.current) {
        const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
        if (dist < shockRadius && !dot._inertiaApplied) {
          dot._inertiaApplied = true;
          gsap.killTweensOf(dot);
          const falloff = Math.max(0, 1 - dist / shockRadius);
          const pushX = (dot.cx - cx) * shockStrength * falloff;
          const pushY = (dot.cy - cy) * shockStrength * falloff;
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

    const throttledMove = throttle(onMove, 50);
    window.addEventListener("mousemove", throttledMove, { passive: true });
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("mousemove", throttledMove);
      window.removeEventListener("click", onClick);
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

  const cards = [
    {
      title: "DESIGN",
      description:
        "We build brands that speak before they're introduced. From identity to details, we craft every element to make your presence unforgettable.",
      items: [
        "UI / UX",
        "BRANDING",
        "3D MODELING",
        "MOTION GRAPHICS / EDITING",
        "PRINT MEDIA",
        "CREATIVE / MARKETING COLLATERALS",
      ],
    },
    {
      title: "BUILD",
      description:
        "Our developers are pixel artists, part architects. They code, craft, and fine-tune every pixel until your site shines.",
      items: [
        "BASIC WEBSITE",
        "E-COMMERCE WEBSITE",
        "CUSTOM CMS",
        "LANDING PAGES",
        "WEB / MOBILE APPLICATIONS",
        "AMC",
      ],
    },
    {
      title: "GROW",
      description:
        "We build brands that speak before they're introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.",
      items: [
        "SOCIAL MEDIA MARKETING",
        "PAID ADS / PERFORMANCE MARKETING",
        "SEO",
        "EMAIL & WHATSAPP MARKETING",
      ],
    },
  ];
  useEffect(() => {
    // Prepare refs array
    cardRefs.current = cardRefs.current.slice(0, cards.length);

    const ctx = gsap.context(() => {
      // Basic starting state: every card centered, slightly down, invisible, low scale
      gsap.set(cardRefs.current, {
        y: window.innerHeight,
        scale: 1,
        transformOrigin: "60% 60%",
        zIndex: (i) => i, // top card highest z
      });

      // Create timeline to control stacking
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          // Pin for enough distance: one viewport per card + a little extra
          end: () => `+=${window.innerHeight * cards.length}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      cards.forEach((_, i) => {
        const el = cardRefs.current[i];
        // label for in
        tl.to(
          el,
          {
            y: 0,
            ease: "power2.out",
            duration: 1,
          },
          i * 1.2 // overlapping timing for smoothness
        );

        // Push previous card up slightly when next appears
        if (i > 0) {
          for (let j = 0; j < i; j++) {
            const prevCard = cardRefs.current[j];
            tl.to(
              prevCard,
              {
                y: -80 * (i - j), // Stack with offset
                scale: 0.95 - (i - j) * 0.02, // Slight scale down
                ease: "power2.out",
                duration: 1,
              },
              i * 1.2 // Same timing as current card
            );
          }
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <section
      ref={rootRef}
      className={` relative  bg-[#060010] overflow-hidden ${className}`}
      style={{ height: `${100}vh`, ...style }}
    >
      <div
        ref={wrapperRef}
        className="sticky top-0 h-screen w-full flex flex-col "
      >
        {/* Header */}
        <div className="relative z-10 pt-12 px-12">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            What we do
          </h2>
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none "
        />

        {/* Cards container — stacking absolutely for perfect overlay */}
        <div className="relative flex-1 w-full flex items-center justify-center">
          {cards.map((c, i) => (
            <Card
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              title={c.title}
              description={c.description}
              items={c.items}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DotGrid;

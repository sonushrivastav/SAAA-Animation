"use client";
import React, { useRef, useEffect, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import ScrollStack, {
  ScrollStackItem,
} from "../../components/service/ScrollStack";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeGlass from "./FloatingGlass";
gsap.registerPlugin(ScrollTrigger, InertiaPlugin);

const Card = React.forwardRef(({ title, items, description }, ref) => {
  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-1/2 w-full max-w-7xl h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#555555]/30 backdrop-blur-[10px] border border-[#9C9C9C]   p-8 flex justify-between gap-8"
      style={{ willChange: "transform" }}
    >
      {/* Left content */}
      <div className="w-3/5 flex flex-col">
        <span className="inline-block w-fit text-xl font-semibold  text-[#FAFAFA] uppercase  bg-[#844DE9] p-3.5 rounded-md mb-4">
          {title}
        </span>
        <p className="text-sm text-[#9C9C9C] font-normal  ">{description}</p>
        <ul className="flex flex-col  pt-5 text-sm flex-1">
          {items.map((it, i) => (
            <li
              key={i}
              className="text-[#FBFBFB] border-t border-dashed border-[#555555] py-3.5 font-semibold uppercase underline tracking-normal text-md"
            >
              {it}
            </li>
          ))}
        </ul>
      </div>

      {/* Right placeholder (3D model area) */}
      <div className="w-2/5 flex items-center justify-center p-6 text-center">
        <div>
          <ThreeGlass
            motionVariant={0}
            speed={1.2}
            amplitude={0.06}
            mouseInfluence={true}
          />
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
  baseColor = "#0f0f0f",
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
  const titleRef = useRef(null);
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
        "We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.",
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
        "Our developers are part artists, part architects. They code, craft, and fine-tune every pixel until your site feels alive. Built to perform beautifully, no matter the screen or scale. ",
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
        "We build brands that speak before they’re introduced. From identity to visuals, we craft every detail to make your presence unforgettable. Because every great impression starts with a design that feels alive.",
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
      const stackOffset = 25;
      const totalStackHeight = stackOffset * (cards.length - 1);
      // Basic starting state: every card centered, slightly down, invisible, low scale
      gsap.set(cardRefs.current[0], {
        y: 25 + totalStackHeight,
        scale: 1,
        transformOrigin: "center center",
        zIndex: 1, // top card highest z
      });

      // Other cards start below viewport in reverse z-order
      cardRefs.current.slice(1).forEach((card, idx) => {
        gsap.set(card, {
          y: window.innerHeight,
          scale: 1,
          transformOrigin: "center center",
          zIndex: idx + 2,
        });
      });

      // Create timeline to control stacking
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          // Pin for enough distance: one viewport per card + a little extra
          end: () => `+=${window.innerHeight * (cards.length + 0.5)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // move title upward and stick before first card appears
      tl.to(titleRef.current, {
        y: -80, // adjust upward distance (you can tweak)
        opacity: 1,
        ease: "power2.out",
        duration: 0.8,
      });

      // Animate first card to center position
      tl.to(
        cardRefs.current[0],
        {
          y: 0 - stackOffset * (cards.length - 1),
          scale: 1 - (cards.length - 1) * 0.02,
          ease: "power2.out",
          duration: cards.length - 1,
        },
        0
      );

      cards.slice(1).forEach((_, i) => {
        const cardIndex = i + 1;
        const el = cardRefs.current[cardIndex];
        const startTime = cardIndex * 1;
        const cardsAbove = cards.length - 1 - cardIndex;

        tl.to(
          el,
          {
            y: -(stackOffset * cardsAbove),
            scale: 1 - cardsAbove * 0.02,
            ease: "power2.out",
            duration: cards.length - cardIndex,
          },
          startTime
        );
      });
      // Add extra scroll space at the end before unpinning
      tl.to({}, { duration: 0.5 });
    }, rootRef);

    return () => ctx.revert();
  }, [cards]);

  return (
    <section
      ref={rootRef}
      className={` relative   bg-[#060010] overflow-hidden ${className}`}
      style={{ height: `${100}vh`, ...style }}
    >
      <div
        ref={wrapperRef}
        className="sticky top-0  h-[105vh] w-full flex flex-col gap-12 py-24 px-48"
      >
        {/* Header */}
        <div ref={titleRef} className="relative z-10 ">
          <h2 className="text-4xl font-semibold text-white tracking-tight">
            What we do
          </h2>
        </div>

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full  h-full pointer-events-none "
        />

        {/* Cards container — stacking absolutely for perfect overlay */}
        <div className="relative flex-1 w-full   flex items-center justify-center">
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

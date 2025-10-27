import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
const STAR_SCROLL_CONTROL_LENGTH = 5000;
const AUTOPLAY_DELAY_MS = 1500;
const TUNNEL_LENGTH = 3000; // visible tunnel length in "distance units"
const FADE_OUT_DISTANCE = 800;
const HyperspaceParticle = ({
  startScrollOffset,
}: {
  startScrollOffset: number;
}) => {
  const pointsRef = useRef<THREE.Points | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef(new THREE.Vector2(-999, -999));
  const scrollOffsetRef = useRef(0);
  const autoPlayRef = useRef(true);
  const lastScrollTimeRef = useRef(0);

  const prevScrollYRef = useRef(0); // New ref to track previous scroll position
  const scrollDeltaRef = useRef(0);
  const tunnelProgressRef = useRef(0);
  const { size } = useThree();

  // create a fixed-size buffer of points positioned in a cone/tunnel shape
  const { positions, speeds, sizes } = useMemo(() => {
    const count = 5000; // Much higher particle count for density
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Create a cone-like distribution - denser near camera
      const zRandom = Math.random();
      const z = -Math.pow(zRandom, 2) * 400; // Squared distribution for density near camera

      // Radius gets smaller as we get closer to camera (cone shape)
      const radiusAtZ = Math.abs(z) * 0.3 + 50;
      const r = Math.random() * radiusAtZ;
      const theta = Math.random() * Math.PI * 2;

      const x = Math.cos(theta) * r;
      const y = Math.sin(theta) * r * 0.6; // Slightly flatten vertically

      const idx = i * 3;
      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      speeds[i] = 0.5 + Math.random() * 0.5;

      // Size based on distance - larger when closer
      const distanceFactor = 1 - Math.abs(z) / 400;
      sizes[i] = (0.8 + Math.random() * 1.5) * (0.3 + distanceFactor * 1.5);
    }

    return { positions, speeds, sizes };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Calculate scroll position relative to the start of the Star tunnel section
      const delta = currentScrollY - prevScrollYRef.current;

      // Apply a damping factor to the delta for smoother speed changes (e.g., 0.1)
      // The more the user scrolls, the higher this value will be.
      scrollDeltaRef.current = delta * 0.55; // Adjusted sensitivity (0.15 is a good starting point)

      // Update the previous scroll position
      prevScrollYRef.current = currentScrollY;

      // 👇 AUTOPLAY CONTROL LOGIC
      // Stop auto-play when user is actively scrolling
      if (Math.abs(delta) > 0.1) {
        autoPlayRef.current = false;
        lastScrollTimeRef.current = Date.now();
      }

      // Clamp the relative scroll to the Star's control length
      const currentRelativeScroll = currentScrollY - startScrollOffset;
      const clampedScroll = Math.min(
        Math.max(0, currentRelativeScroll),
        STAR_SCROLL_CONTROL_LENGTH
      );
      scrollOffsetRef.current = clampedScroll;
    };
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -(event.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [size, startScrollOffset]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;
    const pos = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;

    const safeDelta = Math.min(delta, 5);

    // 1. Check for Auto-play resume
    if (
      !autoPlayRef.current &&
      Date.now() - lastScrollTimeRef.current > AUTOPLAY_DELAY_MS
    ) {
      autoPlayRef.current = true;
    }

    // 2. Calculate Speed based on instantaneous scroll delta

    // Base speed for auto-forward movement
    const baseSpeed = 1.5;

    let scrollSpeed = scrollDeltaRef.current;
    scrollSpeed = Math.min(Math.max(scrollSpeed, -10), 10);

    // If auto-play is active, smoothly override/guide the speed back to baseSpeed.
    let effectiveSpeed = baseSpeed + scrollSpeed;

    if (autoPlayRef.current) {
      // Smoothly interpolate the speed towards a constant forward motion (e.g., speed of 2.0)
      const targetAutoSpeed = 2.0;
      effectiveSpeed = THREE.MathUtils.lerp(
        effectiveSpeed,
        targetAutoSpeed,
        0.05
      ); // Lerp factor 0.05 for smoothness
    }

    // Apply a slow decay to the scrollDeltaRef to create the "inertia"
    // and smooth reverse scroll effect.
    scrollDeltaRef.current *= 0.9;

    // Continuous movement multiplier (time step)
    const frameMovement = safeDelta * 100 * 0.5;

    // Update tunnel travel (allow backward too)
    tunnelProgressRef.current = Math.max(
      0,
      Math.min(
        TUNNEL_LENGTH / 1000,
        tunnelProgressRef.current + effectiveSpeed * frameMovement * 0.002
      )
    );

    const movingForward = effectiveSpeed > 0;

    for (let i = 0; i < pos.count; i++) {
      const idx = i * 3;
      const zIdx = idx + 2;
      let z = pos.array[zIdx] as number;

      // ALWAYS apply continuous forward movement
      z += speeds[i] * frameMovement * effectiveSpeed * 1.2;
      // ALSO apply scroll offset on top of continuous movement

      // Wrap particles when they go too far in either direction
      const minZ = -400;
      const maxZ = 10;

      if (z > maxZ) {
        // recycle only if tunnel not ended
        if (tunnelProgressRef.current < TUNNEL_LENGTH / 2000) {
          z = minZ + Math.random() * 10;
          pos.array[idx] = (Math.random() - 0.5) * (Math.random() * 80 + 8);
          pos.array[idx + 1] = (Math.random() - 0.5) * (Math.random() * 40 + 4);
        } else {
          // stop recycling — let them vanish
          z = maxZ - 1;
          pos.array[idx] = (Math.random() - 0.5) * (Math.random() * 80 + 8);
          pos.array[idx + 1] = (Math.random() - 0.5) * (Math.random() * 40 + 4);
        }
      }
      pos.array[zIdx] = z;
    }

    pos.needsUpdate = true;

    // Decay scroll offset over time for smooth feel
    scrollOffsetRef.current *= 0.85;

    // Update shader uniforms
    // compute fade factor based on tunnel progress
    const fadeStart = (TUNNEL_LENGTH - FADE_OUT_DISTANCE) / TUNNEL_LENGTH;
    const progress = Math.min(
      tunnelProgressRef.current / (TUNNEL_LENGTH / 1000),
      1
    );
    const fade =
      progress > fadeStart ? 1 - (progress - fadeStart) / (1 - fadeStart) : 1;

    materialRef.current.uniforms.uFade.value = fade;
    materialRef.current.uniforms.uMouse.value.copy(mouseRef.current);
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const vertexShader = `
     uniform vec2 uMouse;
      uniform float uTime;
       uniform float uFade;
      attribute float size;
      varying float vDistance;
      varying vec3 vPosition;
      
      void main() {
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // Calculate distance from mouse in screen space
        vec4 screenPos = projectionMatrix * mvPosition;
        vec2 screenXY = screenPos.xy / screenPos.w;
        vDistance = distance(screenXY, uMouse);
        
        gl_PointSize = size * (300.0 / -mvPosition.z);
      }
    `;

  const fragmentShader = `
       uniform float uTime;
        uniform float uFade;
      varying float vDistance;
      varying vec3 vPosition;
      
      void main() {
        // Create circular particle
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        if (dist > 0.5) discard;
        
        // Smooth edge with glow
        float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
        
        // Base blur effect
        float baseOpacity = 0.4;
        
        // Mouse hover effect - create blinking/shining effect
        float hoverRadius = 0.25;
        float hoverEffect = smoothstep(hoverRadius, 0.0, vDistance);
        
        // Blink effect when hovering
        float blinkSpeed = 8.0;
        float blink = sin(uTime * blinkSpeed) * 0.5 + 0.5;
        float hoverBlink = hoverEffect * blink * 0.7;
        
        // Shine/glow effect
        float shine = pow(1.0 - dist * 2.0, 3.0) * hoverEffect * 0.8;
        
        float finalOpacity = mix(baseOpacity, 1.0, hoverEffect * 0.6 + hoverBlink + shine);
        
        // Add subtle pulsing to all stars
        float pulse = sin(uTime * 2.0 + vPosition.z * 0.1) * 0.1 + 0.9;
        
        // Brighter center glow on hover
        float centerGlow = (1.0 - dist * 2.0) * hoverEffect * 1.5;
        
        gl_FragColor = vec4(1.0, 1.0, 1.0, (alpha * finalOpacity * pulse + centerGlow) * uFade);
      }
    `;
  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          itemSize={3}
          count={positions.length / 3}
        />
        <bufferAttribute
          attach="attributes-size"
          array={sizes}
          itemSize={1}
          count={sizes.length}
        />
      </bufferGeometry>

      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={true}
        depthTest={true}
        uniforms={{
          uMouse: { value: new THREE.Vector2(-999, -999) },
          uTime: { value: 0 },
          uFade: { value: 1 },
        }}
      />
    </points>
  );
};

export default HyperspaceParticle;

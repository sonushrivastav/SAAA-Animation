import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ---------- FULL SHADER MATERIAL ----------
const GradientShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uAmplitude: 1.0,
        uColorStops: [
            new THREE.Color(0.35, 0.0, 1.0),
            new THREE.Color(0.35, 0.0, 1.0),
            new THREE.Color(0.0, 0.0, 0.0),
        ],
        uResolution: [1, 1],
        uBlend: 0.98,
        uMouse: [0.5, 0.5],
        uMouseVelocity: [0, 0],
        uMouseInfluence: 1.0,
    },
    // ---------------- VERTEX ----------------
    `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,
    // ---------------- FRAGMENT ----------------
    `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAmplitude;
  uniform vec3 uColorStops[3];
  uniform vec2 uResolution;
  uniform float uBlend;
  uniform vec2 uMouse;
  uniform vec2 uMouseVelocity;
  uniform float uMouseInfluence;

  // ----- Original Shader Noise & Helpers -----
  vec3 permute(vec3 x){
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  float snoise(vec2 v){
    const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y)? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod(i, 289.0);
    vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
      + i.x + vec3(0.0, i1.x, 1.0)
    );

    vec3 m = max(
      0.5 - vec3(
        dot(x0, x0),
        dot(x12.xy, x12.xy),
        dot(x12.zw, x12.zw)
      ),
      0.0
    );
    m = m * m;
    m = m * m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);

    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz*x12.xz + h.yz*x12.yw;
    return 130.0 * dot(m, g);
  }

  struct ColorStop { vec3 color; float position; };

  #define COLOR_RAMP(colors, factor, finalColor) { \
    int index = 0; \
    for (int i = 0; i < 2; i++) { \
      ColorStop currentColor = colors[i]; \
      bool isInBetween = currentColor.position <= factor; \
      index = int(mix(float(index), float(i), float(isInBetween))); \
    } \
    ColorStop currentColor = colors[index]; \
    ColorStop nextColor = colors[index + 1]; \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
  }

  // -------------- MAIN ----------------
  void main(){
    vec2 uv = vUv;

    vec2 toMouse = uv - uMouse;
    float mouseDistRaw = length(toMouse * vec2(uResolution.x/uResolution.y, 1.0));

    float blobRadius = 0.4;
    float blobFalloff = smoothstep(blobRadius, 0.0, mouseDistRaw);

    vec2 mouseDirection = mouseDistRaw > 0.001 ? normalize(toMouse) : vec2(0.0);

    float wavePattern1 = sin(mouseDistRaw * 12.0 - uTime * 3.0 + dot(uMouseVelocity, vec2(1.0))) * 0.5 + 0.5;
    float wavePattern2 = cos(mouseDistRaw * 8.0 + uTime * 2.5) * 0.5 + 0.5;

    vec2 velocityInfluence = uMouseVelocity * blobFalloff * 0.08;

    float hollowStrength = blobFalloff * (0.3 + wavePattern1 * 0.15);
    vec2 mouseDisplacement = mouseDirection * hollowStrength * uMouseInfluence;

    vec2 perpDirection = vec2(-mouseDirection.y, mouseDirection.x);
    float swirlPattern = sin(mouseDistRaw * 10.0 + uTime * 2.0) * blobFalloff;
    mouseDisplacement += perpDirection * swirlPattern * 0.12 * uMouseInfluence;

    mouseDisplacement += velocityInfluence * wavePattern2;

    float noise1 = snoise(vec2(uv.x * 1.5 + uTime * 0.15, uv.y * 1.5 + uTime * 0.1));
    float noise2 = snoise(vec2(uv.x * 2.5 - uTime * 0.12, uv.y * 2.5 + uTime * 0.18)) * 0.5;
    float noise3 = snoise(vec2(uv.x * 3.0 + uTime * 0.08, uv.y * 3.0 - uTime * 0.14)) * 0.3;
    float combinedNoise = (noise1 + noise2 + noise3) * uAmplitude;

    vec2 distortedUV = uv + vec2(
      snoise(vec2(uv.y * 2.0 + uTime * 0.2, uTime * 0.3)) * 0.08 * uAmplitude,
      snoise(vec2(uv.x * 2.0 + uTime * 0.25, uTime * 0.2 + 100.0)) * 0.08 * uAmplitude
    ) + mouseDisplacement;

    vec2 center = vec2(0.5, 0.3);
    float centerNoiseX = snoise(vec2(uTime*0.12, 0.0)) * 0.15;
    float centerNoiseY = snoise(vec2(0.0, uTime*0.15 + 50.0)) * 0.12;
    vec2 animatedCenter = center + vec2(centerNoiseX, centerNoiseY) * uAmplitude;

    vec2 radii = vec2(1.7,1.0);
    vec2 diff = (distortedUV - animatedCenter) / radii;
    float dist = length(diff);

    float waveInfluence = combinedNoise * 0.15;
    float gradientFactor = smoothstep(0.0, 0.55, dist + waveInfluence);

    ColorStop colors[3];
    colors[0] = ColorStop(uColorStops[0], 0.0);
    colors[1] = ColorStop(uColorStops[1], 0.5);
    colors[2] = ColorStop(uColorStops[2], 1.0);

    vec3 rampColor;
    COLOR_RAMP(colors, gradientFactor, rampColor);

    float maskDist = length((distortedUV - animatedCenter) / radii);
    float ellipseMask = 1.0 - smoothstep(0.4, 0.65, maskDist);
    float glow = exp(-maskDist * 2.0) * 0.4;
    vec3 finalColor = rampColor * (ellipseMask + glow);
    float alpha = ellipseMask * (1.0 - gradientFactor * 0.7);

    gl_FragColor = vec4(finalColor, alpha);
  }
  `
);

extend({ GradientShaderMaterial });

// ---------- PLANE COMPONENT ----------
export function GradientPlane() {
    const ref = useRef();
    const { size, viewport } = useThree();

    useEffect(() => {
        ref.current.uResolution = [size.width, size.height];
    }, [size]);

    useFrame(({ clock }) => {
        ref.current.uTime = clock.getElapsedTime();
    });

    return (
        <mesh
            position={[0, 0, -5]}
            scale={[viewport.width, viewport.height, 1]}
            renderOrder={-1} // 💡 render before everything
        >
            <planeGeometry args={[1, 1]} />
            <gradientShaderMaterial
                ref={ref}
                depthTest={false} // 🚫 glass won’t sample it
                depthWrite={false} // 🚫 don't affect Z-buffer
                transparent={true}
            />
        </mesh>
    );
}

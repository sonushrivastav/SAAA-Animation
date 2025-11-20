import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  
  // Radial gradient parameters
  vec2 center = vec2(0.5, 0.2);
  vec2 radii = vec2(1.9, 1.1);
  
  // Multi-layered noise for organic wave motion
  float noise1 = snoise(vec2(uv.x * 1.5 + uTime * 0.15, uv.y * 1.5 + uTime * 0.1));
  float noise2 = snoise(vec2(uv.x * 2.5 - uTime * 0.12, uv.y * 2.5 + uTime * 0.18)) * 0.5;
  float noise3 = snoise(vec2(uv.x * 3.0 + uTime * 0.08, uv.y * 3.0 - uTime * 0.14)) * 0.3;
  
  // Combine noise layers for complex wave motion
  float combinedNoise = (noise1 + noise2 + noise3) * uAmplitude;
  
  // Apply wave distortion to UV coordinates
  vec2 distortedUV = uv + vec2(
    snoise(vec2(uv.y * 2.0 + uTime * 0.2, uTime * 0.3)) * 0.08 * uAmplitude,
    snoise(vec2(uv.x * 2.0 + uTime * 0.25, uTime * 0.2 + 100.0)) * 0.08 * uAmplitude
  );
  
  // Animate center position with smooth circular motion
  float centerNoiseX = snoise(vec2(uTime * 0.12, 0.0)) * 0.15;
  float centerNoiseY = snoise(vec2(0.0, uTime * 0.15 + 50.0)) * 0.12;
  vec2 animatedCenter = center + vec2(centerNoiseX, centerNoiseY) * uAmplitude;
  
  // Calculate distance from animated center using distorted UV
  vec2 diff = (distortedUV - animatedCenter) / radii;
  float dist = length(diff);
  
  // Smooth gradient factor with wave influence
  float waveInfluence = combinedNoise * 0.15;
  float gradientFactor = smoothstep(0.0, 0.6, dist + waveInfluence);
  
  // Color interpolation
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  
  vec3 rampColor;
  COLOR_RAMP(colors, gradientFactor, rampColor);
  
  // Smooth elliptical mask that follows the distortion
  float maskDist = length((distortedUV - animatedCenter) / radii);
  float ellipseMask = 1.0 - smoothstep(0.4, 0.65, maskDist);
  
  // Enhanced glow effect
  float glow = exp(-maskDist * 2.0) * 0.4;
  
  // Combine everything
  vec3 finalColor = rampColor * (ellipseMask + glow);
  float alpha = ellipseMask * (1.0 - gradientFactor * 0.7);
  
  fragColor = vec4(finalColor, alpha);
}
`;

export default function GradientBackground(props) {
  const {
    colorStops = ["#5A00FF", "#5A00FF"],
    amplitude = 1.0,
    blend = 0.98,
  } = props;
  const propsRef = useRef(props);
  propsRef.current = props;

  const ctnDom = useRef(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";

    let program;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener("resize", resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      program.uniforms.uTime.value = time * speed * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
      program.uniforms.uBlend.value = propsRef.current.blend ?? blend;
      const stops = propsRef.current.colorStops ?? colorStops;
      program.uniforms.uColorStops.value = stops.map((hex) => {
        const c = new Color(hex);
        return [c.r, c.g, c.b];
      });
      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [amplitude, blend, colorStops]);

  return (
    <div className="w-full h-full ">
      <div ref={ctnDom} className="w-full h-full" />
    </div>
  );
}

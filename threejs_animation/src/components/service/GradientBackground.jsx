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

// Mouse uniforms: normalized (0..1), y flipped in JS before sending
uniform vec2 uMouse;
uniform float uMousePower;

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
  // normalized pixel coords
  vec2 uv = gl_FragCoord.xy / uResolution;

  // ----------------------------
  // MOUSE-LOCAL FLUID DISTORTION
  // ----------------------------
  // mouse supplied in normalized coords (0..1); JS flips y
  vec2 mouseUV = uMouse;
  float d = distance(uv, mouseUV);

  // radius of influence (tweakable)
  float radius = 0.22;

  // mask = 1 near cursor, 0 outside; smooth edge
  float mouseMask = smoothstep(radius, 0.0, d);

  // direction from mouse to pixel (for push)
  vec2 dir = uv - mouseUV;
  // small safety so normalize is stable
  dir = normalize(dir + 1e-6);

  // swirl component (perpendicular)
  vec2 perp = vec2(-dir.y, dir.x);

  // time-varying swirl/perturb using snoise for more natural fluid
  float swirl = snoise((uv + mouseUV) * 6.0 + uTime * 0.7);

  // local displacement magnitude (scaled by uMousePower and mask)
  float localStrength = mouseMask * uMousePower; // 0..1
  // create a smooth displacement vector — push + swirl
  vec2 mouseDisp = dir * localStrength * 0.045 + perp * swirl * localStrength * 0.03;

  // locally boost amplitude so the waves become more pronounced in the influence area
  float localAmplitude = uAmplitude * (1.0 + localStrength * 2.0);

  // apply mouse displacement early so subsequent noise/waves use displaced coords
  vec2 uvLocal = uv + mouseDisp;
  // ----------------------------

  // Original shader logic (using uvLocal and localAmplitude where appropriate)
  vec2 center = vec2(0.5, 0.2);
  vec2 radii = vec2(1.7, 1.1);

  // Multi-layered noise for organic wave motion (use uvLocal)
  float noise1 = snoise(vec2(uvLocal.x * 1.5 + uTime * 0.15, uvLocal.y * 1.5 + uTime * 0.1));
  float noise2 = snoise(vec2(uvLocal.x * 2.5 - uTime * 0.12, uvLocal.y * 2.5 + uTime * 0.18)) * 0.5;
  float noise3 = snoise(vec2(uvLocal.x * 3.0 + uTime * 0.08, uvLocal.y * 3.0 - uTime * 0.14)) * 0.3;

  // combine noise and use localAmplitude so mouse area shows stronger wave perturbation
  float combinedNoise = (noise1 + noise2 + noise3) * localAmplitude;

  // Apply global wave distortion (keeps the base animation)
  vec2 distortedUV = uvLocal + vec2(
    snoise(vec2(uvLocal.y * 2.0 + uTime * 0.2, uTime * 0.3)) * 0.08 * localAmplitude,
    snoise(vec2(uvLocal.x * 2.0 + uTime * 0.25, uTime * 0.2 + 100.0)) * 0.08 * localAmplitude
  );

  // Animate center position (unchanged)
  float centerNoiseX = snoise(vec2(uTime * 0.12, 0.0)) * 0.15;
  float centerNoiseY = snoise(vec2(0.0, uTime * 0.15 + 50.0)) * 0.12;
  vec2 animatedCenter = center + vec2(centerNoiseX, centerNoiseY) * uAmplitude;

  vec2 diff = (distortedUV - animatedCenter) / radii;
  float dist = length(diff);

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

  // Combine everything: NO added black highlight — just the original color but with local perturbation
  vec3 finalColor = rampColor * (ellipseMask + glow);

  float alpha = ellipseMask * (1.0 - gradientFactor * 0.7);

  fragColor = vec4(finalColor, alpha);
}
`;

export default function GradientBackground(props) {
  const {
    colorStops = ["#5A00FF", "#5A00FF", "#000000"],
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

        // mouse uniforms start neutral
        uMouse: { value: [0.5, 0.5] },
        uMousePower: { value: 0.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    // Mouse handling state (normalized coords)
    let mouse = [0.5, 0.5]; // smoothed
    let targetMouse = [0.5, 0.5]; // immediate
    let mousePower = 0.0; // smoothed power
    let lastTargetMouse = [0.5, 0.5];
    let lastMoveAt = performance.now();

    function onMouseMove(e) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height; // flip Y for shader
      targetMouse[0] = Math.max(0, Math.min(1, x));
      targetMouse[1] = Math.max(0, Math.min(1, y));

      // approximate speed from last target pos
      const dx = targetMouse[0] - lastTargetMouse[0];
      const dy = targetMouse[1] - lastTargetMouse[1];
      const moveSpeed = Math.sqrt(dx * dx + dy * dy);

      // bump immediate power proportional to move speed (tuned)
      mousePower = Math.min(1.0, mousePower + moveSpeed * 30.0);

      lastTargetMouse[0] = targetMouse[0];
      lastTargetMouse[1] = targetMouse[1];
      lastMoveAt = performance.now();
    }

    function onMouseLeave() {
      // accelerate decay when leaving
      lastMoveAt = performance.now() - 1000;
    }

    ctn.addEventListener("mousemove", onMouseMove);
    ctn.addEventListener("mouseleave", onMouseLeave);

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

      // smooth mouse position (inertia)
      mouse[0] += (targetMouse[0] - mouse[0]) * 0.14;
      mouse[1] += (targetMouse[1] - mouse[1]) * 0.14;

      // mouse power smoothing + decay when idle
      const now = performance.now();
      const idleMs = now - lastMoveAt;
      // decay factor increases with idle time
      const decay = 1.0 - Math.min(0.98, idleMs / 1500.0);
      mousePower *= decay;
      // small relaxation toward 0 to avoid stuck tiny values
      mousePower += (0.0 - mousePower) * 0.02;
      mousePower = Math.max(0.0, Math.min(1.0, mousePower));

      // set uniforms
      program.uniforms.uMouse.value = [mouse[0], mouse[1]];
      program.uniforms.uMousePower.value = mousePower;

      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      ctn.removeEventListener("mousemove", onMouseMove);
      ctn.removeEventListener("mouseleave", onMouseLeave);
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

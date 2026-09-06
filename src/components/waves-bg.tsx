"use client";
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Gradient Waves — a raymarched wave field fading into haze.
 *
 * Ported from React Bits (MIT + Commons Clause) to TypeScript. Three changes to
 * the original:
 *
 *   - the loop holds still for anyone who has asked for reduced motion
 *   - pointer parallax is off, because this sits behind a form and a background
 *     that chases the cursor pulls the eye away from the field being filled
 *   - two palettes, chosen from the live theme
 *
 * The library's own colours are kept for dark. They cannot carry to light: the
 * nearest crests are pure white, and the near waves are the opaque ones, so on
 * a near-white page the whole field disappears into the background. Light gets
 * the inverse — deep violet crests rising out of a pale haze — which is the
 * same picture with the values flipped to suit the ground it sits on.
 *
 * Imported directly rather than through `next/dynamic`: it only touches WebGL
 * inside an effect, and through `dynamic` the chunk was not requested until a
 * later state change, which left the background missing until you touched the
 * page. `ogl` is ~34 KB and is shared with molten-metal.
 */

export type WavePalette = {
  horizonColor: string;
  waveColor: string;
  crestColor: string;
  opacity: number;
  /** How far the field stays solid before dissolving into haze. */
  fogDepth: number;
};

const DARK: WavePalette = {
  horizonColor: "#5227FF",
  waveColor: "#FF9FFC",
  crestColor: "#FFFFFF",
  opacity: 0.75,
  fogDepth: 15,
};

// Darker than the ground rather than lighter, and dialled back: ink on white
// reads louder than glow on black at the same alpha.
const LIGHT: WavePalette = {
  horizonColor: "#8E7BE8",
  waveColor: "#7C4DFF",
  crestColor: "#3B1C9C",
  opacity: 0.5,
  // Reaches further than dark. Alpha that reads as a glow on black reads as
  // nothing on white, so the light field has to stay solid for longer to carry
  // the same presence.
  fogDepth: 21,
};

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  return [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255];
};

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uAmplitude;
uniform float uWaveScale;
uniform float uWaveRatio;
uniform float uSwell;
uniform float uTurbulence;
uniform float uTilt;
uniform float uZoom;
uniform float uHeight;
uniform float uFogDepth;
uniform float uSteps;
uniform float uBrightness;
uniform float uOpacity;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec3 uHorizonColor;
uniform vec3 uWaveColor;
uniform vec3 uCrestColor;
out vec4 fragColor;

const float MAX_DIST = 20000.0;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float plasma(vec3 r, vec2 freq, vec4 tc) {
  float mx = r.x + tc.x;
  mx += uSwell * sin((r.y + mx) / 20.0 + tc.y);
  float my = r.y - tc.z;
  my += uTurbulence * cos(r.x / 23.0 + tc.w);
  return r.z - (sin(mx * freq.x) * uAmplitude + sin(my * freq.y) * uAmplitude + uHeight);
}

float raymarch(vec3 pos, vec3 dir, vec2 freq, vec4 tc) {
  float dist = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uSteps) break;
    float dscene = plasma(pos + dist * dir, freq, tc);
    if (abs(dscene) < 0.1) break;
    dist += 0.9 * dscene;
    if (!(abs(dist) < MAX_DIST)) return MAX_DIST;
  }
  return dist;
}

void main() {
  float T = iTime * uSpeed;
  vec2 freq = vec2(uWaveScale / 7.0, (uWaveScale * uWaveRatio) / 3.0);
  vec4 tc = vec4(T / 0.130, T / 0.810, T / 0.200, T / 0.710);
  float c, s;
  float vfov = (3.14159 / 2.3) / max(uZoom, 0.05);
  vec3 cam = vec3(0.0, 0.0, 30.0);
  vec2 uv = (gl_FragCoord.xy / iResolution.xy) - 0.5;
  uv.x *= iResolution.x / iResolution.y;
  uv.y *= -1.0;

  vec3 dir = vec3(0.0, 0.0, -1.0);
  float ulen = length(uv);
  float xrot = vfov * ulen;
  c = cos(xrot); s = sin(xrot);
  dir = mat3(1.0, 0.0, 0.0, 0.0, c, -s, 0.0, s, c) * dir;
  vec2 nuv = ulen > 1e-5 ? uv / ulen : vec2(1.0, 0.0);
  c = nuv.x; s = nuv.y;
  dir = mat3(c, -s, 0.0, s, c, 0.0, 0.0, 0.0, 1.0) * dir;
  c = cos(uTilt); s = sin(uTilt);
  dir = mat3(c, 0.0, s, 0.0, 1.0, 0.0, -s, 0.0, c) * dir;

  float dist = raymarch(cam, dir, freq, tc);
  vec3 pos = cam + dist * dir;

  float t = clamp(uFogDepth / max(dist, 0.001), 0.0, 1.0);
  vec3 body = mix(uWaveColor, uCrestColor, clamp(pos.z * 0.08 + 0.5, 0.0, 1.0));
  vec3 col = mix(uHorizonColor, body, t);
  col *= uBrightness;
  col = clamp(col, 0.0, 1.0);

  float alpha = clamp(t, 0.0, 1.0) * uOpacity;
  if (uGrain > 0.5) {
    float g = hash21(gl_FragCoord.xy + mod(iTime, 64.0) * 11.0);
    alpha += (g - 0.5) * uGrainIntensity;
  }
  alpha = clamp(alpha, 0.0, 1.0);
  fragColor = vec4(col * alpha, alpha);
}
`;

export default function WavesBg({
  dark = DARK,
  light = LIGHT,
}: {
  dark?: WavePalette;
  light?: WavePalette;
}) {
  const host = useRef<HTMLDivElement>(null);
  // Read through refs so a theme change repaints the uniforms instead of
  // tearing down the GL context and rebuilding the whole field.
  const palettes = useRef({ dark, light });

  useEffect(() => {
    const container = host.current;
    if (!container) return;
    palettes.current = { dark, light };

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: 0.4 },
        uAmplitude: { value: 2.5 },
        uWaveScale: { value: 0.6 },
        uWaveRatio: { value: 0.9 },
        uSwell: { value: 35 },
        uTurbulence: { value: 20 },
        uTilt: { value: 1.11 },
        uZoom: { value: 1.0 },
        uHeight: { value: 5.5 },
        uFogDepth: { value: 15 },
        uSteps: { value: 70 },
        uBrightness: { value: 1.0 },
        uOpacity: { value: 1 },
        uGrain: { value: 1.0 },
        uGrainIntensity: { value: 0.05 },
        uHorizonColor: { value: new Float32Array([1, 1, 1]) },
        uWaveColor: { value: new Float32Array([1, 1, 1]) },
        uCrestColor: { value: new Float32Array([1, 1, 1]) },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    // The toggle stamps data-theme on <html>; with no stamp the system setting
    // decides. Both have to be able to swap the palette.
    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const applyPalette = () => {
      const stamped = document.documentElement.getAttribute("data-theme");
      const isDark = stamped ? stamped === "dark" : scheme.matches;
      const p = isDark ? palettes.current.dark : palettes.current.light;
      program.uniforms.uHorizonColor.value.set(hexToRgb(p.horizonColor));
      program.uniforms.uWaveColor.value.set(hexToRgb(p.waveColor));
      program.uniforms.uCrestColor.value.set(hexToRgb(p.crestColor));
      program.uniforms.uOpacity.value = p.opacity;
      program.uniforms.uFogDepth.value = p.fogDepth;
    };
    applyPalette();

    const themeWatcher = new MutationObserver(applyPalette);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    scheme.addEventListener("change", applyPalette);

    const setSize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(width)), Math.max(1, Math.floor(height)));
      const res = program.uniforms.iResolution.value;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    // Held on its first frame rather than removed: the picture is the same, it
    // simply does not move.
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    // A frozen field still has to repaint when the theme flips under it.
    const repaintIfStill = () => {
      if (stillness.matches) renderer.render({ scene: mesh });
    };
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    scheme.addEventListener("change", repaintIfStill);
    const t0 = performance.now();
    let raf = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;

    const loop = (t: number) => {
      if (!stillness.matches) program.uniforms.iTime.value = (t - t0) * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (onScreen && pageVisible && raf === 0) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // A raymarcher is not free. It stops when scrolled away or the tab is hidden.
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(container);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      themeWatcher.disconnect();
      scheme.removeEventListener("change", applyPalette);
      scheme.removeEventListener("change", repaintIfStill);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Palettes are read through the ref, so changing them never rebuilds this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={host} aria-hidden className="pointer-events-none h-full w-full overflow-hidden" />
  );
}

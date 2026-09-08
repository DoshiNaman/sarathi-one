"use client";
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Molten Metal — a caustic filament field.
 *
 * Ported from React Bits (MIT + Commons Clause) to TypeScript. Four changes
 * to the original:
 *
 *   - the loop holds still for anyone who has asked for reduced motion
 *   - two palettes, chosen from the live theme, matching the silver-on-ink and
 *     smoke-on-paper looks rather than the library's purple defaults
 *   - pointer drift listens on the window, because the canvas sits behind the
 *     report and cannot receive hover itself
 *   - `mouseInteraction` flips the pointer drift off; the report renders it
 *     disabled, since the field is background and the parallax was fighting
 *     the scroll
 *
 * The palettes are also dialed back from the library defaults — lower
 * brightness and opacity, higher black point — so the filaments read as a
 * subtle texture rather than a light show behind the report.
 *
 * Imported directly rather than through `next/dynamic`: it only touches WebGL
 * inside an effect, and through `dynamic` the chunk was not requested until a
 * later state change, which left the background missing until you touched the
 * page. `ogl` is ~34 KB and is shared with waves-bg.
 */

type Palette = {
  color1: string;
  color2: string;
  color3: string;
  backgroundColor: string;
  lightMode: boolean;
  blackPoint: number;
  brightness: number;
  opacity: number;
};

const DARK: Palette = {
  color1: "#5227FF",
  color2: "#FF9FFC",
  color3: "#FFFFFF",
  backgroundColor: "#050505",
  lightMode: false,
  blackPoint: 0.9,
  brightness: 0.12,
  opacity: 0.9,
};

const LIGHT: Palette = {
  color1: "#e6e6ea",
  color2: "#FF9FFC",
  color3: "#5227FF",
  backgroundColor: "#ffffff",
  lightMode: true,
  blackPoint: 0.9,
  brightness: 0.09,
  opacity: 0.06,
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
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackgroundColor;
uniform bool uLightMode;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse) {
    drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  }
  p += drift;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;
  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) {
    mid = 0.65;
  } else if (uColorMode > 0.5) {
    mid = 0.35;
  }

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  if (uLightMode) {
    float signal = 1.0 - exp(-max(c, 0.0) * 6.5);
    float body = smoothstep(0.075, 0.68, signal);
    float ridge = smoothstep(0.42, 0.92, signal);

    vec3 lightCol = mix(uColor1, uColor2, smoothstep(0.08, 0.52, signal));
    lightCol = mix(lightCol, uColor3, smoothstep(0.52, 0.96, signal));
    lightCol = mix(lightCol, lightCol * 0.72, ridge * 0.24);

    float coverage = body * mix(0.2, 0.86, signal) * uOpacity;
    if (uGrain > 0.5) {
      float gr = hash(gl_FragCoord.xy + iTime);
      coverage += (gr - 0.5) * uGrainIntensity * body * 0.16;
    }
    fragColor = vec4(mix(uBackgroundColor, lightCol, clamp(coverage, 0.0, 0.92)), 1.0);
  } else {
    fragColor = vec4(col * a, a);
  }
}
`;

export default function MoltenMetal({
  dark = DARK,
  light = LIGHT,
  mouseInteraction = true,
}: {
  dark?: Palette;
  light?: Palette;
  mouseInteraction?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
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
        uSpeed: { value: 0.35 },
        uScale: { value: 4 },
        uDetail: { value: 3 },
        uGlow: { value: 1.6 },
        uCoreSize: { value: 0.1 },
        uSwirl: { value: 1 },
        uFold: { value: -0.2 },
        uBlackPoint: { value: 0.18 },
        uBrightness: { value: 1.45 },
        uColorMode: { value: 0 },
        uGrain: { value: 1 },
        uGrainIntensity: { value: 0.05 },
        uOpacity: { value: 1 },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: 0.3 },
        uEnableMouse: { value: true },
        uColor1: { value: new Float32Array([1, 1, 1]) },
        uColor2: { value: new Float32Array([1, 1, 1]) },
        uColor3: { value: new Float32Array([1, 1, 1]) },
        uBackgroundColor: { value: new Float32Array([1, 1, 1]) },
        uLightMode: { value: false },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const scheme = window.matchMedia("(prefers-color-scheme: dark)");
    const applyPalette = () => {
      const stamped = document.documentElement.getAttribute("data-theme");
      const isDark = stamped ? stamped === "dark" : scheme.matches;
      const p = isDark ? palettes.current.dark : palettes.current.light;
      program.uniforms.uColor1.value.set(hexToRgb(p.color1));
      program.uniforms.uColor2.value.set(hexToRgb(p.color2));
      program.uniforms.uColor3.value.set(hexToRgb(p.color3));
      program.uniforms.uBackgroundColor.value.set(hexToRgb(p.backgroundColor));
      program.uniforms.uLightMode.value = p.lightMode;
      program.uniforms.uBlackPoint.value = p.blackPoint;
      program.uniforms.uBrightness.value = p.brightness;
      program.uniforms.uOpacity.value = p.opacity;
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

    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const repaintIfStill = () => {
      if (stillness.matches) renderer.render({ scene: mesh });
    };
    scheme.addEventListener("change", repaintIfStill);
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const targetMouse = [0.5, 0.5];
    const currentMouse = [0.5, 0.5];
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse[0] = e.clientX / Math.max(window.innerWidth, 1);
      targetMouse[1] = 1 - e.clientY / Math.max(window.innerHeight, 1);
    };
    const handleMouseLeave = () => {
      targetMouse[0] = 0.5;
      targetMouse[1] = 0.5;
    };
    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove);
      document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    }
    program.uniforms.uEnableMouse.value = mouseInteraction;

    const t0 = performance.now();
    let raf = 0;
    let onScreen = true;
    let pageVisible = !document.hidden;

    const loop = (t: number) => {
      if (!stillness.matches) {
        program.uniforms.iTime.value = (t - t0) * 0.001;
        if (mouseInteraction) {
          currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
          currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
          program.uniforms.uMouse.value[0] = currentMouse[0];
          program.uniforms.uMouse.value[1] = currentMouse[1];
        }
      }
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
      if (mouseInteraction) {
        window.removeEventListener("mousemove", handleMouseMove);
        document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      }
      themeWatcher.disconnect();
      scheme.removeEventListener("change", applyPalette);
      scheme.removeEventListener("change", repaintIfStill);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Palettes and mouseInteraction are read through the closure, so changing
    // them never rebuilds this. Mouse toggling is wired once at mount time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mouseInteraction]);

  return (
    <div ref={host} aria-hidden className="pointer-events-none h-full w-full overflow-hidden" />
  );
}

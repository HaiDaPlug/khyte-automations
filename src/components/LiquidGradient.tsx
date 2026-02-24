"use client";

import { useEffect, useRef } from "react";

/**
 * LiquidGradient — WebGL mesh gradient hero background
 * Ported from the Framer "Liquid Gradient" component (Troy Miller)
 * Raw WebGL — no Three.js dependency
 * Khyte brand palette mapped to 6 color uniforms
 */

const VERT = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColor1;
uniform vec3  uColor2;
uniform vec3  uColor3;
uniform vec3  uColor4;
uniform vec3  uColor5;
uniform vec3  uColor6;
uniform float uSpeed;
uniform float uIntensity;
uniform float uGrainIntensity;
uniform vec3  uDarkNavy;
uniform float uGradientSize;
uniform float uColor1Weight;
uniform float uColor2Weight;

varying vec2 vUv;

float grain(vec2 uv, float time) {
  vec2 grainUv = uv * uResolution * 0.5;
  float v = fract(sin(dot(grainUv + time, vec2(12.9898, 78.233))) * 43758.5453);
  return v * 2.0 - 1.0;
}

vec3 getGradientColor(vec2 uv, float time) {
  float r = uGradientSize;

  vec2 c1  = vec2(0.5 + sin(time*uSpeed*0.40)*0.4,  0.5 + cos(time*uSpeed*0.50)*0.4);
  vec2 c2  = vec2(0.5 + cos(time*uSpeed*0.60)*0.5,  0.5 + sin(time*uSpeed*0.45)*0.5);
  vec2 c3  = vec2(0.5 + sin(time*uSpeed*0.35)*0.45, 0.5 + cos(time*uSpeed*0.55)*0.45);
  vec2 c4  = vec2(0.5 + cos(time*uSpeed*0.50)*0.4,  0.5 + sin(time*uSpeed*0.40)*0.4);
  vec2 c5  = vec2(0.5 + sin(time*uSpeed*0.70)*0.35, 0.5 + cos(time*uSpeed*0.60)*0.35);
  vec2 c6  = vec2(0.5 + cos(time*uSpeed*0.45)*0.5,  0.5 + sin(time*uSpeed*0.65)*0.5);
  vec2 c7  = vec2(0.5 + sin(time*uSpeed*0.55)*0.38, 0.5 + cos(time*uSpeed*0.48)*0.42);
  vec2 c8  = vec2(0.5 + cos(time*uSpeed*0.65)*0.36, 0.5 + sin(time*uSpeed*0.52)*0.44);
  vec2 c9  = vec2(0.5 + sin(time*uSpeed*0.42)*0.41, 0.5 + cos(time*uSpeed*0.58)*0.39);
  vec2 c10 = vec2(0.5 + cos(time*uSpeed*0.48)*0.37, 0.5 + sin(time*uSpeed*0.62)*0.43);
  vec2 c11 = vec2(0.5 + sin(time*uSpeed*0.68)*0.33, 0.5 + cos(time*uSpeed*0.44)*0.46);
  vec2 c12 = vec2(0.5 + cos(time*uSpeed*0.38)*0.39, 0.5 + sin(time*uSpeed*0.56)*0.41);

  float i1  = 1.0 - smoothstep(0.0, r, length(uv - c1));
  float i2  = 1.0 - smoothstep(0.0, r, length(uv - c2));
  float i3  = 1.0 - smoothstep(0.0, r, length(uv - c3));
  float i4  = 1.0 - smoothstep(0.0, r, length(uv - c4));
  float i5  = 1.0 - smoothstep(0.0, r, length(uv - c5));
  float i6  = 1.0 - smoothstep(0.0, r, length(uv - c6));
  float i7  = 1.0 - smoothstep(0.0, r, length(uv - c7));
  float i8  = 1.0 - smoothstep(0.0, r, length(uv - c8));
  float i9  = 1.0 - smoothstep(0.0, r, length(uv - c9));
  float i10 = 1.0 - smoothstep(0.0, r, length(uv - c10));
  float i11 = 1.0 - smoothstep(0.0, r, length(uv - c11));
  float i12 = 1.0 - smoothstep(0.0, r, length(uv - c12));

  // Rotating radial overlays
  vec2 ru1 = uv - 0.5;
  float a1 = time * uSpeed * 0.15;
  ru1 = vec2(ru1.x*cos(a1) - ru1.y*sin(a1), ru1.x*sin(a1) + ru1.y*cos(a1)) + 0.5;

  vec2 ru2 = uv - 0.5;
  float a2 = -time * uSpeed * 0.12;
  ru2 = vec2(ru2.x*cos(a2) - ru2.y*sin(a2), ru2.x*sin(a2) + ru2.y*cos(a2)) + 0.5;

  float ri1 = 1.0 - smoothstep(0.0, 0.8, length(ru1 - 0.5));
  float ri2 = 1.0 - smoothstep(0.0, 0.8, length(ru2 - 0.5));

  vec3 color = vec3(0.0);
  color += uColor1 * i1  * (0.55 + 0.45*sin(time*uSpeed))        * uColor1Weight;
  color += uColor2 * i2  * (0.55 + 0.45*cos(time*uSpeed*1.2))    * uColor2Weight;
  color += uColor3 * i3  * (0.55 + 0.45*sin(time*uSpeed*0.8))    * uColor1Weight;
  color += uColor4 * i4  * (0.55 + 0.45*cos(time*uSpeed*1.3))    * uColor2Weight;
  color += uColor5 * i5  * (0.55 + 0.45*sin(time*uSpeed*1.1))    * uColor1Weight;
  color += uColor6 * i6  * (0.55 + 0.45*cos(time*uSpeed*0.9))    * uColor2Weight;
  color += uColor1 * i7  * (0.55 + 0.45*sin(time*uSpeed*1.4))    * uColor1Weight;
  color += uColor2 * i8  * (0.55 + 0.45*cos(time*uSpeed*1.5))    * uColor2Weight;
  color += uColor3 * i9  * (0.55 + 0.45*sin(time*uSpeed*1.6))    * uColor1Weight;
  color += uColor4 * i10 * (0.55 + 0.45*cos(time*uSpeed*1.7))    * uColor2Weight;
  color += uColor5 * i11 * (0.55 + 0.45*sin(time*uSpeed*1.8))    * uColor1Weight;
  color += uColor6 * i12 * (0.55 + 0.45*cos(time*uSpeed*1.9))    * uColor2Weight;

  color += mix(uColor1, uColor3, ri1) * 0.45 * uColor1Weight;
  color += mix(uColor2, uColor4, ri2) * 0.40 * uColor2Weight;

  color = clamp(color, 0.0, 1.0) * uIntensity;

  // Saturation boost
  float lum = dot(color, vec3(0.299, 0.587, 0.114));
  color = mix(vec3(lum), color, 1.35);
  color = pow(color, vec3(0.92));

  // Dark navy blend
  float brightness = length(color);
  float mixF = max(brightness * 1.2, 0.15);
  color = mix(uDarkNavy, color, mixF);

  // Clamp brightness
  float brt = length(color);
  if (brt > 1.0) color *= 1.0 / brt;

  return color;
}

void main() {
  vec2 uv = vUv;
  vec3 color = getGradientColor(uv, uTime);

  // Grain
  float g = grain(uv, uTime);
  color += g * uGrainIntensity;

  // Subtle RGB time shift
  float ts = uTime * 0.5;
  color.r += sin(ts) * 0.02;
  color.g += cos(ts * 1.4) * 0.02;
  color.b += sin(ts * 1.2) * 0.02;

  color = clamp(color, 0.0, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b];
}

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return sh;
}

// Khyte brand palette → 6 gradient colors
const C1 = "#C4501C"; // primary orange
const C2 = "#8B2E08"; // deep ember
const C3 = "#E8733A"; // bright amber
const C4 = "#5E1E10"; // dark espresso-red
const C5 = "#D4622B"; // mid orange
const C6 = "#3D1108"; // near-black espresso
const BG = "#1B0803"; // base dark

export default function LiquidGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    // Compile + link program
    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vert);
    gl.attachShader(prog, frag);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Fullscreen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTime         = gl.getUniformLocation(prog, "uTime");
    const uResolution   = gl.getUniformLocation(prog, "uResolution");
    const uColor1       = gl.getUniformLocation(prog, "uColor1");
    const uColor2       = gl.getUniformLocation(prog, "uColor2");
    const uColor3       = gl.getUniformLocation(prog, "uColor3");
    const uColor4       = gl.getUniformLocation(prog, "uColor4");
    const uColor5       = gl.getUniformLocation(prog, "uColor5");
    const uColor6       = gl.getUniformLocation(prog, "uColor6");
    const uSpeed        = gl.getUniformLocation(prog, "uSpeed");
    const uIntensity    = gl.getUniformLocation(prog, "uIntensity");
    const uGrainInt     = gl.getUniformLocation(prog, "uGrainIntensity");
    const uDarkNavy     = gl.getUniformLocation(prog, "uDarkNavy");
    const uGradSize     = gl.getUniformLocation(prog, "uGradientSize");
    const uC1W          = gl.getUniformLocation(prog, "uColor1Weight");
    const uC2W          = gl.getUniformLocation(prog, "uColor2Weight");

    // Set static uniforms
    gl.uniform3fv(uColor1,    hexToRgb(C1));
    gl.uniform3fv(uColor2,    hexToRgb(C2));
    gl.uniform3fv(uColor3,    hexToRgb(C3));
    gl.uniform3fv(uColor4,    hexToRgb(C4));
    gl.uniform3fv(uColor5,    hexToRgb(C5));
    gl.uniform3fv(uColor6,    hexToRgb(C6));
    gl.uniform3fv(uDarkNavy,  hexToRgb(BG));
    gl.uniform1f(uSpeed,      0.18);   // slow, considered — Khyte brand
    gl.uniform1f(uIntensity,  1.1);
    gl.uniform1f(uGrainInt,   0.028);
    gl.uniform1f(uGradSize,   0.72);
    gl.uniform1f(uC1W,        1.2);
    gl.uniform1f(uC2W,        0.9);

    // Resize handler
    let w = 0, h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width  = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Animation loop
    let raf = 0;
    let t = 0;
    let last = performance.now();
    const animate = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      t += delta;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}

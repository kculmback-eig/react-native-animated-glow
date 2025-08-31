// src/animated-glow/helpers.ts

import type { RGBColor } from './types';

// --- Worklet to parse hex/rgb color strings ---
export const parseColorToRgbWorklet = (color: string): RGBColor => {
    'worklet';
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbaMatch) {
      return { r: parseInt(rgbaMatch[1], 10), g: parseInt(rgbaMatch[2], 10), b: parseInt(rgbaMatch[3], 10) };
    }
    let hex = color.startsWith('#') ? color.substring(1) : color;
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    }
    return { r: 0, g: 0, b: 0 }; // Default to black if parsing fails
};

// --- Worklet to parse full RGBA color strings ---
export const parseColorToRgbaWorklet = (color: string): {r: number, g: number, b: number, a: number} => {
    'worklet';
    if (!color || color === 'transparent') {
        return { r: 0, g: 0, b: 0, a: 0 };
    }
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbaMatch) {
      return { 
          r: parseInt(rgbaMatch[1], 10), 
          g: parseInt(rgbaMatch[2], 10), 
          b: parseInt(rgbaMatch[3], 10),
          a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1.0
      };
    }
    let hex = color.startsWith('#') ? color.substring(1) : color;
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    if (hex.length === 8) { // RRGGBBAA
      return { r: parseInt(hex.substring(0, 2), 16), g: parseInt(hex.substring(2, 4), 16), b: parseInt(hex.substring(4, 6), 16), a: parseInt(hex.substring(6, 8), 16) / 255 };
    }
    if (hex.length === 6) { // RRGGBB
      return { r: parseInt(hex.substring(0, 2), 16), g: parseInt(hex.substring(2, 4), 16), b: parseInt(hex.substring(4, 6), 16), a: 1.0 };
    }
    return { r: 0, g: 0, b: 0, a: 0 }; // Default to transparent black
};
  
export const interpolateColorWorklet = (color1: RGBColor, color2: RGBColor, factor: number): RGBColor => { 'worklet'; if (!color1 || !color2) { return color1 || color2 || { r: 0, g: 0, b: 0 }; } const r = Math.round(color1.r + factor * (color2.r - color1.r)); const g = Math.round(color1.g + factor * (color2.g - color1.g)); const b = Math.round(color1.b + factor * (color2.b - color1.b)); return { r, g, b }; };
export const getGradientColorWorklet = (progress: number, colors: RGBColor[]): RGBColor => { 'worklet'; if (!colors || colors.length === 0) return { r: 0, g: 0, b: 0 }; if (colors.length === 1) return colors[0]; const fullColorList = [...colors, colors[0]]; const segLen = 1 / (fullColorList.length - 1); const segIdx = Math.min(Math.floor(progress / segLen), fullColorList.length - 2); const segProg = (progress - segIdx * segLen) / segLen; return interpolateColorWorklet(fullColorList[segIdx], fullColorList[segIdx + 1], segProg); };

export const getGlowSizeVec4Worklet = (glowSize: number | number[]): [number, number, number, number] => { 
    'worklet'; 
    const arr = Array.isArray(glowSize) ? glowSize : [glowSize]; 
    if (arr.length === 0) return [0, 0, 0, 0]; 
    if (arr.length === 1) return [arr[0], arr[0], arr[0], arr[0]]; 
    if (arr.length === 2) return [arr[0], arr[1], arr[1], arr[0]]; 
    if (arr.length === 3) return [arr[0], arr[1], arr[2], arr[2]]; 
    return [arr[0], arr[1], arr[2], arr[3]]; 
};

export const interpolateNumber = (from: number, to: number, p: number): number => {
    'worklet';
    return from + (to - from) * p;
};

export const interpolateRgbaWorklet = (c1: {r:number,g:number,b:number,a:number}, c2: {r:number,g:number,b:number,a:number}, p: number): {r:number,g:number,b:number,a:number} => {
    'worklet';
    const r = Math.round(c1.r + p * (c2.r - c1.r));
    const g = Math.round(c1.g + p * (c2.g - c1.g));
    const b = Math.round(c1.b + p * (c2.b - c1.b));
    const a = c1.a + p * (c2.a - c1.a);
    return { r, g, b, a };
};

export const interpolateNumberArray = (from: number[], to: number[], p: number): number[] => {
    'worklet';
    const fromLen = from.length;
    const toLen = to.length;
    if (fromLen === 0 && toLen === 0) return [];
    if (toLen === 0) return from.map(v => interpolateNumber(v, 0, p));
    if (fromLen === 0) return to.map(v => interpolateNumber(0, v, p));
    const maxLen = Math.max(fromLen, toLen);
    const result = new Array(maxLen);
    for (let i = 0; i < maxLen; i++) {
        const fromVal = from[i] ?? from[fromLen - 1];
        const toVal = to[i] ?? to[toLen - 1];
        result[i] = interpolateNumber(fromVal, toVal, p);
    }
    return result;
};

export const interpolateColorArrayWorklet = (from: string[], to: string[], p: number): RGBColor[] => {
    'worklet';
    const fromLen = from.length;
    const toLen = to.length;
    if (fromLen === 0 && toLen === 0) return [];

    const fromRgb = from.map(c => parseColorToRgbWorklet(c));
    const toRgb = to.map(c => parseColorToRgbWorklet(c));

    if (toLen === 0) return fromRgb;
    if (fromLen === 0) return toRgb;

    const maxLen = Math.max(fromLen, toLen);
    const result: RGBColor[] = [];
    for (let i = 0; i < maxLen; i++) {
        const fromColor = fromRgb[i] ?? fromRgb[fromRgb.length - 1];
        const toColor = toRgb[i] ?? toRgb[toRgb.length - 1];
        result.push(interpolateColorWorklet(fromColor, toColor, p));
    }
    return result;
};
// src/glow-presets.ts
import { PresetConfig } from "./animated-glow/types";

// NOTE: All presets from your test project are copied here.
const presets = {
  defaultRainbow: {
    metadata: { name: 'Default Rainbow', textColor: '#FFFFFF', textSize: 16, category: 'Gradient', tags: ['colorful', 'rainbow', 'vibrant', 'skia'] },
    states: [
      {
        name: 'default',
        preset: {
          cornerRadius: 30,
          outlineWidth: 4,
          borderColor: ['rgba(238, 255, 0, 1)', 'rgba(79, 255, 0, 1)', 'rgba(46, 90, 255, 1)', 'rgba(254, 0, 255, 1)', 'rgba(231, 23, 23, 1)'],
          backgroundColor: 'rgba(10, 10, 10, 1)',
          animationSpeed: 1.2,
          borderSpeedMultiplier: 1,
          glowLayers: [
            { glowPlacement: 'behind', colors: ['rgba(205, 201, 35, 1)', 'rgba(0, 255, 79, 1)', 'rgba(0, 119, 255, 1)', 'rgba(239, 0, 255, 1)', 'rgba(222, 28, 28, 1)'], glowSize: 34, opacity: 0.2, speedMultiplier: 1, coverage: 1, relativeOffset: 0 },
            { glowPlacement: 'behind', colors: ['rgba(185, 182, 32, 1)', 'rgba(0, 255, 79, 1)', 'rgba(0, 119, 255, 1)', 'rgba(239, 0, 255, 1)', 'rgba(222, 28, 28, 1)'], glowSize: 6, opacity: 0.5, speedMultiplier: 1, coverage: 1, relativeOffset: 0 },
            { glowPlacement: 'behind', colors: ['#FFFFFF'], glowSize: [2, 8, 8, 2], opacity: 0.2, speedMultiplier: 2, coverage: 0.5, relativeOffset: 0 }
          ]
        }
      },
      { name: 'hover', transition: 300, preset: { animationSpeed: 1.8, glowLayers: [{ glowSize: 40, opacity: 0.24 }, { glowSize: 7, opacity: 0.6 }, { glowSize: [2, 10, 10, 2], opacity: 0.24 }] } },
      { name: 'press', transition: 100, preset: { animationSpeed: 2.4, glowLayers: [{ glowSize: 40, opacity: 0.28 }, { glowSize: 8, opacity: 0.7 }, { glowSize: [3, 11, 11, 3], opacity: 0.28 }] } }
    ]
  },
  oceanSunset: {
    metadata: { name: 'Ocean Sunset', textColor: '#FFFFFF', textSize: 16, category: 'Gradient', tags: ['warm', 'cool', 'sunset', 'vibrant'] },
    states: [
      {
        name: 'default',
        preset: {
          cornerRadius: 70,
          outlineWidth: 4,
          borderColor: ['rgba(255, 124, 171, 1)', 'rgba(63, 100, 199, 1)', 'rgba(240, 115, 46, 1)'],
          backgroundColor: 'rgba(21, 21, 21, 1)',
          animationSpeed: 2,
          borderSpeedMultiplier: 1,
          glowLayers: [
            { glowPlacement: 'behind', colors: ['#f82fc6', '#5a4ff9', '#ff923e'], glowSize: 15, opacity: 0.1, speedMultiplier: 1, coverage: 1 },
            { glowPlacement: 'behind', colors: ['rgba(255, 89, 213, 1)', 'rgba(63, 89, 255, 1)', 'rgba(255, 164, 0, 1)'], glowSize: 5, opacity: 0.5, speedMultiplier: 1, coverage: 1 }
          ]
        }
      },
      { name: 'hover', transition: 300, preset: { animationSpeed: 3, glowLayers: [{ glowSize: 18, opacity: 0.12 }, { glowSize: 6, opacity: 0.6 }] } },
      { name: 'press', transition: 100, preset: { animationSpeed: 4, glowLayers: [{ glowSize: 21, opacity: 0.14 }, { glowSize: 7, opacity: 0.7 }] } }
    ]
  },
} satisfies Record<string, PresetConfig>;

export const glowPresets = presets;
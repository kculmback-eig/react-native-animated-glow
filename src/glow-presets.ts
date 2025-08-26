// app/glow-presets.tsx
import { PresetConfig } from "./animated-glow/types";

const presets = {

  defaultRainbow: {
    metadata: { name: 'Default Rainbow', textColor: '#FFFFFF', textSize: 16, category: 'Gradient', tags: ['colorful', 'rainbow', 'vibrant', 'skia'] },
    cornerRadius: 30,
    outlineWidth: 4,
    borderColor: ['rgba(238, 255, 0, 1)', 'rgba(79, 255, 0, 1)', 'rgba(46, 90, 255, 1)', 'rgba(254, 0, 255, 1)', 'rgba(231, 23, 23, 1)'],
    backgroundColor: 'rgba(10, 10, 10, 1)',
    animationSpeed: 1.2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['rgba(205, 201, 35, 1)', 'rgba(0, 255, 79, 1)', 'rgba(0, 119, 255, 1)', 'rgba(239, 0, 255, 1)', 'rgba(222, 28, 28, 1)'],
        glowSize: 34,
        opacity: 0.2,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(185, 182, 32, 1)', 'rgba(0, 255, 79, 1)', 'rgba(0, 119, 255, 1)', 'rgba(239, 0, 255, 1)', 'rgba(222, 28, 28, 1)'],
        glowSize: 6,
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['#FFFFFF'],
        glowSize: [2, 8, 8, 2],
        opacity: 0.2,
        speedMultiplier: 2,
        coverage: 0.5,
        relativeOffset: 0
      }
    ]
  },


  oceanSunset: {
    metadata: { name: 'Ocean Sunset', textColor: '#FFFFFF', textSize: 16, category: 'Gradient', tags: ['warm', 'cool', 'sunset', 'vibrant'] },
    cornerRadius: 70,
    outlineWidth: 4,
    borderColor: ['rgba(255, 124, 171, 1)', 'rgba(63, 100, 199, 1)', 'rgba(240, 115, 46, 1)'],
    backgroundColor: 'rgba(21, 21, 21, 1)',
    animationSpeed: 2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['#f82fc6', '#5a4ff9', '#ff923e'],
        glowSize: 15,
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 89, 213, 1)', 'rgba(63, 89, 255, 1)', 'rgba(255, 164, 0, 1)'],
        glowSize: 5,
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 1
      }
    ],
    states: [{ name: 'hover', transition: 500, preset: { animationSpeed: 1.5, glowLayers: [{ glowSize: 35, opacity: 0.15 }, { glowSize: 8, opacity: 0.4 }] } }]
  },


  neonGreen: {
    cornerRadius: 50,
    outlineWidth: 4,
    borderColor: ['rgba(225, 255, 109, 1)', 'rgba(14, 255, 0, 1)', 'rgba(251, 255, 105, 1)'],
    backgroundColor: '#222',
    animationSpeed: 3,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['#00ff84', '#ffff00', '#15ff00'],
        glowSize: [10, 20, 10],
        opacity: 0.2,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'behind',
        colors: ['#00ff84', '#ffff00', '#15ff00'],
        glowSize: [1, 8, 1],
        opacity: 0.3,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(90, 255, 0, 1)', '#ffff00', '#15ff00'],
        glowSize: [1, 8, 1],
        opacity: 0.3,
        speedMultiplier: 1,
        coverage: 0.75
      },
      {
        glowPlacement: 'behind',
        colors: ['#44ff00', '#00ff84', '#96ff96'],
        glowSize: [2, 8, 2],
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 1
      }
    ]
  },

  appleIntelligence: {
    metadata: { name: 'Apple Intelligence', textColor: '#FFFFFF', textSize: 14, category: 'Complex', tags: ['ai', 'siri', 'tech', 'inset'] },
    cornerRadius: 50,
    outlineWidth: 0,
    borderColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: '#000',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'inside',
        colors: ['rgba(15, 0, 255, 1)', 'rgba(174, 27, 110, 1)', 'rgba(207, 0, 0, 1)', 'rgba(255, 159, 16, 1)'],
        glowSize: 24,
        opacity: 0.3,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'inside',
        colors: ['rgba(47, 0, 255, 0.54)', 'rgba(174, 27, 124, 1)', 'rgba(207, 0, 0, 1)', 'rgba(255, 164, 53, 1)'],
        glowSize: 6,
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'inside',
        colors: ['rgba(233, 227, 255, 1)', 'rgba(255, 84, 197, 1)', 'rgba(255, 38, 87, 1)', 'rgba(255, 195, 136, 1)'],
        glowSize: 1,
        opacity: 1,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'inside',
        colors: ['rgba(91, 104, 255, 1)', 'rgba(178, 223, 255, 1)'],
        glowSize: [0, 4, 4, 0],
        opacity: 0.2,
        speedMultiplier: 2,
        coverage: 0.4
      },
      {
        glowPlacement: 'inside',
        colors: ['rgba(255, 255, 255, 1)'],
        glowSize: [0, 2, 0],
        opacity: 0.2,
        speedMultiplier: 2,
        coverage: 0.4
      }
    ]
  },

  ripple: {
    metadata: { name: 'Ripple', textColor: '#FFFFFF', textSize: 16, category: 'Complex', tags: ['dark', 'purple', 'water', 'pulse'] },
    cornerRadius: 50,
    outlineWidth: 4,
    borderColor: ['rgba(245, 178, 255, 1)', 'rgba(111, 113, 208, 1)'],
    backgroundColor: 'rgba(10, 10, 10, 1)',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 0, 192, 1)', 'rgba(84, 75, 211, 1)', 'rgba(0, 0, 0, 0)'],
        glowSize: 10,
        opacity: 0.4,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 125, 222, 1)', 'rgba(131, 159, 255, 1)', 'rgba(0, 0, 0, 0)'],
        glowSize: 3,
        opacity: 1,
        speedMultiplier: 1,
        coverage: 1
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 121, 221, 1)', 'rgba(0, 59, 255, 1)', 'rgba(0, 0, 0, 0)'],
        glowSize: [1, 2, 2, 1],
        opacity: 1,
        speedMultiplier: 1,
        coverage: 1
      }
    ]
  },

  glowingBorder: {
    metadata: { name: 'Glowing Border', textColor: '#FFFFFF', textSize: 16, category: 'Border', tags: ['gradient', 'border', 'animated', 'subtle'] },
    cornerRadius: 10,
    outlineWidth: 1,
    borderColor: ['rgba(16, 16, 16, 1)', 'rgba(227, 74, 255, 0.3)', 'rgba(142, 88, 163, 1)', 'rgba(98, 181, 255, 1)', 'rgba(199, 208, 255, 1)', 'rgba(55, 112, 169, 1)'],
    backgroundColor: 'rgba(0, 0, 0, 1)',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'over',
        colors: ['rgba(0, 0, 0, 0)', 'rgba(137, 73, 151, 1)', 'rgba(85, 68, 216, 1)'],
        glowSize: [0, 25, 20, 0],
        opacity: 0.15,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(0, 0, 0, 0)', 'rgba(137, 73, 151, 1)', 'rgba(85, 68, 216, 1)'],
        glowSize: [0, 5, 5, 0],
        opacity: 0.2,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(166, 68, 195, 1)', 'rgba(245, 219, 255, 1)'],
        glowSize: [1, 8],
        opacity: 0.06,
        speedMultiplier: 1,
        coverage: 0.25,
        relativeOffset: 0.85
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(225, 102, 235, 1)', 'rgba(245, 219, 255, 1)'],
        glowSize: [0, 0.3],
        opacity: 1,
        speedMultiplier: 1,
        coverage: 0.25,
        relativeOffset: 0.85
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(83, 172, 255, 1)', 'rgba(0, 181, 255, 1)'],
        glowSize: [0, 8],
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 0.3,
        relativeOffset: 0.4
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(83, 172, 255, 1)', 'rgba(255, 255, 255, 1)'],
        glowSize: [0, 0.3],
        opacity: 1,
        speedMultiplier: 1,
        coverage: 0.25,
        relativeOffset: 0.4
      }
    ]
  },

  pureWhite: { 
    metadata: { name: 'Pure White', textColor: '#ffffff', textSize: 16, category: 'Subtle', tags: ['simple', 'clean', 'white', 'minimal'] },
    cornerRadius: 60, outlineWidth: 4, borderColor: 'white', animationSpeed: 0, 
    glowLayers: [
      { colors: ['#FFFFFF'], opacity: 0.1, glowSize: 28, speedMultiplier: 0, glowPlacement: 'behind' },
      { colors: ['#FFFFFF'], opacity: 0.3, glowSize: 6, speedMultiplier: 0, glowPlacement: 'behind' }
    ],
    states: [{ name: 'hover', transition: 300, preset: { glowLayers: [{ opacity: 0.15, glowSize: 32 }, { glowSize: 14 }] } }]
  },

  alert: {
    metadata: { name: 'Alert', textColor: '#FFFFFF', textSize: 16, category: 'Alerts', tags: ['warning', 'error', 'colorful', 'fast'] },
    cornerRadius: 30,
    outlineWidth: 6,
    borderColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: '#222',
    animationSpeed: 5,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['#001cff', 'rgba(179, 0, 255, 1)', '#ff0000', '#ff00b0'],
        glowSize: 12,
        opacity: 0.7,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['#001cff', 'rgba(179, 0, 255, 1)', '#ff0000', '#ff00b0'],
        glowSize: 7,
        opacity: 0.7,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(0, 171, 255, 1)', 'rgba(0, 190, 255, 1)', '#ff6f00'],
        glowSize: 7,
        opacity: 1,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      }
    ]
  },

  abyssalGlow: {
    metadata: { name: 'Abyssal Glow', textColor: 'rgba(152, 237, 255, 1)', textSize: 16, category: 'Vibrant', tags: ['ocean', 'deep sea', 'blue', 'teal', 'glow'] },
    cornerRadius: 40,
    outlineWidth: 3,
    borderColor: ['rgba(2, 62, 138, 1)', 'rgba(0, 180, 216, 1)', 'rgba(129, 236, 236, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
    backgroundColor: 'rgba(0, 0, 0, 1)',
    animationSpeed: 2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['rgba(2, 62, 138, 1)', 'rgba(0, 180, 216, 1)', 'rgba(129, 236, 236, 1)', 'rgba(72, 202, 228, 1)'], opacity: 0.3, glowSize: [0, 4], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.7, relativeOffset: 0.15 },
      { colors: ['rgba(2, 62, 138, 1)', 'rgba(0, 180, 216, 1)', 'rgba(129, 236, 236, 1)', 'rgba(72, 202, 228, 1)'], opacity: 0.05, glowSize: [0, 20], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.75, relativeOffset: 0.2 }
    ],
    states: [
      { name: 'hover', transition: 400, preset: { glowLayers: [{ opacity: 0.3, glowSize: 25 }, { opacity: 1.1, glowSize: 7 }] } }
    ]
  },

  vaporwave: {
    metadata: { name: 'Vaporwave', textColor: '#FFFFFF', textSize: 16, category: 'Retro', tags: ['80s', 'pink', 'blue', 'synthwave'] },
    cornerRadius: 10,
    outlineWidth: 0,
    borderColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    animationSpeed: 2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 75, 169, 1)', '#01CDFE', '#05ffd2', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'],
        glowSize: 5,
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 76, 156, 1)', '#01CDFE', '#05ffd2', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)'],
        glowSize: 10,
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['#66d3ff', '#ff67ef'],
        glowSize: 4,
        opacity: 0.9,
        speedMultiplier: 0.8,
        coverage: 1,
        relativeOffset: 0
      }
    ]
  },

  showtime: {
    metadata: { name: 'Showtime', textColor: '#FFFFFF', textSize: 16, category: 'Subtle', tags: ['gold', 'marquee', 'glamorous', 'lights'] },
    cornerRadius: 10,
    outlineWidth: 2,
    borderColor: 'rgba(255, 237, 186, 1)',
    backgroundColor: '#222',
    animationSpeed: 2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 239, 210, 1)'],
        glowSize: [35, 20],
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 246, 212, 1)', 'rgba(255, 252, 239, 1)'],
        glowSize: [5, 4, 4, 5],
        opacity: 0.2,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 235, 184, 1)'],
        glowSize: [0, 20],
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 0.5,
        relativeOffset: 0
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(255, 239, 217, 1)'],
        glowSize: [0, 2],
        opacity: 1,
        speedMultiplier: 1,
        coverage: 0.6,
        relativeOffset: 0
      }
    ]
  },

  glimmer: {
    metadata: { name: 'Glimmer', textColor: '#FFFFFF', textSize: 16, category: 'Complex', tags: ['purple', 'sparkle', 'magic', 'fast'] },
    cornerRadius: 90,
    outlineWidth: 0,
    borderColor: 'rgba(0, 0, 0, 1)',
    backgroundColor: 'rgba(10, 10, 10, 1)',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['rgba(145, 46, 166, 1)', '#5a4ff9'],
        glowSize: [30, 45, 30],
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(190, 84, 245, 1)', 'rgba(88, 47, 236, 1)'],
        glowSize: 1,
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(194, 106, 255, 1)', 'rgba(226, 114, 255, 1)'],
        glowSize: [0, 30],
        opacity: 0.05,
        speedMultiplier: 2,
        coverage: 0.6,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(0, 0, 0, 1)', 'rgba(255, 118, 118, 1)'],
        glowSize: [0, 1],
        opacity: 1,
        speedMultiplier: 2,
        coverage: 0.5,
        relativeOffset: 0
      }
    ]
  },

  pastelDream: {
    metadata: { name: 'Pastel Dream', textColor: 'rgba(255, 237, 237, 1)', textSize: 16, category: 'Subtle', tags: ['pastel', 'soft', 'pink', 'blue'] },
    cornerRadius: 40,
    outlineWidth: 6,
    borderColor: ['rgba(145, 125, 255, 1)', 'rgba(249, 90, 255, 1)', 'rgba(255, 153, 153, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)'],
    backgroundColor: 'rgba(0, 0, 0, 1)',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['rgba(255, 108, 65, 1)', 'rgba(116, 170, 244, 1)', 'rgba(216, 76, 255, 1)', 'rgba(255, 139, 62, 1)'], opacity: 0.5, glowSize: [0, 5], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0.15 },
      { colors: ['rgba(255, 108, 65, 1)', 'rgba(116, 170, 244, 1)', 'rgba(216, 76, 255, 1)', 'rgba(255, 139, 62, 1)'], opacity: 0.05, glowSize: [0, 20], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.65, relativeOffset: 0.2 }
    ],
    states: [
      { name: 'hover', transition: 4000, preset: {
      glowLayers: [
        { colors: ['rgba(255, 108, 65, 1)', 'rgba(116, 170, 244, 1)', 'rgba(216, 76, 255, 1)', 'rgba(255, 139, 62, 1)'], opacity: 0.6, glowSize: [0, 8], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0.15 },
        { colors: ['rgba(255, 108, 65, 1)', 'rgba(116, 170, 244, 1)', 'rgba(216, 76, 255, 1)', 'rgba(255, 139, 62, 1)'], opacity: 0.06, glowSize: [0, 24], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.65, relativeOffset: 0.2 }
      ],      } }
    ]
  },

  plasmaArc: {
    metadata: { name: 'Plasma Arc', textColor: '#FFFFFF', textSize: 16, category: 'Sci-Fi', tags: ['blue', 'electric', 'energy', 'tech'] },
    cornerRadius: 40,
    outlineWidth: 4,
    borderColor: ['rgba(255, 255, 255, 1)', 'rgba(89, 157, 255, 1)'],
    backgroundColor: '#222',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['rgba(60, 71, 255, 1)', '#51b3ff', 'rgba(178, 244, 255, 1)'],
        glowSize: [8, 30],
        opacity: 0.6,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(100, 228, 255, 1)', 'rgba(87, 64, 255, 1)'],
        glowSize: 4,
        opacity: 1,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      }
    ]
  },

  confirmationGreen: {
    metadata: { name: 'Confirmation Green', textColor: '#FFFFFF', textSize: 16, category: 'Alerts', tags: ['success', 'green', 'confirmation', 'positive'] },
    cornerRadius: 20,
    outlineWidth: 2,
    borderColor: ['rgba(30, 255, 0, 1)', 'rgba(186, 255, 0, 1)', 'rgba(39, 255, 0, 1)'],
    backgroundColor: '#222',
    animationSpeed: 2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['#0fff47', 'rgba(255, 241, 0, 1)', '#00d646'],
        glowSize: 10,
        opacity: 0.05,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['#0fff47', 'rgba(255, 241, 0, 1)', '#00d646'],
        glowSize: 4,
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'inside',
        colors: ['rgba(99, 255, 0, 1)', 'rgba(180, 255, 65, 1)'],
        glowSize: [0, 20],
        opacity: 0.02,
        speedMultiplier: 1,
        coverage: 0.3,
        relativeOffset: 0
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(135, 255, 0, 1)', 'rgba(255, 248, 196, 1)'],
        glowSize: [0, 1],
        opacity: 0.5,
        speedMultiplier: 1,
        coverage: 0.4,
        relativeOffset: 0
      }
    ]
  },

  softWarning: {
    metadata: { name: 'Soft Warning', textColor: '#FFFFFF', textSize: 16, category: 'Alerts', tags: ['warning', 'orange', 'gentle', 'soft'] },
    cornerRadius: 20,
    outlineWidth: 4,
    borderColor: 'rgba(241, 135, 55, 1)',
    backgroundColor: '#222',
    animationSpeed: 0.1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['#ff9c00', 'rgba(255, 0, 0, 1)'],
        glowSize: 24,
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(255, 134, 134, 1)', 'rgba(255, 240, 108, 1)'],
        glowSize: 5,
        opacity: 0.4,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      }
    ]
  },

  cosmicNebula: {
    metadata: { name: 'Cosmic Nebula', textColor: '#FFFFFF', textSize: 16, category: 'Sci-Fi', tags: ['space', 'purple', 'galaxy', 'dark'] },
    cornerRadius: 10,
    outlineWidth: 3,
    borderColor: ['rgba(255, 171, 203, 1)', 'rgba(112, 49, 164, 1)', 'rgba(35, 21, 50, 1)'],
    backgroundColor: '#222',
    animationSpeed: 2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      {
        glowPlacement: 'behind',
        colors: ['#483D8B', '#8A2BE2', '#9370DB'],
        glowSize: 20,
        opacity: 0.1,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'behind',
        colors: ['rgba(185, 185, 250, 1)', 'rgba(199, 129, 199, 1)', 'rgba(77, 61, 175, 1)'],
        glowSize: [2, 6],
        opacity: 0.6,
        speedMultiplier: 1,
        coverage: 1,
        relativeOffset: 0
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(185, 185, 250, 1)', 'rgba(225, 133, 242, 1)'],
        glowSize: [0, 12],
        opacity: 0.05,
        speedMultiplier: 1.2,
        coverage: 0.5,
        relativeOffset: 0
      },
      {
        glowPlacement: 'over',
        colors: ['rgba(185, 185, 250, 1)', 'rgba(255, 140, 255, 1)'],
        glowSize: [0, 1],
        opacity: 1,
        speedMultiplier: 1.2,
        coverage: 0.3,
        relativeOffset: 0.9
      }
    ]
  },

  cloud: {
    metadata: { name: 'Cloud', textColor: 'rgba(255, 255, 255, 1)', textSize: 16, category: 'Subtle', tags: ['soft', 'white', 'sky', 'gentle'] },
    cornerRadius: 60,
    outlineWidth: 0,
    borderColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: '#222',
    animationSpeed: 0.6,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#FFFFFF'], opacity: 0.1, glowSize: [0, 5], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0 },
      { colors: ['#FFFFFF'], opacity: 0.2, glowSize: [0, 8], speedMultiplier: 1.5, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0.1 },
      { colors: ['#FFFFFF'], opacity: 0.34, glowSize: [0, 5], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0.2 },
      { colors: ['#FFFFFF'], opacity: 0.2, glowSize: [0, 7], speedMultiplier: 1.3, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.5, relativeOffset: 0.5 },
      { colors: ['#FFFFFF'], opacity: 0.2, glowSize: [0, 3], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.5, relativeOffset: 0.6 },
      { colors: ['#FFFFFF'], opacity: 0.3, glowSize: [0, 5], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.5, relativeOffset: 0.8 },
      { colors: ['#FFFFFF'], opacity: 0.2, glowSize: [0, 5], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.5, relativeOffset: 0.9 }
    ],
    states: [
      { name: 'hover', transition: 600, preset: { animationSpeed: 0.2, glowLayers: [{ glowSize: 35, opacity: 0.55 }, { glowSize: 10, opacity: 0.35 }] } }
    ]
  },

  cyberPink: {
    metadata: { name: 'Cyber Pink', textColor: '#FFFFFF', textSize: 16, category: 'Neon', tags: ['pink', 'cyberpunk', 'bright', 'fast'] },
    cornerRadius: 50,
    outlineWidth: 8,
    borderColor: ['rgba(177, 102, 255, 1)', 'rgba(255, 102, 163, 1)'],
    backgroundColor: 'rgba(27, 0, 25, 1)',
    animationSpeed: 3,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#FF1493', 'rgba(206, 0, 255, 1)', '#DB7093'], opacity: 0.2, glowSize: 30, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['rgba(254, 160, 177, 1)', 'rgba(206, 180, 255, 1)'], opacity: 0.2, glowSize: 12, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['rgba(255, 164, 180, 1)', 'rgba(255, 217, 217, 1)'], opacity: 1, glowSize: 4, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 250, preset: { animationSpeed: 4.5, glowLayers: [{ glowSize: 50 }, { glowSize: 28 }] } }
    ]
  },

  synthwaveRider: {
    metadata: { name: 'Synthwave Rider', textColor: 'rgba(0, 0, 0, 1)', textSize: 16, category: 'Retro', tags: ['purple', '80s', 'synthwave', 'dark'] },
    cornerRadius: 50,
    outlineWidth: 0,
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['rgba(129, 24, 187, 1)', 'rgba(125, 21, 229, 1)'], opacity: 0.5, glowSize: [0, 12], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0 },
      { colors: ['rgba(59, 40, 199, 1)', 'rgba(0, 168, 255, 1)'], opacity: 0.5, glowSize: [0, 6], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0.2 },
      { colors: ['rgba(179, 57, 129, 1)', 'rgba(218, 91, 139, 1)'], opacity: 0.5, glowSize: [0, 6], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.4, relativeOffset: 0.4 },
      { colors: ['rgba(238, 45, 45, 1)', 'rgba(239, 75, 75, 1)'], opacity: 0.5, glowSize: [0, 8], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0.6 },
      { colors: ['rgba(242, 137, 36, 1)', 'rgba(229, 145, 36, 1)'], opacity: 0.5, glowSize: [0, 20], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0.8 }
    ],
    states: [
      { name: 'hover', transition: 300, preset: { animationSpeed: 2 } }
    ]
  },

  goldenAura: {
    metadata: { name: 'Golden Aura', textColor: 'rgba(255, 208, 137, 1)', textSize: 16, category: 'Subtle', tags: ['gold', 'warm', 'static', 'elegant'] },
    cornerRadius: 60,
    outlineWidth: 10,
    borderColor: ['#ffe65e', 'white'],
    backgroundColor: '#222',
    animationSpeed: 0,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#ffa200', '#ffc100'], opacity: 0.2, glowSize: 20, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#ffcd41', '#ff5a00'], opacity: 1, glowSize: 10, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)'], opacity: 1, glowSize: 6, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 400, preset: { outlineWidth: 5, glowLayers: [{ opacity: 0.3, glowSize: 35 }, { opacity: 1.1, glowSize: 18 }] } }
    ]
  },

  enchantedForest: {
    metadata: { name: 'Enchanted Forest', textColor: 'rgba(130, 255, 0, 1)', textSize: 14, category: 'Nature', tags: ['green', 'magic', 'forest', 'sparkle'] },
    cornerRadius: 10,
    outlineWidth: 0,
    borderColor: '#98ffa1',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    animationSpeed: -1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#2E8B57', '#4cfb79', '#ffbf1f'], opacity: 0.2, glowSize: [0, 10], speedMultiplier: 2, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.7, relativeOffset: 0 },
      { colors: ['#67ff46', 'rgba(84, 241, 41, 1)'], opacity: 0.2, glowSize: [0, 8], speedMultiplier: 1.2, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.7, relativeOffset: 0.2 },
      { colors: ['rgba(70, 255, 155, 1)', 'rgba(61, 255, 119, 1)'], opacity: 0.2, glowSize: [0, 6], speedMultiplier: 1.5, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.7, relativeOffset: 0.4 },
      { colors: ['rgba(194, 255, 70, 1)', '#ffda3d'], opacity: 0.2, glowSize: [0, 10], speedMultiplier: 1.1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.7, relativeOffset: 0.6 },
      { colors: ['rgba(204, 255, 70, 1)', 'rgba(255, 206, 61, 1)'], opacity: 0.2, glowSize: [0, 8], speedMultiplier: 1.5, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.7, relativeOffset: 0.8 }
    ],
    states: [
      { name: 'hover', transition: 300, preset: { animationSpeed: 0.5 } }
    ]
  },

  siren: {
    metadata: { name: 'Siren', textColor: 'rgba(0, 0, 0, 1)', textSize: 16, category: 'Alerts', tags: ['red', 'blue', 'police', 'emergency'] },
    cornerRadius: 60,
    outlineWidth: 0,
    borderColor: 'rgba(160, 183, 255, 1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    animationSpeed: 4,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['rgba(255, 66, 66, 1)'], opacity: 0.6, glowSize: [0, 2], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.15, relativeOffset: 0 },
      { colors: ['rgba(0, 53, 255, 1)'], opacity: 0.6, glowSize: [0, 2], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.15, relativeOffset: 0.2 },
      { colors: ['rgba(255, 53, 53, 1)'], opacity: 0.6, glowSize: [0, 2], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.15, relativeOffset: 0.4 },
      { colors: ['rgba(0, 1, 255, 1)'], opacity: 0.6, glowSize: [0, 2], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.15, relativeOffset: 0.6 },
      { colors: ['rgba(255, 30, 30, 1)'], opacity: 0.6, glowSize: [0, 2], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.15, relativeOffset: 0.8 },
      { colors: ['rgba(11, 0, 255, 1)', 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 1)', 'rgba(11, 0, 255, 1)'], opacity: 0.3, glowSize: 8, speedMultiplier: 10, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['rgba(11, 0, 255, 1)', 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 1)', 'rgba(11, 0, 255, 1)'], opacity: 0.1, glowSize: 24, speedMultiplier: 10, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'over', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 150, preset: { animationSpeed: 4 } },
      { name: 'press', transition: 100, preset: { animationSpeed: 8 } }
    ]
  },

  arcticFreeze: {
    metadata: { name: 'Arctic Freeze', textColor: 'rgba(20, 32, 46, 1)', textSize: 16, category: 'Nature', tags: ['blue', 'ice', 'cold', 'winter'] },
    cornerRadius: 60,
    outlineWidth: 4,
    borderColor: 'white',
    backgroundColor: 'rgba(228, 246, 255, 1)',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#00FFFF', '#E0FFFF'], opacity: 0.4, glowSize: 10, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#FFFFFF', '#AFEEEE'], opacity: 1, glowSize: 4, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 500, preset: { animationSpeed: 1.5, glowLayers: [{ glowSize: 35 }, { glowSize: 22 }] } }
    ]
  },

  spotlight: {
    metadata: { name: 'Spotlight', textColor: 'rgba(255, 255, 255, 1)', textSize: 16, category: 'Subtle', tags: ['white', 'bright', 'focus', 'simple'] },
    cornerRadius: 10,
    outlineWidth: 0,
    borderColor: 'rgba(179, 179, 179, 1)',
    backgroundColor: '#222',
    animationSpeed: -1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['rgba(255, 255, 255, 1)'], opacity: 0.2, glowSize: [0, 30], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0 },
      { colors: ['rgba(255, 197, 150, 1)'], opacity: 0.3, glowSize: [0, 20], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0 },
      { colors: ['rgba(245, 224, 207, 1)'], opacity: 0.5, glowSize: [0, 5], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 0.6, relativeOffset: 0 },
      { colors: ['rgba(245, 224, 207, 1)'], opacity: 0.2, glowSize: [0, 5], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'over', coverage: 0.6, relativeOffset: 0.5 },
      { colors: ['#FFFFFF'], opacity: 1, glowSize: 1, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#FFFFFF'], opacity: 0.5, glowSize: 4, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['rgba(255, 239, 178, 1)'], opacity: 0.1, glowSize: 20, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 300, preset: { glowLayers: [{ opacity: 0.2, glowSize: 40 }, { opacity: 1.1, glowSize: 18 }] } }
    ]
  },

  moltenCore: {
    metadata: { name: 'Molten Core', textColor: 'rgba(255, 232, 0, 1)', textSize: 16, category: 'Nature', tags: ['fire', 'lava', 'orange', 'hot'] },
    cornerRadius: 70,
    outlineWidth: 2,
    borderColor: '#4d1d00',
    backgroundColor: '#222',
    animationSpeed: 2,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#ff4800', '#c12f00'], opacity: 0.6, glowSize: 28, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#ff8c00', '#fefc5a', '#ff4800'], opacity: 1, glowSize: 16, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 400, preset: { animationSpeed: 0.5, glowLayers: [{ glowSize: 32 }, { glowSize: 18 }] } }
    ]
  },
  auroraBorealis: {
    metadata: { name: 'Aurora Borealis', textColor: '#FFFFFF', textSize: 14, category: 'Nature', tags: ['gradient', 'sky', 'colorful', 'northern lights'] },
    cornerRadius: 30,
    outlineWidth: 0,
    borderColor: 'white',
    backgroundColor: '#222',
    animationSpeed: 1,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#4ef96d', '#33a0ff', '#f5519f'], opacity: 0.1, glowSize: 30, speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#4ef96d', 'rgba(116, 159, 255, 1)', 'rgba(255, 114, 170, 1)'], opacity: 0.5, glowSize: 10, speedMultiplier: 0.8, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#4ef96d', 'rgba(116, 159, 255, 1)', 'rgba(255, 114, 170, 1)'], opacity: 1, glowSize: 3, speedMultiplier: 0.8, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 600, preset: { animationSpeed: 0.6 } }
    ]
  },

  hotFlame: {
    metadata: { name: 'Hot Flame', textColor: '#ffc790', textSize: 16, category: 'Nature', tags: ['fire', 'hot', 'flame', 'orange'] },
    cornerRadius: 50,
    outlineWidth: 3,
    borderColor: '#ffc790',
    backgroundColor: '#000',
    animationSpeed: 4,
    randomness: 0.01,
    borderSpeedMultiplier: 1,
    glowLayers: [
      { colors: ['#ff7500', '#FF8C00', '#FF4500', '#FFD700'], opacity: 0.6, glowSize: [20, 8], speedMultiplier: 1, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#ffd198', '#FFD700', '#ff0000', '#ffd48d'], opacity: 1, glowSize: [6, 12], speedMultiplier: -1.2, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 },
      { colors: ['#ffd198', '#FFD700', '#ff0000', '#ffd48d'], opacity: 0.2, glowSize: [3, 5], speedMultiplier: 0.2, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1, relativeOffset: 0 }
    ],
    states: [
      { name: 'hover', transition: 300, preset: { animationSpeed: 0.8, glowLayers: [{ opacity: 0.7, glowSize: [35, 12] }, { speedMultiplier: 1.5, glowSize: [8, 18] }] } },
      { name: 'press', transition: 100, preset: { animationSpeed: 1.2, glowLayers: [{ opacity: 0.8, glowSize: [40, 15] }, { speedMultiplier: 2, glowSize: [10, 22] }] } }
    ]
  },
} satisfies Record<string, PresetConfig>;

export const glowPresets = presets;
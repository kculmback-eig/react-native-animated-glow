// src/index.ts

// Re-export the types using the `export type` syntax.
// This tells the compiler these are not runtime values.
export type { PresetConfig, AnimatedGlowProps, GlowLayerConfig } from './AnimatedGlow';

// Import and export the component (a runtime value) as the default.
import AnimatedGlow from './AnimatedGlow';
export default AnimatedGlow;
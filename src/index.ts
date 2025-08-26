// src/index.ts

// Re-export all necessary types for consumers.
export type { 
  PresetConfig, 
  AnimatedGlowProps, 
  GlowLayerConfig,
  GlowEvent,
  GlowState,
  GlowPlacement,
} from './animated-glow/types';

// Export the presets object.
export { glowPresets } from './glow-presets';

// Import and export the component as the default.
import AnimatedGlow from './AnimatedGlow';
export default AnimatedGlow;
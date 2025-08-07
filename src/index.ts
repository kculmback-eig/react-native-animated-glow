// src/index.ts (Corrected version)

// Re-export the types using the `export type` syntax.
// This tells the compiler these are not runtime values.
export type { PresetConfig, AnimatedGlowWrapperProps } from './AnimatedGlowWrapper';

// Import and export the component (a runtime value) as the default.
import AnimatedGlowWrapper from './AnimatedGlowWrapper';
export default AnimatedGlowWrapper;
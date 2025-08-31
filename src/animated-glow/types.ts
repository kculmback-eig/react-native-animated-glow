// src/animated-glow/types.ts

import { StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

// --- Core Type Definitions ---
export type GlowPlacement = 'inside' | 'over' | 'behind';

// --- NEW: Metadata Type Definition ---
export interface PresetMetadata {
  name: string;
  textColor: string;
  textFont?: string;
  textSize?: number;
  category: string;
  tags: string[];
}

// --- NEW: GlowConfig to hold all visual properties ---
export interface GlowConfig {
  textColor?: string;
  cornerRadius?: number;
  outlineWidth?: number;
  borderColor?: string | string[];
  backgroundColor?: string;
  animationSpeed?: number;
  borderSpeedMultiplier?: number;
  glowLayers?: Partial<GlowLayerConfig>[];
}

// --- NEW: State Management Types (Updated Structure) ---
export type GlowEvent = 'default' | 'hover' | 'press';

export interface GlowState {
  name: GlowEvent;
  // For 'default', preset is a complete GlowConfig. For others, it's a partial override.
  preset: Partial<GlowConfig>;
  transition?: number; // Duration in ms, only for non-default states
}

// --- NEW: Top-level PresetConfig Structure ---
export interface PresetConfig {
  metadata: PresetMetadata;
  states: GlowState[]; // Must contain at least one 'default' state
}


// --- Configuration Types (Updated) ---
export interface GlowLayerConfig {
  colors: string[];
  opacity: number;
  glowSize: number | number[];
  speedMultiplier: number;
  glowPlacement: GlowPlacement;
  coverage: number;
  relativeOffset?: number;
}

// --- Prop Types ---
// AnimatedGlowProps can accept a legacy preset or individual override props
export interface AnimatedGlowProps extends Partial<GlowConfig> {
  preset?: Partial<PresetConfig> & Partial<GlowConfig>; // Allow legacy and new preset shapes
  states?: GlowState[];
  initialState?: GlowEvent;
  children: ReactNode; // This is the required child prop
  style?: StyleProp<ViewStyle>;
  isVisible?: boolean;
}

// --- Utility Types ---
export type Layout = { width: number; height: number };
export type RGBColor = { r: number; g: number; b: number };
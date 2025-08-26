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

// --- NEW: State Management Types ---
export type GlowEvent = 'default' | 'hover' | 'press';

export interface GlowState {
  name: GlowEvent;
  preset: Partial<PresetConfig>;
  transition?: number; // Duration in ms
}

// --- Configuration Types (Updated) ---
export interface GlowLayerConfig {
  colors: string[];
  opacity: number;
  glowSize: number | number[];
  speedMultiplier: number;
  scaleAmplitude: number;
  scaleFrequency: number;
  glowPlacement: GlowPlacement;
  coverage: number;
  relativeOffset?: number;
}

export interface PresetConfig {
  metadata?: PresetMetadata;
  textColor?: string;
  cornerRadius?: number;
  outlineWidth?: number;
  borderColor?: string | string[];
  backgroundColor?: string;
  animationSpeed?: number;
  randomness?: number;
  borderSpeedMultiplier?: number;
  glowLayers?: Partial<GlowLayerConfig>[];
  states?: GlowState[];
}

// --- Prop Types ---
export interface AnimatedGlowProps extends Partial<Omit<PresetConfig, 'metadata' | 'textColor'>> {
  preset?: PresetConfig;
  states?: GlowState[];
  initialState?: GlowEvent;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  isVisible?: boolean;
}

// --- Utility Types ---
export type Layout = { width: number; height: number };
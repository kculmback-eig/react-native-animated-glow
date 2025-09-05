import { StyleProp, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

export type GlowPlacement = 'inside' | 'over' | 'behind';

export interface PresetMetadata {
  name: string;
  textColor: string;
  textFont?: string;
  textSize?: number;
  category: string;
  tags: string[];
}

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

export type GlowEvent = 'default' | 'hover' | 'press';

export interface GlowState {
  name: GlowEvent;
  preset: Partial<GlowConfig>;
  transition?: number;
}

export interface PresetConfig {
  metadata?: PresetMetadata;
  states: GlowState[];
}

export interface GlowLayerConfig {
  colors: string[];
  opacity: number;
  glowSize: number | number[];
  speedMultiplier: number;
  glowPlacement: GlowPlacement;
  coverage: number;
  relativeOffset?: number;
}

export interface AnimatedGlowProps extends Partial<GlowConfig> {
  preset?: Partial<PresetConfig> & Partial<GlowConfig>;
  states?: GlowState[];
  initialState?: GlowEvent;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  isVisible?: boolean;
  activeState?: GlowEvent;
}

export type Layout = { width: number; height: number };
export type RGBColor = { r: number; g: number; b: number };
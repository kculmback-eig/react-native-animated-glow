import React, {
  useState,
  useEffect,
  useMemo,
  memo,
  FC,
  ReactNode,
} from 'react';
import {
  View,
  StyleSheet,
  LayoutChangeEvent,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop, LinearGradient } from 'react-native-svg';
import Animated, {
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  SharedValue,
  useAnimatedProps,
} from 'react-native-reanimated';

export type GlowLayerConfig = {
  colors: string[];
  opacity: number;
  dotSize: number | number[];
  numberOfOrbs: number;
  inset: number;
  speedMultiplier: number;
  scaleAmplitude: number;
  scaleFrequency: number;
  glowPlacement: 'inside' | 'over' | 'behind';
  coverage: number;
};

export type PresetConfig = {
  cornerRadius?: number;
  outlineWidth?: number;
  borderColor?: string | string[];
  backgroundColor?: string;
  animationSpeed?: number;
  randomness?: number;
  borderSpeedMultiplier?: number;
  glowLayers?: Partial<GlowLayerConfig>[];
  outerGlowColors?: string[];
  outerGlowOpacity?: number;
  outerGlowDotSize?: number | number[];
  outerGlowNumberOfOrbs?: number;
  outerGlowInset?: number;
  outerGlowSpeedMultiplier?: number;
  outerGlowScaleAmplitude?: number;
  outerGlowScaleFrequency?: number;
  innerGlowColors?: string[];
  innerGlowOpacity?: number;
  innerGlowDotSize?: number | number[];
  innerGlowNumberOfOrbs?: number;
  innerGlowInset?: number;
  innerGlowSpeedMultiplier?: number;
  innerGlowScaleAmplitude?: number;
  innerGlowScaleFrequency?: number;
};

export interface AnimatedGlowProps extends PresetConfig {
  preset?: PresetConfig;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

// --- Internal Types ---
type RGBColor = { r: number; g: number; b: number };
type Point = { x: number; y: number };
type Layout = { width: number; height: number };
type DotLayout = Layout & { count: number };
interface GlowDotProps { color: string; size: number; index: number; }
interface AnimatedGlowDotProps { progress: SharedValue<number>; scaleProgress: SharedValue<number>; color: string; dotSize: number; layout: DotLayout | null; index: number; randomOffset: number; scaleAmplitude: number; scaleFrequency: number; inset: number; cornerRadius: number; coverage: number; effectiveSpeed: number; }

// --- Helper Functions ---
const parseColorToRgb = (color: string): RGBColor | null => {
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbaMatch) return { r: parseInt(rgbaMatch[1], 10), g: parseInt(rgbaMatch[2], 10), b: parseInt(rgbaMatch[3], 10) };
  let hex = color.startsWith('#') ? color.substring(1) : color;
  if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
  if (hex.length === 6) { const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); if (result) return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }; }
  return null;
};
const rgbToHex = (r: number, g: number, b: number): string => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const rgb1 = parseColorToRgb(color1); const rgb2 = parseColorToRgb(color2); if (!rgb1 || !rgb2) return color1; const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r)); const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g)); const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b)); return rgbToHex(r, g, b);
};
const getGradientColor = (progress: number, colors: string[]): string => {
  if (!colors || colors.length === 0) return 'transparent'; if (colors.length === 1) return colors[0]; const fullColorList = [...colors, colors[0]]; const segLen = 1 / (fullColorList.length - 1); const segIdx = Math.min(Math.floor(progress / segLen), fullColorList.length - 2); const segProg = (progress - segIdx * segLen) / segLen; return interpolateColor(fullColorList[segIdx], fullColorList[segIdx + 1], segProg);
};
const getGradientSize = (progress: number, sizes: number[]): number => {
    if (!sizes || sizes.length === 0) return 0; if (sizes.length === 1) return sizes[0]; const fullSizeList = [...sizes, sizes[0]]; const segLen = 1 / (fullSizeList.length - 1); const segIdx = Math.min(Math.floor(progress / segLen), fullSizeList.length - 2); const segProg = (progress - segIdx * segLen) / segLen; const s1 = fullSizeList[segIdx]; const s2 = fullSizeList[segIdx + 1]; return s1 + segProg * (s2 - s1);
};


// --- Internal Components ---
const GlowDot: FC<GlowDotProps> = memo(({ color, size, index }) => {
  const id = `grad-${color.replace(/[^a-zA-Z0-9]/g, '')}-${index}`;
  return (<Svg height={size} width={size}><Defs><RadialGradient id={id} cx="50%" cy="50%" rx="50%" ry="50%"><Stop offset="0%" stopColor={color} stopOpacity="1" /><Stop offset="100%" stopColor={color} stopOpacity="0" /></RadialGradient></Defs><Rect x="0" y="0" width={size} height={size} fill={`url(#${id})`} /></Svg>);
});

const AnimatedGlowDot: FC<AnimatedGlowDotProps> = ({ progress, scaleProgress, color, dotSize, layout, index, randomOffset, scaleAmplitude, scaleFrequency, inset, cornerRadius, coverage, effectiveSpeed }) => {
  const animatedStyle = useAnimatedStyle(() => {
    if (!layout || layout.width <= 0 || layout.height <= 0 || layout.count === 0) return { transform: [{ translateX: -9999 }, { translateY: -9999 }] };
    const orbStartPoint = (index / layout.count) * coverage; let currentPosProgress;
    if (effectiveSpeed < 0) { currentPosProgress = (orbStartPoint - progress.value) % 1; if (currentPosProgress < 0) currentPosProgress += 1; } else { currentPosProgress = (orbStartPoint + progress.value) % 1; }
    currentPosProgress = (currentPosProgress + randomOffset) % 1;
    const currentScaleProgress = (scaleProgress.value + index / layout.count) % 1;
    const w = layout.width - inset * 2;
    const h = layout.height - inset * 2;
    const halfDot = dotSize / 2;
    const maxRadius = Math.min(w / 2, h / 2);
    const r = Math.max(0, Math.min(cornerRadius - inset, maxRadius))*1.1; 
    let pt: Point;
    if (r <= 0) { const p = 2 * (w + h); if (p === 0) pt = { x: inset, y: inset }; else { let d = currentPosProgress * p; if (d <= w) pt = { x: inset + d, y: inset }; else { d -= w; if (d <= h) pt = { x: inset + w, y: inset + d }; else { d -= h; if (d <= w) pt = { x: inset + w - d, y: inset + h }; else { d -= w; pt = { x: inset, y: inset + h - d }; }}}}}
    else { const sW = w - 2 * r; const sH = h - 2 * r; const aL = (Math.PI * r) / 2; const p = 2 * (sW + sH) + 4 * aL; let d = currentPosProgress * p; const getP = (t: number, p0: Point, p1: Point, p2: Point): Point => { 'worklet'; const o = 1 - t; return { x: o * o * p0.x + 2 * o * t * p1.x + t * t * p2.x, y: o * o * p0.y + 2 * o * t * p1.y + t * t * p2.y }; }; if (d <= sW) pt = { x: inset + r + d, y: inset }; else if (d <= sW + aL) pt = getP((d - sW) / aL, { x: inset + w - r, y: inset }, { x: inset + w, y: inset }, { x: inset + w, y: inset + r }); else if (d <= sW + aL + sH) pt = { x: inset + w, y: inset + r + (d - sW - aL) }; else if (d <= sW + aL + sH + aL) pt = getP((d - sW - aL - sH) / aL, { x: inset + w, y: inset + h - r }, { x: inset + w, y: inset + h }, { x: inset + w - r, y: inset + h }); else if (d <= sW + aL + sH + aL + sW) pt = { x: inset + w - r - (d - sW - aL - sH - aL), y: inset + h }; else if (d <= sW + aL + sH + aL + sW + aL) pt = getP((d - sW - aL - sH - aL - sW) / aL, { x: inset + r, y: inset + h }, { x: inset, y: inset + h }, { x: inset, y: inset + h - r }); else if (d <= sW + aL + sH + aL + sW + aL + sH) pt = { x: inset, y: inset + h - r - (d - sW - aL - sH - aL - sW - aL) }; else pt = getP((d - sW - aL - sH - aL - sW - aL - sH) / aL, { x: inset, y: inset + r }, { x: inset, y: inset }, { x: inset + r, y: inset });}
    const scale = 1 + scaleAmplitude * Math.sin(currentScaleProgress * 2 * Math.PI * scaleFrequency);
    return { transform: [{ translateX: pt.x - halfDot }, { translateY: pt.y - halfDot }, { scale }] };
  });
  return (<Animated.View style={[styles.glowDot, animatedStyle]}><GlowDot color={color} size={dotSize} index={index} /></Animated.View>);
};

const GlowLayer: FC<{ layerConfig: GlowLayerConfig; layout: Layout; baseAnimationSpeed: number; randomness: number; cornerRadius: number; }> = ({ layerConfig, layout, baseAnimationSpeed, randomness, cornerRadius }) => {
  const { numberOfOrbs, colors, dotSize, speedMultiplier, coverage, ...rest } = layerConfig;
  const effectiveSpeed = baseAnimationSpeed * speedMultiplier;
  const randomOffsets = useMemo(() => Array.from({ length: numberOfOrbs }, () => (Math.random() - 0.5) * randomness), [numberOfOrbs, randomness]);
  const glowColors = useMemo(() => Array.from({ length: numberOfOrbs }, (_, i) => getGradientColor(i / numberOfOrbs, colors)), [colors, numberOfOrbs]);
  const glowSizes = useMemo(() => { const sizes = Array.isArray(dotSize) ? dotSize : [dotSize]; return Array.from({ length: numberOfOrbs }, (_, i) => getGradientSize(i / numberOfOrbs, sizes)); }, [dotSize, numberOfOrbs]);
  const posProgress = useSharedValue(0); const scaleProgress = useSharedValue(0);
  useEffect(() => {
    const duration = effectiveSpeed === 0 ? Infinity : (1 / Math.abs(effectiveSpeed)) * 3000;
    if (duration !== Infinity) { posProgress.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1); scaleProgress.value = withRepeat(withTiming(1, { duration: duration / 2, easing: Easing.linear }), -1); }
  }, [effectiveSpeed]);
  if (numberOfOrbs <= 0) return null;
  return (<View style={[styles.glowContainer, { opacity: rest.opacity }]} pointerEvents="none">{glowColors.map((color, index) => (<AnimatedGlowDot key={index} color={color} progress={posProgress} scaleProgress={scaleProgress} dotSize={glowSizes[index]} layout={{ ...layout, count: glowColors.length }} index={index} scaleAmplitude={rest.scaleAmplitude} scaleFrequency={rest.scaleFrequency} randomOffset={randomOffsets[index]} inset={rest.inset} cornerRadius={cornerRadius} coverage={coverage} effectiveSpeed={effectiveSpeed} />))}</View>);
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedGlow: FC<AnimatedGlowProps> = (props) => {
  const { preset: presetObject = {}, children, style, ...overrideProps } = props;
  const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
  const finalProps = useMemo(() => ({ ...presetObject, ...overrideProps }), [presetObject, overrideProps]);
  const { cornerRadius = 10, outlineWidth = 2, borderColor = 'white', backgroundColor = 'transparent', animationSpeed = 0.7, randomness = 0.01, borderSpeedMultiplier = 1.0, glowLayers: rawGlowLayers, ...legacyProps } = finalProps;

  const glowLayers = useMemo((): GlowLayerConfig[] => {
    const layerDefaults: Omit<GlowLayerConfig, 'colors'> = { opacity: 0.5, dotSize: 75, numberOfOrbs: 20, inset: 15, speedMultiplier: 1.0, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1.0 };
    if (rawGlowLayers) return rawGlowLayers.map(layer => ({ ...layerDefaults, ...layer, colors: layer.colors || [] }));
    const layers: GlowLayerConfig[] = [];
    if (legacyProps.outerGlowNumberOfOrbs && legacyProps.outerGlowNumberOfOrbs > 0) layers.push({ ...layerDefaults, colors: legacyProps.outerGlowColors || [], opacity: legacyProps.outerGlowOpacity ?? 0.15, dotSize: legacyProps.outerGlowDotSize ?? 100, numberOfOrbs: legacyProps.outerGlowNumberOfOrbs, inset: legacyProps.outerGlowInset ?? 15, speedMultiplier: legacyProps.outerGlowSpeedMultiplier ?? 1.0, scaleAmplitude: legacyProps.outerGlowScaleAmplitude ?? 0, scaleFrequency: legacyProps.outerGlowScaleFrequency ?? 2.5, glowPlacement: 'behind' });
    if (legacyProps.innerGlowNumberOfOrbs && legacyProps.innerGlowNumberOfOrbs > 0) layers.push({ ...layerDefaults, colors: legacyProps.innerGlowColors || [], opacity: legacyProps.innerGlowOpacity ?? 0.3, dotSize: legacyProps.innerGlowDotSize ?? 50, numberOfOrbs: legacyProps.innerGlowNumberOfOrbs, inset: legacyProps.innerGlowInset ?? 15, speedMultiplier: legacyProps.innerGlowSpeedMultiplier ?? 1.0, scaleAmplitude: legacyProps.innerGlowScaleAmplitude ?? 0, scaleFrequency: legacyProps.innerGlowScaleFrequency ?? 2.5, glowPlacement: 'behind' });
    return layers;
  }, [rawGlowLayers, legacyProps]);

  const behindLayers = useMemo(() => glowLayers.filter(l => l.glowPlacement === 'behind'), [glowLayers]);
  const insideLayers = useMemo(() => glowLayers.filter(l => l.glowPlacement === 'inside'), [glowLayers]);
  const overLayers = useMemo(() => glowLayers.filter(l => l.glowPlacement === 'over'), [glowLayers]);
  
  const borderProgress = useSharedValue(0);
  useEffect(() => {
    const effectiveSpeed = animationSpeed * borderSpeedMultiplier;
    const duration = effectiveSpeed === 0 ? Infinity : (1 / Math.abs(effectiveSpeed)) * 5000;
    if (duration !== Infinity) {
      borderProgress.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1);
    }
  }, [animationSpeed, borderSpeedMultiplier]);

  const animatedGradientProps = useAnimatedProps(() => {
    const angle = borderProgress.value * 2 * Math.PI;
    const x1 = `${50 + 50 * Math.cos(angle)}%`;
    const y1 = `${50 + 50 * Math.sin(angle)}%`;
    const x2 = `${50 + 50 * Math.cos(angle + Math.PI)}%`;
    const y2 = `${50 + 50 * Math.sin(angle + Math.PI)}%`;
    return { x1, y1, x2, y2 };
  });

  const renderLayers = (layers: GlowLayerConfig[]) => {
    if (layout.width === 0 || layout.height === 0) return null;
    return layers.map((layer, index) => <GlowLayer key={index} layerConfig={layer} layout={layout} baseAnimationSpeed={animationSpeed} randomness={randomness} cornerRadius={cornerRadius} />);
  };

  const renderGradientBorder = () => {
    if (!Array.isArray(borderColor) || borderColor.length < 2 || outlineWidth <= 0 || layout.width === 0) return null;
    const gradientId = 'border-gradient';
    const seamlessColors = [...borderColor, borderColor[0]];
    const effectiveRadius = Math.max(0, cornerRadius - outlineWidth / 2);
    return (
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <AnimatedLinearGradient id={gradientId} animatedProps={animatedGradientProps}>
            {seamlessColors.map((color, index) => (
              <Stop key={index} offset={`${(index / (seamlessColors.length - 1)) * 100}%`} stopColor={color} />
            ))}
          </AnimatedLinearGradient>
        </Defs>
        <Rect x={outlineWidth / 2} y={outlineWidth / 2} width={layout.width - outlineWidth} height={layout.height - outlineWidth} rx={effectiveRadius} ry={effectiveRadius} fill="transparent" stroke={`url(#${gradientId})`} strokeWidth={outlineWidth}/>
      </Svg>
    );
  };
  
  const isGradientBorder = Array.isArray(borderColor) && borderColor.length > 1;

  return (
    <View style={style} onLayout={(e: LayoutChangeEvent) => setLayout(e.nativeEvent.layout)}>
      {renderLayers(behindLayers)}
      {isGradientBorder && renderGradientBorder()}
      <View style={{
        backgroundColor,
        borderWidth: outlineWidth,
        borderColor: isGradientBorder ? 'transparent' : (Array.isArray(borderColor) ? borderColor[0] : borderColor),
        borderRadius: cornerRadius,
        overflow: 'hidden'
      }}>
        {children}
        {renderLayers(insideLayers)}
      </View>
      {renderLayers(overLayers)}
    </View>
  );
};

const styles = StyleSheet.create({
  glowContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  glowDot: { position: 'absolute', top: 0, left: 0 },
});

export default AnimatedGlow;
import React, { useState, useEffect, useMemo, memo, FC, ReactNode } from 'react';
import { View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Defs, Rect, Stop, LinearGradient } from 'react-native-svg';
import Animated, {
    Easing,
    useSharedValue,
    withRepeat,
    withTiming,
    useAnimatedStyle,
    SharedValue,
    useAnimatedProps,
    cancelAnimation,
} from 'react-native-reanimated';

const glowOrbAsset = require('../assets/glow-orb.png');

export type GlowLayerConfig = {
    colors: string[];
    opacity: number;
    dotSize: number | number[];
    stretch: number;
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
    isVisible?: boolean;
}

type RGBColor = { r: number; g: number; b: number };
type Point = { x: number; y: number };
type PathData = { point: Point; rotation: number };
type Layout = { width: number; height: number };
type DotLayout = Layout & { count: number };
interface GlowDotProps { color: string; width: number; height: number; }
interface AnimatedGlowDotProps { progress: SharedValue<number>; scaleProgress: SharedValue<number>; color: string; dotSize: number; stretch: number; layout: DotLayout | null; index: number; randomOffset: number; scaleAmplitude: number; scaleFrequency: number; inset: number; cornerRadius: number; coverage: number; effectiveSpeed: number; }

const parseColorToRgb = (color: string): RGBColor | null => {
    const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (rgbaMatch) return { r: parseInt(rgbaMatch[1], 10), g: parseInt(rgbaMatch[2], 10), b: parseInt(rgbaMatch[3], 10) };
    let hex = color.startsWith('#') ? color.substring(1) : color;
    if (hex.length === 3) hex = hex.split('').map(char => char + char).join('');
    if (hex.length === 6) { const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); if (result) return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }; }
    return null;
};
const rgbToHex = (r: number, g: number, b: number): string => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).padStart(6, '0');
const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const rgb1 = parseColorToRgb(color1); const rgb2 = parseColorToRgb(color2); if (!rgb1 || !rgb2) return color1; const r = Math.round(rgb1.r + factor * (rgb2.r - rgb1.r)); const g = Math.round(rgb1.g + factor * (rgb2.g - rgb1.g)); const b = Math.round(rgb1.b + factor * (rgb2.b - rgb1.b)); return rgbToHex(r, g, b);
};
const getGradientColor = (progress: number, colors: string[]): string => {
    if (!colors || colors.length === 0) return 'transparent'; if (colors.length === 1) return colors[0]; const fullColorList = [...colors, colors[0]]; const segLen = 1 / (fullColorList.length - 1); const segIdx = Math.min(Math.floor(progress / segLen), fullColorList.length - 2); const segProg = (progress - segIdx * segLen) / segLen; return interpolateColor(fullColorList[segIdx], fullColorList[segIdx + 1], segProg);
};
const getGradientSize = (progress: number, sizes: number[]): number => {
    if (!sizes || sizes.length === 0) return 0; if (sizes.length === 1) return sizes[0]; const fullSizeList = [...sizes, sizes[0]]; const segLen = 1 / (fullSizeList.length - 1); const segIdx = Math.min(Math.floor(progress / segLen), fullSizeList.length - 2); const segProg = (progress - segIdx * segLen) / segLen; const s1 = fullSizeList[segIdx]; const s2 = fullSizeList[segIdx + 1]; return s1 + segProg * (s2 - s1);
};

const getPathData = (progress: number, layoutWidth: number, layoutHeight: number, cornerRadius: number, inset: number): PathData => {
    'worklet';
    if (layoutWidth <= 0 || layoutHeight <= 0) return { point: { x: -9999, y: -9999 }, rotation: 0 };
    const w = layoutWidth - inset * 2;
    const h = layoutHeight - inset * 2;
    const maxRadius = Math.min(w / 2, h / 2);
    const r = Math.max(0, Math.min(cornerRadius - inset, maxRadius));
    let pt: Point;
    let rotation = 0;
    const getP = (t: number, p0: Point, p1: Point, p2: Point): Point => {
        'worklet';
        const o = 1 - t;
        return { x: o * o * p0.x + 2 * o * t * p1.x + t * t * p2.x, y: o * o * p0.y + 2 * o * t * p1.y + t * t * p2.y };
    };
    const getTangentAngle = (t: number, p0: Point, p1: Point, p2: Point): number => {
        'worklet';
        const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
        const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
        return Math.atan2(dy, dx);
    };
    if (r <= 0) {
        const p = 2 * (w + h);
        if (p === 0) pt = { x: inset, y: inset };
        else {
            let d = progress * p;
            if (d <= w) { pt = { x: inset + d, y: inset }; rotation = 0; }
            else { d -= w; if (d <= h) { pt = { x: inset + w, y: inset + d }; rotation = Math.PI / 2; }
            else { d -= h; if (d <= w) { pt = { x: inset + w - d, y: inset + h }; rotation = Math.PI; }
            else { d -= w; pt = { x: inset, y: inset + h - d }; rotation = 1.5 * Math.PI; } } }
        }
    } else {
        const sW = w - 2 * r; const sH = h - 2 * r;
        const aL = (Math.PI * r) / 2;
        const p = 2 * (sW + sH) + 4 * aL;
        let d = progress * p;
        const p_tr = { x: inset + w - r, y: inset }; const p_trc = { x: inset + w, y: inset }; const p_br = { x: inset + w, y: inset + r };
        const p_bl = { x: inset + w, y: inset + h - r }; const p_blc = { x: inset + w, y: inset + h }; const p_tl = { x: inset + w - r, y: inset + h };
        const p_tl_b = { x: inset + r, y: inset + h }; const p_tlc_b = { x: inset, y: inset + h }; const p_tr_b = { x: inset, y: inset + h - r };
        const p_tr_l = { x: inset, y: inset + r }; const p_tlc_l = { x: inset, y: inset }; const p_bl_l = { x: inset + r, y: inset };
        if (d <= sW) { pt = { x: inset + r + d, y: inset }; rotation = 0; }
        else if (d <= sW + aL) { const t = (d - sW) / aL; pt = getP(t, p_tr, p_trc, p_br); rotation = getTangentAngle(t, p_tr, p_trc, p_br); }
        else if (d <= sW + aL + sH) { pt = { x: inset + w, y: inset + r + (d - sW - aL) }; rotation = Math.PI / 2; }
        else if (d <= sW + aL + sH + aL) { const t = (d - sW - aL - sH) / aL; pt = getP(t, p_bl, p_blc, p_tl); rotation = getTangentAngle(t, p_bl, p_blc, p_tl); }
        else if (d <= sW + aL + sH + aL + sW) { pt = { x: inset + w - r - (d - sW - aL - sH - aL), y: inset + h }; rotation = Math.PI; }
        else if (d <= sW + aL + sH + aL + sW + aL) { const t = (d - sW - aL - sH - aL - sW) / aL; pt = getP(t, p_tl_b, p_tlc_b, p_tr_b); rotation = getTangentAngle(t, p_tl_b, p_tlc_b, p_tr_b); }
        else if (d <= sW + aL + sH + aL + sW + aL + sH) { pt = { x: inset, y: inset + h - r - (d - sW - aL - sH - aL - sW - aL) }; rotation = 1.5 * Math.PI; }
        else { const t = (d - sW - aL - sH - aL - sW - aL - sH) / aL; pt = getP(t, p_tr_l, p_tlc_l, p_bl_l); rotation = getTangentAngle(t, p_tr_l, p_tlc_l, p_bl_l); }
    }
    return { point: pt, rotation };
};

const GlowDot: FC<GlowDotProps> = memo(({ color, width, height }) => {
    return (<Image source={glowOrbAsset} tintColor={color} style={{ width, height }} cachePolicy="memory" contentFit="fill" />);
});

const AnimatedGlowDot: FC<AnimatedGlowDotProps> = ({ progress, scaleProgress, color, dotSize, stretch, layout, index, randomOffset, scaleAmplitude, scaleFrequency, inset, cornerRadius, coverage, effectiveSpeed }) => {
    const animatedStyle = useAnimatedStyle(() => {
        if (!layout || layout.width <= 0 || layout.height <= 0 || layout.count === 0) {
            return { transform: [{ translateX: -9999 }, { translateY: -9999 }] };
        }
        const orbStartPoint = (index / layout.count) * coverage;
        let currentPosProgress;
        if (effectiveSpeed < 0) {
            currentPosProgress = (orbStartPoint - progress.value) % 1;
            if (currentPosProgress < 0) currentPosProgress += 1;
        } else {
            currentPosProgress = (orbStartPoint + progress.value) % 1;
        }
        currentPosProgress = (currentPosProgress + randomOffset) % 1;
        const currentScaleProgress = (scaleProgress.value + index / layout.count) % 1;
        
        const { point: pt, rotation } = getPathData(currentPosProgress, layout.width, layout.height, cornerRadius, inset);

        const orbHeight = dotSize;
        const orbWidth = dotSize * stretch;
        const halfH = orbHeight / 2;
        const halfW = orbWidth / 2;
        const scale = 1 + scaleAmplitude * Math.sin(currentScaleProgress * 2 * Math.PI * scaleFrequency);

        return {
            width: orbWidth,
            height: orbHeight,
            transform: [
                { translateX: pt.x - halfW },
                { translateY: pt.y - halfH },
                { rotate: `${rotation}rad` },
                { scale }
            ]
        };
    });
    
    const orbWidth = dotSize * stretch;

    return (<Animated.View style={[styles.glowDot, animatedStyle]}><GlowDot color={color} width={orbWidth} height={dotSize} /></Animated.View>);
};

const GlowLayer: FC<{ layerConfig: GlowLayerConfig; layout: Layout; baseAnimationSpeed: number; randomness: number; cornerRadius: number; isVisible: boolean; }> = ({ layerConfig, layout, baseAnimationSpeed, randomness, cornerRadius, isVisible }) => {
    const { numberOfOrbs, colors, dotSize, stretch, speedMultiplier, coverage, ...rest } = layerConfig;
    const effectiveSpeed = baseAnimationSpeed * speedMultiplier;
    const randomOffsets = useMemo(() => Array.from({ length: numberOfOrbs }, () => (Math.random() - 0.5) * randomness), [numberOfOrbs, randomness]);
    const glowColors = useMemo(() => Array.from({ length: numberOfOrbs }, (_, i) => getGradientColor(i / numberOfOrbs, colors)), [colors, numberOfOrbs]);
    const glowSizes = useMemo(() => { const sizes = Array.isArray(dotSize) ? dotSize : [dotSize]; return Array.from({ length: numberOfOrbs }, (_, i) => getGradientSize(i / numberOfOrbs, sizes)); }, [dotSize, numberOfOrbs]);
    const posProgress = useSharedValue(0);
    const scaleProgress = useSharedValue(0);
    useEffect(() => {
        const duration = effectiveSpeed === 0 ? Infinity : (1 / Math.abs(effectiveSpeed)) * 3000;
        if (isVisible && duration !== Infinity) {
            posProgress.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1);
            scaleProgress.value = withRepeat(withTiming(1, { duration: duration / 2, easing: Easing.linear }), -1);
        } else {
            cancelAnimation(posProgress);
            cancelAnimation(scaleProgress);
            posProgress.value = 0;
            scaleProgress.value = 0;
        }
        return () => { cancelAnimation(posProgress); cancelAnimation(scaleProgress); };
    }, [effectiveSpeed, isVisible, posProgress, scaleProgress]);
    if (numberOfOrbs <= 0) return null;
    return (<View style={[styles.glowContainer, { opacity: rest.opacity }]} pointerEvents="none">{glowColors.map((color, index) => (<AnimatedGlowDot key={index} color={color} progress={posProgress} scaleProgress={scaleProgress} dotSize={glowSizes[index]} stretch={stretch} layout={{ ...layout, count: glowColors.length }} index={index} scaleAmplitude={rest.scaleAmplitude} scaleFrequency={rest.scaleFrequency} randomOffset={randomOffsets[index]} inset={rest.inset} cornerRadius={cornerRadius} coverage={coverage} effectiveSpeed={effectiveSpeed} />))}</View>);
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const AnimatedGlow: FC<AnimatedGlowProps> = (props) => {
    const { preset: presetObject = {}, children, style, isVisible = true, ...overrideProps } = props;
    const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
    const layoutW = useSharedValue(0);
    const layoutH = useSharedValue(0);
    const finalProps = useMemo(() => ({ ...presetObject, ...overrideProps }), [presetObject, overrideProps]);
    const { cornerRadius = 10, outlineWidth = 2, borderColor = 'white', backgroundColor = 'transparent', animationSpeed = 0.7, randomness = 0.01, borderSpeedMultiplier = 1.0, glowLayers: rawGlowLayers, ...legacyProps } = finalProps;

    const glowLayers = useMemo((): GlowLayerConfig[] => {
        const layerDefaults: Omit<GlowLayerConfig, 'colors'> = { opacity: 0.5, dotSize: 75, stretch: 1.0, numberOfOrbs: 20, inset: 15, speedMultiplier: 1.0, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1.0 };
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
        if (isVisible && duration !== Infinity) {
            borderProgress.value = withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1);
        } else {
            cancelAnimation(borderProgress);
            borderProgress.value = 0;
        }
        return () => { cancelAnimation(borderProgress); };
    }, [animationSpeed, borderSpeedMultiplier, isVisible]);

    const animatedGradientProps = useAnimatedProps(() => {
        'worklet';
        const w = layoutW.value;
        const h = layoutH.value;
        if (w === 0 || h === 0) return { x1: '0', y1: '0', x2: '0', y2: '0' };
        
        const progress1 = borderProgress.value;
        const progress2 = (borderProgress.value + 0.5) % 1;
        const inset = outlineWidth / 2;

        const MAX_ALLOWED_WARP = 1 / (4 * Math.PI); // approx 0.079
        const aspectRatio = w > h ? w / h : h / w;
        const desiredIntensity = Math.abs(1 - aspectRatio) * 0.1;
        const warpAmount = Math.min(MAX_ALLOWED_WARP, desiredIntensity);

        const getEasedProgress = (p: number) => {
            if (w === h) return p;
            const sign = w > h ? 1 : -1;
            return p + sign * warpAmount * Math.sin(p * 4 * Math.PI);
        }

        const easedProgress1 = getEasedProgress(progress1);
        const easedProgress2 = getEasedProgress(progress2);

        const p1 = getPathData(easedProgress1, w, h, cornerRadius, inset).point;
        const p2 = getPathData(easedProgress2, w, h, cornerRadius, inset).point;

        return { x1: String(p1.x), y1: String(p1.y), x2: String(p2.x), y2: String(p2.y) };
    });

    const gradientId = useMemo(() => `border-gradient-${Math.random().toString(36).slice(2)}`, []);

    const renderLayers = (layers: GlowLayerConfig[]) => {
        if (layout.width === 0 || layout.height === 0) return null;
        return layers.map((layer, index) => <GlowLayer key={index} layerConfig={layer} layout={layout} baseAnimationSpeed={animationSpeed} randomness={randomness} cornerRadius={cornerRadius} isVisible={isVisible} />);
    };

    const renderGradientBorder = () => {
        if (!Array.isArray(borderColor) || borderColor.length < 2 || outlineWidth <= 0 || layout.width === 0 || layout.height === 0) return null;
        const rectWidth = layout.width - outlineWidth;
        const rectHeight = layout.height - outlineWidth;
        const maxRadius = Math.min(rectWidth / 2, rectHeight / 2);
        const effectiveRadius = Math.max(0, Math.min(cornerRadius - outlineWidth / 2, maxRadius));
        
        return (
            <Svg width={layout.width} height={layout.height} style={StyleSheet.absoluteFill} pointerEvents="none">
                <Defs>
                    <AnimatedLinearGradient id={gradientId} gradientUnits="userSpaceOnUse" animatedProps={animatedGradientProps}>
                        {borderColor.map((color, index) => (<Stop key={index} offset={`${(index / (borderColor.length - 1)) * 100}%`} stopColor={color} />))}
                    </AnimatedLinearGradient>
                </Defs>
                <Rect
                    x={outlineWidth / 2}
                    y={outlineWidth / 2}
                    width={rectWidth}
                    height={rectHeight}
                    rx={effectiveRadius}
                    ry={effectiveRadius}
                    fill="transparent"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={outlineWidth}
                />
            </Svg>
        );
    };

    const isGradientBorder = Array.isArray(borderColor) && borderColor.length > 1;

    return (
        <View
            style={style}
            onLayout={(e: LayoutChangeEvent) => {
                const l = e.nativeEvent.layout;
                setLayout({ width: l.width, height: l.height });
                layoutW.value = l.width;
                layoutH.value = l.height;
            }}
        >
            {renderLayers(behindLayers)}
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
            {isGradientBorder && renderGradientBorder()}
        </View>
    );
};

const styles = StyleSheet.create({
    glowContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
    glowDot: { position: 'absolute', top: 0, left: 0, justifyContent: 'center', alignItems: 'center' },
});

export default AnimatedGlow;
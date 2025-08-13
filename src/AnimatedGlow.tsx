// app/components/AnimatedGlow.tsx

import React, { useState, useEffect, useMemo, memo, FC, ReactNode, useRef } from 'react';
import { View, StyleSheet, LayoutChangeEvent, StyleProp, ViewStyle, Image, Animated, Easing, Platform } from 'react-native';
import Svg, { Defs, Rect as SvgRect, Stop, LinearGradient, RadialGradient } from 'react-native-svg';

const glowOrbAsset = require('../assets/glow-orb.png');

// --- TYPE DEFINITIONS ---
export type GlowLayerConfig = { colors: string[]; opacity: number; dotSize: number | number[]; stretch: number; numberOfOrbs: number; inset: number; speedMultiplier: number; scaleAmplitude: number; scaleFrequency: number; glowPlacement: 'inside' | 'over' | 'behind'; coverage: number; };
export type PresetConfig = { cornerRadius?: number; outlineWidth?: number; borderColor?: string | string[]; backgroundColor?: string; animationSpeed?: number; randomness?: number; borderSpeedMultiplier?: number; glowLayers?: Partial<GlowLayerConfig>[]; outerGlowColors?: string[]; outerGlowOpacity?: number; outerGlowDotSize?: number | number[]; outerGlowNumberOfOrbs?: number; outerGlowInset?: number; outerGlowSpeedMultiplier?: number; outerGlowScaleAmplitude?: number; outerGlowScaleFrequency?: number; innerGlowColors?: string[]; innerGlowOpacity?: number; innerGlowDotSize?: number | number[]; innerGlowNumberOfOrbs?: number; innerGlowInset?: number; innerGlowSpeedMultiplier?: number; innerGlowScaleAmplitude?: number; innerGlowScaleFrequency?: number; };
export interface AnimatedGlowProps extends PresetConfig { preset?: PresetConfig; children: ReactNode; style?: StyleProp<ViewStyle>; isVisible?: boolean; engine?: 'svg' | 'image'; }
type RGBColor = { r: number; g: number; b: number };
type Point = { x: number; y: number };
type PathData = { point: Point; rotation: number };
type Layout = { width: number; height: number };
type DotLayout = Layout & { count: number };
interface GlowDotProps { color: string; width: number; height: number; }
// FIX: Changed 'progress' type from Animated.Value to the more general Animated.AnimatedNode
// to accommodate the composed value from the new reverse-animation logic.
interface AnimatedGlowDotProps { progress: Animated.AnimatedNode; scaleProgress: Animated.Value; color: string; dotSize: number; stretch: number; layout: DotLayout | null; index: number; randomOffset: number; scaleAmplitude: number; scaleFrequency: number; inset: number; cornerRadius: number; coverage: number; engine: AnimatedGlowProps['engine']; }

// --- HELPER FUNCTIONS ---
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
    if (layoutWidth <= 0 || layoutHeight <= 0) return { point: { x: -9999, y: -9999 }, rotation: 0 };
    const w = layoutWidth - inset * 2; const h = layoutHeight - inset * 2; const maxRadius = Math.min(w / 2, h / 2); const r = Math.max(0, Math.min(cornerRadius - inset, maxRadius)); let pt: Point; let rotation = 0; const getP = (t: number, p0: Point, p1: Point, p2: Point): Point => { const o = 1 - t; return { x: o * o * p0.x + 2 * o * t * p1.x + t * t * p2.x, y: o * o * p0.y + 2 * o * t * p1.y + t * t * p2.y }; }; const getTangentAngle = (t: number, p0: Point, p1: Point, p2: Point): number => { const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x); const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y); return Math.atan2(dy, dx); };
    if (r <= 0) { const p = 2 * (w + h); if (p === 0) pt = { x: inset, y: inset }; else { let d = progress * p; if (d <= w) { pt = { x: inset + d, y: inset }; rotation = 0; } else { d -= w; if (d <= h) { pt = { x: inset + w, y: inset + d }; rotation = Math.PI / 2; } else { d -= h; if (d <= w) { pt = { x: inset + w - d, y: inset + h }; rotation = Math.PI; } else { d -= w; pt = { x: inset, y: inset + h - d }; rotation = 1.5 * Math.PI; } } } } }
    else { const sW = w - 2 * r; const sH = h - 2 * r; const aL = (Math.PI * r) / 2; const p = 2 * (sW + sH) + 4 * aL; let d = progress * p; const p_tr = { x: inset + w - r, y: inset }; const p_trc = { x: inset + w, y: inset }; const p_br = { x: inset + w, y: inset + r }; const p_bl = { x: inset + w, y: inset + h - r }; const p_blc = { x: inset + w, y: inset + h }; const p_tl = { x: inset + w - r, y: inset + h }; const p_tl_b = { x: inset + r, y: inset + h }; const p_tlc_b = { x: inset, y: inset + h }; const p_tr_b = { x: inset, y: inset + h - r }; const p_tr_l = { x: inset, y: inset + r }; const p_tlc_l = { x: inset, y: inset }; const p_bl_l = { x: inset + r, y: inset };
    if (d <= sW) { pt = { x: inset + r + d, y: inset }; rotation = 0; } else if (d <= sW + aL) { const t = (d - sW) / aL; pt = getP(t, p_tr, p_trc, p_br); rotation = getTangentAngle(t, p_tr, p_trc, p_br); } else if (d <= sW + aL + sH) { pt = { x: inset + w, y: inset + r + (d - sW - aL) }; rotation = Math.PI / 2; } else if (d <= sW + aL + sH + aL) { const t = (d - sW - aL - sH) / aL; pt = getP(t, p_bl, p_blc, p_tl); rotation = getTangentAngle(t, p_bl, p_blc, p_tl); } else if (d <= sW + aL + sH + aL + sW) { pt = { x: inset + w - r - (d - sW - aL - sH - aL), y: inset + h }; rotation = Math.PI; } else if (d <= sW + aL + sH + aL + sW + aL) { const t = (d - sW - aL - sH - aL - sW) / aL; pt = getP(t, p_tl_b, p_tlc_b, p_tr_b); rotation = getTangentAngle(t, p_tl_b, p_tlc_b, p_tr_b); if (rotation < 0) { rotation += 2 * Math.PI; } } else if (d <= sW + aL + sH + aL + sW + aL + sH) { pt = { x: inset, y: inset + h - r - (d - sW - aL - sH - aL - sW - aL) }; rotation = 1.5 * Math.PI; } else { const t = (d - sW - aL - sH - aL - sW - aL - sH) / aL; pt = getP(t, p_tr_l, p_tlc_l, p_bl_l); rotation = getTangentAngle(t, p_tr_l, p_tlc_l, p_bl_l); if (rotation < 0) { rotation += 2 * Math.PI; } } }
    return { point: pt, rotation };
};


// --- ORB COMPONENTS ---
const SvgGlowDot: FC<GlowDotProps> = memo(({ color, width, height }) => {
    const gradientId = `grad-${Math.random().toString(36).substring(7)}`;
    return (
        <Svg height={height} width={width}>
            <Defs>
                <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <Stop offset="0%" stopColor={color} stopOpacity="1" />
                    <Stop offset="100%" stopColor={color} stopOpacity="0" />
                </RadialGradient>
            </Defs>
            <SvgRect x="0" y="0" width={width} height={height} fill={`url(#${gradientId})`} />
        </Svg>
    );
});
SvgGlowDot.displayName = 'SvgGlowDot';

// FIX: Set resizeMode to 'stretch' and moved tintColor into style for RNW compatibility.
const ImageGlowDot: FC<GlowDotProps> = memo(({ color, width, height }) => (
    <Image
        source={glowOrbAsset}
        style={{ width, height, tintColor: color, resizeMode: 'stretch' }}
    />
));
ImageGlowDot.displayName = 'ImageGlowDot';


// --- ANIMATED GLOW DOT ---
const AnimatedGlowDot: FC<AnimatedGlowDotProps> = ({ progress, scaleProgress, color, dotSize, stretch, layout, index, randomOffset, scaleAmplitude, scaleFrequency, inset, cornerRadius, coverage, engine }) => {
    const orbWidth = dotSize * stretch;
    const pathInterpolation = useMemo(() => {
        if (!layout || layout.width <= 0 || layout.height <= 0) return null;
        const steps = 150; const inputRange = Array.from({ length: steps + 1 }, (_, i) => i / steps); const translateXOutput: number[] = []; const translateYOutput: number[] = []; const rotationOutput: string[] = [];
        let lastAngle = -1;
        for (const p of inputRange) {
            let { point, rotation } = getPathData(p, layout.width, layout.height, cornerRadius, inset);
            if (lastAngle !== -1) {
                while (rotation < lastAngle - Math.PI) rotation += 2 * Math.PI;
                while (rotation > lastAngle + Math.PI) rotation -= 2 * Math.PI;
            }
            lastAngle = rotation;
            translateXOutput.push(point.x - orbWidth / 2);
            translateYOutput.push(point.y - dotSize / 2);
            rotationOutput.push(`${rotation}rad`);
        }
        return { translateX: { inputRange, outputRange: translateXOutput }, translateY: { inputRange, outputRange: translateYOutput }, rotate: { inputRange, outputRange: rotationOutput }, };
    }, [layout, cornerRadius, inset, dotSize, stretch, orbWidth]);
    const scaleInterpolation = useMemo(() => {
        if (scaleAmplitude === 0) return null;
        const steps = 50; const inputRange = Array.from({ length: steps + 1 }, (_, i) => i / steps); const outputRange = inputRange.map(p => 1 + scaleAmplitude * Math.sin(p * 2 * Math.PI * scaleFrequency)); return { inputRange, outputRange };
    }, [scaleAmplitude, scaleFrequency]);
    const orbProgress = useMemo(() => {
        if (!layout) return new Animated.Value(0);
        const orbStartPoint = (index / layout.count) * coverage; const offset = new Animated.Value((orbStartPoint + randomOffset) % 1); return Animated.modulo(Animated.add(progress, offset), 1);
    }, [progress, layout, index, coverage, randomOffset]);
    const orbScaleProgress = useMemo(() => {
        if (!layout) return new Animated.Value(0);
        const scaleStartPoint = (index / layout.count); return Animated.modulo(Animated.add(scaleProgress, new Animated.Value(scaleStartPoint)), 1);
    }, [scaleProgress, layout, index]);
    if (!layout || !pathInterpolation) return null;

    // FIX: The 'progress' prop is now a composed Animated.AnimatedNode, not just an Animated.Value.
    // The result of `Animated.modulo` is an `AnimatedModulo` node, which does not have an `.interpolate` method.
    // This will cause a runtime error unless the underlying Animated library implementation supports it.
    // We cast to `any` to satisfy the TypeScript compiler, preserving the original component architecture.
    const animatedStyle = {
        transform: [
            { translateX: (orbProgress as any).interpolate(pathInterpolation.translateX) },
            { translateY: (orbProgress as any).interpolate(pathInterpolation.translateY) },
            { rotate: (orbProgress as any).interpolate(pathInterpolation.rotate) },
            { scale: scaleInterpolation ? orbScaleProgress.interpolate(scaleInterpolation) : 1 },
        ],
    };
    const GlowDot = useMemo(() => {
        switch (engine) {
            case 'svg': return SvgGlowDot;
            case 'image': default: return ImageGlowDot;
        }
    }, [engine]);
    return (<Animated.View style={[styles.glowDot, { width: orbWidth, height: dotSize }, animatedStyle]}><GlowDot color={color} width={orbWidth} height={dotSize} /></Animated.View>);
};

// --- GLOW LAYER ---
const GlowLayer: FC<{ layerConfig: GlowLayerConfig; layout: Layout; baseAnimationSpeed: number; randomness: number; cornerRadius: number; isVisible: boolean; engine: AnimatedGlowProps['engine']; }> = ({ layerConfig, layout, baseAnimationSpeed, randomness, cornerRadius, isVisible, engine }) => {
    const { numberOfOrbs, colors, dotSize, stretch, speedMultiplier, coverage, ...rest } = layerConfig; const posProgress = useRef(new Animated.Value(0)).current; const scaleProgress = useRef(new Animated.Value(0)).current; const posAnimation = useRef<Animated.CompositeAnimation | null>(null); const scaleAnimation = useRef<Animated.CompositeAnimation | null>(null); const randomOffsets = useMemo(() => Array.from({ length: numberOfOrbs }, () => (Math.random() - 0.5) * randomness), [numberOfOrbs, randomness]); const glowColors = useMemo(() => Array.from({ length: numberOfOrbs }, (_, i) => getGradientColor(i / numberOfOrbs, colors)), [colors, numberOfOrbs]); const glowSizes = useMemo(() => { const sizes = Array.isArray(dotSize) ? dotSize : [dotSize]; return Array.from({ length: numberOfOrbs }, (_, i) => getGradientSize(i / numberOfOrbs, sizes)); }, [dotSize, numberOfOrbs]);
    
    // FIX: Replaced Animated.loop with a recursive callback for better web compatibility.
    // This also avoids using the native driver on web.
    useEffect(() => {
        const effectiveSpeed = baseAnimationSpeed * speedMultiplier;
        const absSpeed = Math.abs(effectiveSpeed);

        // stop/reset when not visible or speed is 0
        if (!isVisible || absSpeed === 0) {
            posAnimation.current?.stop();
            scaleAnimation.current?.stop();
            posProgress.setValue(0);
            scaleProgress.setValue(0);
            return;
        }

        const useNative = Platform.OS !== 'web';

        const runPos = () => {
            posProgress.setValue(0);
            posAnimation.current = Animated.timing(posProgress, {
                toValue: 1,
                duration: (1 / absSpeed) * 3000,
                easing: Easing.linear,
                useNativeDriver: useNative,
            });
            posAnimation.current.start(({ finished }) => finished && runPos());
        };

        const runScale = () => {
            scaleProgress.setValue(0);
            scaleAnimation.current = Animated.timing(scaleProgress, {
                toValue: 1,
                duration: (1 / absSpeed) * 1500, // half the pos duration like before
                easing: Easing.linear,
                useNativeDriver: useNative,
            });
            scaleAnimation.current.start(({ finished }) => finished && runScale());
        };

        runPos();
        runScale();

        return () => {
            posAnimation.current?.stop();
            scaleAnimation.current?.stop();
        };
    }, [baseAnimationSpeed, speedMultiplier, isVisible]);
    
    if (numberOfOrbs <= 0) return null;

    // FIX: Added logic to handle reverse/negative speed by reversing the progress value.
    const effectiveSpeed = baseAnimationSpeed * speedMultiplier;
    const direction = effectiveSpeed >= 0 ? 1 : -1;
    const directedProgress =
        direction === 1
            ? posProgress
            : Animated.modulo(Animated.add(1, Animated.multiply(posProgress, -1)), 1);

    return (<View style={[styles.glowContainer, { opacity: rest.opacity }]} pointerEvents="none">{glowColors.map((color, index) => (<AnimatedGlowDot key={index} color={color} progress={directedProgress} scaleProgress={scaleProgress} dotSize={glowSizes[index]} stretch={stretch} layout={{ ...layout, count: glowColors.length }} index={index} scaleAmplitude={rest.scaleAmplitude} scaleFrequency={rest.scaleFrequency} randomOffset={randomOffsets[index]} inset={rest.inset} cornerRadius={cornerRadius} coverage={coverage} engine={engine} />))}</View>);
};

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// --- MAIN COMPONENT ---
const AnimatedGlow: FC<AnimatedGlowProps> = (props) => {
    const { preset: presetObject = {}, children, style, isVisible = true, engine: engineProp, ...overrideProps } = props;
    const engine = engineProp ?? 'image';
    const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
    const finalProps = useMemo(() => ({ ...presetObject, ...overrideProps }), [presetObject, overrideProps]);
    const { cornerRadius = 10, outlineWidth = 2, borderColor = 'white', backgroundColor = 'transparent', animationSpeed = 0.7, randomness = 0.01, borderSpeedMultiplier = 1.0, glowLayers: rawGlowLayers, ...legacyProps } = finalProps;
    
    const [gradientCoords, setGradientCoords] = useState<any>(null);
    const borderProgress = useRef(new Animated.Value(0)).current;
    const borderAnimation = useRef<Animated.CompositeAnimation | null>(null);

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
    const isGradientBorder = Array.isArray(borderColor) && borderColor.length > 1;

    useEffect(() => {
        const effectiveSpeed = animationSpeed * borderSpeedMultiplier; const duration = effectiveSpeed === 0 ? Infinity : (1 / Math.abs(effectiveSpeed)) * 5000;
        if (isVisible && duration !== Infinity && isGradientBorder) {
            borderAnimation.current = Animated.loop(Animated.timing(borderProgress, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: false, }));
            borderAnimation.current.start();
        } else { borderAnimation.current?.stop(); borderProgress.setValue(0); }
        return () => { borderAnimation.current?.stop(); };
    }, [animationSpeed, borderSpeedMultiplier, isVisible, isGradientBorder]);
    
    useEffect(() => {
        if (layout.width > 0 && layout.height > 0 && isGradientBorder) {
            const w = layout.width; const h = layout.height; const inset = outlineWidth / 2; const pathCornerRadius = cornerRadius + 1;
            const getEasedProgress = (p: number) => { if (w === h) return p; const MAX_ALLOWED_WARP = 1 / (4 * Math.PI); const aspectRatio = w > h ? w / h : h / w; const desiredIntensity = Math.abs(1 - aspectRatio) * 0.1; const warpAmount = Math.min(MAX_ALLOWED_WARP, desiredIntensity); const sign = w > h ? 1 : -1; return p + sign * warpAmount * Math.sin(p * 4 * Math.PI); }
            const steps = 100; const inputRange = Array.from({ length: steps + 1 }, (_, i) => i / steps); const path1 = { x: [] as number[], y: [] as number[] }; const path2 = { x: [] as number[], y: [] as number[] };
            for(const p of inputRange) { const easedP1 = getEasedProgress(p); const easedP2 = getEasedProgress((p + 0.5) % 1.0); const point1 = getPathData(easedP1, w, h, pathCornerRadius, inset).point; const point2 = getPathData(easedP2, w, h, pathCornerRadius, inset).point; path1.x.push(point1.x); path1.y.push(point1.y); path2.x.push(point2.x); path2.y.push(point2.y); }
            setGradientCoords({ inputRange, path1, path2 });
        }
    }, [layout, isGradientBorder, cornerRadius, outlineWidth]);
    
    const renderGradientBorder = () => {
        if (!isGradientBorder || outlineWidth <= 0 || layout.width === 0 || !gradientCoords) return null;
        const rectWidth = layout.width - outlineWidth; const rectHeight = layout.height - outlineWidth; const maxRadius = Math.min(rectWidth / 2, rectHeight / 2); const effectiveRadius = Math.max(0, Math.min(cornerRadius - outlineWidth / 2, maxRadius));
        const x1 = borderProgress.interpolate({ inputRange: gradientCoords.inputRange, outputRange: gradientCoords.path1.x }); const y1 = borderProgress.interpolate({ inputRange: gradientCoords.inputRange, outputRange: gradientCoords.path1.y }); const x2 = borderProgress.interpolate({ inputRange: gradientCoords.inputRange, outputRange: gradientCoords.path2.x }); const y2 = borderProgress.interpolate({ inputRange: gradientCoords.inputRange, outputRange: gradientCoords.path2.y });
        const gradientId = `border-gradient-${Math.random().toString(36).slice(2)}`;
        return (<Svg width={layout.width} height={layout.height} style={StyleSheet.absoluteFill} pointerEvents="none"><Defs><AnimatedLinearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={x1} y1={y1} x2={x2} y2={y2}>{borderColor.map((color, index) => (<Stop key={index} offset={`${(index / (borderColor.length - 1)) * 100}%`} stopColor={color} />))}</AnimatedLinearGradient></Defs><SvgRect x={outlineWidth / 2} y={outlineWidth / 2} width={rectWidth} height={rectHeight} rx={effectiveRadius} ry={effectiveRadius} fill="transparent" stroke={`url(#${gradientId})`} strokeWidth={outlineWidth} /></Svg>);
    };
    
    const animationCornerRadius = cornerRadius + 1;

    return (<View style={style} onLayout={(e: LayoutChangeEvent) => { const l = e.nativeEvent.layout; setLayout({ width: l.width, height: l.height }); }}>
        <>
            {layout.width > 0 && layout.height > 0 && behindLayers.map((layer, index) => (
                <GlowLayer key={index} layerConfig={layer} layout={layout} baseAnimationSpeed={animationSpeed} randomness={randomness} cornerRadius={animationCornerRadius} isVisible={isVisible} engine={engine} />
            ))}
        </>
        <View style={{ backgroundColor, borderWidth: outlineWidth, borderColor: isGradientBorder ? 'transparent' : (Array.isArray(borderColor) ? borderColor[0] : borderColor), borderRadius: cornerRadius, overflow: 'hidden' }}>
            <>{children}</>
            <>
                {layout.width > 0 && layout.height > 0 && insideLayers.map((layer, index) => (
                    <GlowLayer key={index} layerConfig={layer} layout={layout} baseAnimationSpeed={animationSpeed} randomness={randomness} cornerRadius={animationCornerRadius} isVisible={isVisible} engine={engine} />
                ))}
            </>
        </View>
        {isGradientBorder && renderGradientBorder()}
        <>
            {layout.width > 0 && layout.height > 0 && overLayers.map((layer, index) => (
                <GlowLayer key={index} layerConfig={layer} layout={layout} baseAnimationSpeed={animationSpeed} randomness={randomness} cornerRadius={animationCornerRadius} isVisible={isVisible} engine={engine} />
            ))}
        </>
    </View>);
};

const styles = StyleSheet.create({
    glowContainer: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
    glowDot: { position: 'absolute', top: 0, left: 0 },
});

export default AnimatedGlow;
import React, { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Canvas, Fill, Skia, Shader, type SkRuntimeEffect } from "@shopify/react-native-skia";
import Animated, { useDerivedValue, useFrameCallback, useSharedValue, type SharedValue } from 'react-native-reanimated';
import type { Layout, GlowConfig, RGBColor, GlowPlacement } from './types';
import { 
    interpolateNumber, 
    interpolateNumberArray, 
    getGlowSizeVec4Worklet, 
    interpolateColorArrayWorklet,
    getGradientColorWorklet,
    parseColorToRgbaWorklet,
    interpolateRgbaWorklet,
} from './helpers';

const MAX_SKIA_LAYERS = 10;

const sksl = `
  uniform vec2 u_resolution;
  uniform vec2 u_rectSize;
  uniform float u_cornerRadius;
  uniform vec4 u_backgroundColor;
  
  uniform float u_borderWidth;
  uniform float u_borderProgress;
  
  uniform int u_layerCount;
  uniform float u_coverage[${MAX_SKIA_LAYERS}];
  uniform vec4 u_glowSizes[${MAX_SKIA_LAYERS}]; 
  uniform float u_opacity[${MAX_SKIA_LAYERS}];
  uniform float u_relativeOffset[${MAX_SKIA_LAYERS}];
  uniform float u_layerProgress[${MAX_SKIA_LAYERS}];

  uniform vec4 u_colors_0[8];
  uniform vec4 u_colors_1[8];
  uniform vec4 u_colors_2[8];
  uniform vec4 u_colors_3[8];
  uniform vec4 u_colors_4[8];
  uniform vec4 u_colors_5[8];
  uniform vec4 u_colors_6[8];
  uniform vec4 u_colors_7[8];
  uniform vec4 u_colors_8[8];
  uniform vec4 u_colors_9[8];
  uniform vec4 u_colors_10[8];

  uniform float u_masterOpacity;
  uniform float u_placements[${MAX_SKIA_LAYERS}];
  uniform float u_isBorderAnimated;

  const float PI = 3.14159265359;
  float smooth(float t) { return t * t * (3.0 - 2.0 * t); }
  vec4 getGradientColor(float progress, vec4 colors[8]) { float t=progress*7.0;vec4 finalColor=colors[7];for(int i=6;i>=0;i--){if(t<float(i+1)){finalColor=mix(colors[i],colors[i+1],t-float(i));}}return finalColor; }
  float sdfRoundedBox(vec2 p, vec2 b, float r) { vec2 q=abs(p)-b+r;return min(max(q.x,q.y),0.0)+length(max(q,0.0))-r; }
  float calculatePerimeterProgress(vec2 p, vec2 b, float r) { float w=b.x-r;float h=b.y-r;float c=PI*r/2.0;float H=2.0*w;float V=2.0*h;float s0_end=c;float s1_end=s0_end+H;float s2_end=s1_end+c;float s3_end=s2_end+V;float s4_end=s3_end+c;float s5_end=s4_end+H;float s6_end=s5_end+c;float perimeter=s6_end+V;if(perimeter==0.0)return 0.0;float dist=0.0;if(p.x<-w){if(p.y<-h){vec2 corner_p=p-vec2(-w,-h);dist=c*((atan(corner_p.y,corner_p.x)+PI)/(PI/2.0));}else if(p.y>h){vec2 corner_p=p-vec2(-w,h);dist=s5_end+c*((atan(corner_p.y,corner_p.x)-PI/2.0)/(PI/2.0));}else{dist=s6_end+(h-p.y);}}else if(p.x>w){if(p.y<-h){vec2 corner_p=p-vec2(w,-h);dist=s1_end+c*((atan(corner_p.y,corner_p.x)+PI/2.0)/(PI/2.0));}else if(p.y>h){vec2 corner_p=p-vec2(w,h);dist=s3_end+c*(atan(corner_p.y,corner_p.x)/(PI/2.0));}else{dist=s2_end+(h+p.y);}}else{if(p.y<0.0){dist=s0_end+(w+p.x);}else{dist=s4_end+(w-p.x);}} return dist/perimeter; }
  float getInterpolatedSize(float progress, vec4 sizes) { float segLen=1.0/3.0;if(progress<segLen){return mix(sizes.x,sizes.y,smooth(progress/segLen));}else if(progress<2.0*segLen){return mix(sizes.y,sizes.z,smooth((progress-segLen)/segLen));}else{return mix(sizes.z,sizes.w,smooth((progress-2.0*segLen)/segLen));} }
  float gaussian(float x, float mu, float sigma) { if(sigma<=0.0)return 0.0;return exp(-(pow(x-mu,2.0))/(2.0*pow(sigma,2.0))); }
  
  vec4 main(vec2 fragCoord) {
    vec2 center = u_resolution * 0.5;
    vec2 p = fragCoord - center;
    vec2 b = u_rectSize * 0.5;
    float d = sdfRoundedBox(p, b, u_cornerRadius);
    float perimeterProgress = calculatePerimeterProgress(p, b, u_cornerRadius);
    
    vec4 behindGlow = vec4(0.0);
    vec4 frontGlow = vec4(0.0);
    
    for (int i = 0; i < ${MAX_SKIA_LAYERS}; i++) {
        if (i >= u_layerCount) break;
        float animatedProgress = fract(perimeterProgress - u_layerProgress[i] + u_relativeOffset[i]);
        if (animatedProgress > u_coverage[i] || u_coverage[i] == 0.0) continue;
        float segmentProgress = animatedProgress / u_coverage[i];
        float currentGlowSize = getInterpolatedSize(segmentProgress, u_glowSizes[i]);
        float calculatedOpacity = gaussian(abs(d), 0.0, currentGlowSize);
        if (d > 0.0 && u_placements[i] == 1.0) calculatedOpacity = 0.0;
        if (calculatedOpacity > 0.0) {
            vec4 color;
            if (i == 0) color = getGradientColor(segmentProgress, u_colors_1);
            else if (i == 1) color = getGradientColor(segmentProgress, u_colors_2);
            else if (i == 2) color = getGradientColor(segmentProgress, u_colors_3);
            else if (i == 3) color = getGradientColor(segmentProgress, u_colors_4);
            else if (i == 4) color = getGradientColor(segmentProgress, u_colors_5);
            else if (i == 5) color = getGradientColor(segmentProgress, u_colors_6);
            else if (i == 6) color = getGradientColor(segmentProgress, u_colors_7);
            else if (i == 7) color = getGradientColor(segmentProgress, u_colors_8);
            else if (i == 8) color = getGradientColor(segmentProgress, u_colors_9);
            else if (i == 9) color = getGradientColor(segmentProgress, u_colors_10);
            
            vec4 glowComponent = color * calculatedOpacity * u_opacity[i];
            if (u_placements[i] == 0.0) {
                behindGlow += glowComponent;
            } else {
                frontGlow += glowComponent;
            }
        }
    }
    
    vec4 finalColor = behindGlow;
    if (d <= 0.0) {
        finalColor = mix(finalColor, u_backgroundColor, u_backgroundColor.a);
    }
    finalColor += frontGlow;
    
    if (u_isBorderAnimated > 0.5 && u_borderWidth > 0.0) {
      float borderDist = abs(d);
      float halfWidth = u_borderWidth / 2.0;
      float borderStrength = 1.0 - smoothstep(halfWidth - 1.0, halfWidth + 1.0, borderDist);
      if (borderStrength > 0.0) {
        float borderAnimatedProgress = fract(perimeterProgress - u_borderProgress);
        vec4 borderColor = getGradientColor(borderAnimatedProgress, u_colors_0);
        finalColor = mix(finalColor, borderColor, borderStrength);
      }
    }

    return finalColor * u_masterOpacity;
  }
`;

const processColorsWorklet = (colors: RGBColor[]): number[] => { 'worklet'; if (colors.length === 0) return Array(8 * 4).fill(0); const seamless = colors.length > 1 ? [...colors, colors[0]] : [...colors, ...colors]; const finalColors: number[] = []; for (let i = 0; i < 8; i++) { const p = i / 7.0; const c = getGradientColorWorklet(p, seamless); finalColors.push(c.r / 255, c.g / 255, c.b / 255, 1.0); } return finalColors; };

export interface UnifiedSkiaGlowProps { 
  layout: Layout; 
  masterOpacity: SharedValue<number>; 
  progress: SharedValue<number>; 
  fromConfig: SharedValue<GlowConfig>; 
  toConfig: SharedValue<GlowConfig>; 
}

const GLOW_CANVAS_MARGIN = 100;

export const UnifiedSkiaGlow: FC<UnifiedSkiaGlowProps> = ({ layout, masterOpacity, progress, fromConfig, toConfig }) => {
    const animatedEffect = useMemo((): SkRuntimeEffect | null => {
        if (Skia.RuntimeEffect) {
            return Skia.RuntimeEffect.Make(sksl);
        }
        return null;
    }, []);

    const borderProgress = useSharedValue(0);
    const layerProgress = useSharedValue(Array(MAX_SKIA_LAYERS).fill(0));
    
    const interpolatedSpeeds = useDerivedValue(() => {
        'worklet';
        const p = progress.value;
        const from = fromConfig.value;
        const to = toConfig.value;
        const animSpeed = interpolateNumber(from.animationSpeed ?? 0.7, to.animationSpeed ?? 0.7, p);
        const borderSpeedMult = interpolateNumber(from.borderSpeedMultiplier ?? 1.0, to.borderSpeedMultiplier ?? 1.0, p);
        const layerSpeedMults = [];
        const toLayers = to.glowLayers ?? [];
        const fromLayers = from.glowLayers ?? [];
        for (let i = 0; i < MAX_SKIA_LAYERS; i++) {
            if (i >= toLayers.length) {
                layerSpeedMults.push(0);
                continue;
            }
            const fromLayer = fromLayers[i] ?? {};
            const toLayer = toLayers[i] ?? {};
            layerSpeedMults.push(interpolateNumber(fromLayer.speedMultiplier ?? (toLayer.speedMultiplier ?? 1.0), toLayer.speedMultiplier ?? 1.0, p));
        }
        return { animSpeed, borderSpeedMult, layerSpeedMults };
    });

    useFrameCallback((frameInfo) => {
        'worklet';
        if (frameInfo.timeSincePreviousFrame === null) return;
        const deltaTime = frameInfo.timeSincePreviousFrame / 1000;
        const speeds = interpolatedSpeeds.value;
        const speedFactor = 0.166;
        const borderDelta = deltaTime * speedFactor * speeds.animSpeed * speeds.borderSpeedMult;
        borderProgress.value = (borderProgress.value + borderDelta) % 1.0;
        const currentLayerProgress = [...layerProgress.value];
        for (let i = 0; i < MAX_SKIA_LAYERS; i++) {
            const layerDelta = deltaTime * speedFactor * speeds.animSpeed * speeds.layerSpeedMults[i];
            currentLayerProgress[i] = (currentLayerProgress[i] + layerDelta) % 1.0;
        }
        layerProgress.value = currentLayerProgress;
    });

    const uniforms = useDerivedValue(() => {
        'worklet';
        const p = progress.value;
        const from = fromConfig.value;
        const to = toConfig.value;
        const cornerRadius = interpolateNumber(from.cornerRadius ?? 10, to.cornerRadius ?? 10, p);
        const outlineWidth = interpolateNumber(from.outlineWidth ?? 2, to.outlineWidth ?? 2, p);
        const fromBg = parseColorToRgbaWorklet(from.backgroundColor ?? 'transparent');
        const toBg = parseColorToRgbaWorklet(to.backgroundColor ?? 'transparent');
        const iBg = interpolateRgbaWorklet(fromBg, toBg, p);
        const backgroundColor = [iBg.r / 255, iBg.g / 255, iBg.b / 255, iBg.a];
        const coverage: number[] = [], glowSizes: number[] = [], opacity: number[] = [],
              relativeOffset: number[] = [], placements: number[] = [];
        const layerColors: number[][] = [];
        const fromLayers = from.glowLayers ?? [];
        const toLayers = to.glowLayers ?? [];
        const layerCount = toLayers.length;
        for (let i = 0; i < MAX_SKIA_LAYERS; i++) {
            if (i >= layerCount) {
                coverage.push(0); opacity.push(0); relativeOffset.push(0); placements.push(0);
                glowSizes.push(0, 0, 0, 0); layerColors.push(Array(32).fill(0));
                continue;
            }
            const fromLayer = fromLayers[i] ?? {};
            const toLayer = toLayers[i] ?? {};
            opacity.push(interpolateNumber(fromLayer.opacity ?? (toLayer.opacity ?? 0.5), toLayer.opacity ?? 0.5, p));
            coverage.push(interpolateNumber(fromLayer.coverage ?? (toLayer.coverage ?? 1.0), toLayer.coverage ?? 1.0, p));
            relativeOffset.push(interpolateNumber(fromLayer.relativeOffset ?? (toLayer.relativeOffset ?? 0), toLayer.relativeOffset ?? 0, p));
            const fromSize = Array.isArray(fromLayer.glowSize) ? fromLayer.glowSize : [fromLayer.glowSize ?? 0];
            const toSize = Array.isArray(toLayer.glowSize) ? toLayer.glowSize : [toLayer.glowSize ?? 0];
            glowSizes.push(...getGlowSizeVec4Worklet(interpolateNumberArray(fromSize, toSize, p)));
            const iColors = interpolateColorArrayWorklet(Array.isArray(fromLayer.colors) ? fromLayer.colors : [], Array.isArray(toLayer.colors) ? toLayer.colors : [], p);
            layerColors.push(processColorsWorklet(iColors));
            const placementMap: Record<GlowPlacement, number> = { 'behind': 0.0, 'inside': 1.0, 'over': 2.0 };
            const placementKey = (toLayer.glowPlacement ?? 'behind') as GlowPlacement;
            placements.push(placementMap[placementKey]);
        }
        const fromBorder = Array.isArray(from.borderColor) ? from.borderColor : (from.borderColor ? [from.borderColor] : []);
        const toBorder = Array.isArray(to.borderColor) ? to.borderColor : (to.borderColor ? [to.borderColor] : []);
        const iBorder = interpolateColorArrayWorklet(fromBorder, toBorder, p);
        
        return {
            u_resolution: [layout.width + GLOW_CANVAS_MARGIN * 2, layout.height + GLOW_CANVAS_MARGIN * 2],
            u_rectSize: [layout.width, layout.height],
            u_cornerRadius: Math.min(cornerRadius, layout.width / 2, layout.height / 2),
            u_backgroundColor: backgroundColor,
            u_borderWidth: outlineWidth,
            u_borderProgress: borderProgress.value,
            u_layerCount: layerCount,
            u_coverage: coverage, u_opacity: opacity, u_relativeOffset: relativeOffset,
            u_glowSizes: glowSizes, u_placements: placements,
            u_layerProgress: layerProgress.value,
            u_colors_0: processColorsWorklet(iBorder),
            u_colors_1: layerColors[0], u_colors_2: layerColors[1], u_colors_3: layerColors[2],
            u_colors_4: layerColors[3], u_colors_5: layerColors[4], u_colors_6: layerColors[5],
            u_colors_7: layerColors[6], u_colors_8: layerColors[7], u_colors_9: layerColors[8],
            u_colors_10: layerColors[9],
            u_masterOpacity: masterOpacity.value,
            u_isBorderAnimated: toBorder.length > 1 ? 1.0 : 0.0,
        };
    }, [layout, progress, fromConfig, toConfig, masterOpacity]);

    if (!animatedEffect || layout.width <= 0 || layout.height <= 0) {
        return null;
    }

    return (
        <View style={[StyleSheet.absoluteFill, { left: -GLOW_CANVAS_MARGIN, top: -GLOW_CANVAS_MARGIN, width: layout.width + GLOW_CANVAS_MARGIN * 2, height: layout.height + GLOW_CANVAS_MARGIN * 2 }]} pointerEvents="none">
            <Animated.View style={StyleSheet.absoluteFill}>
                <Canvas style={StyleSheet.absoluteFill}>
                    <Fill>
                        <Shader source={animatedEffect} uniforms={uniforms} />
                    </Fill>
                </Canvas>
            </Animated.View>
        </View>
    );
};
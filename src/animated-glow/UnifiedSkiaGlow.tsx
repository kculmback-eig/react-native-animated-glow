// src/animated-glow/UnifiedSkiaGlow.tsx

import React from 'react';
import { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas, Fill, Skia, Shader, useClock, Group, Path, rect, type SkRuntimeEffect,
} from "@shopify/react-native-skia";
import Animated, { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import type { Layout, GlowLayerConfig } from './types';

const MAX_SKIA_LAYERS = 10;

const sksl = `
  uniform vec2 u_resolution;
  uniform vec2 u_rectSize;
  uniform float u_cornerRadius;
  uniform float u_baseTime;
  
  uniform float u_borderWidth;
  uniform float u_borderTime;
  
  uniform int u_layerCount;
  uniform float u_coverage[${MAX_SKIA_LAYERS}];
  uniform vec4 u_glowSizes[${MAX_SKIA_LAYERS}];
  uniform float u_opacity[${MAX_SKIA_LAYERS}];
  uniform float u_speedMultiplier[${MAX_SKIA_LAYERS}];
  uniform float u_relativeOffset[${MAX_SKIA_LAYERS}];

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
  uniform float u_isBorderOnly;

  const float PI = 3.14159265359;

  float smooth(float t) { return t * t * (3.0 - 2.0 * t); }

  vec4 getGradientColor(float progress, vec4 colors[8]) {
    float t = progress * 7.0;
    vec4 finalColor = colors[7];
    for (int i = 6; i >= 0; i--) {
        if (t < float(i + 1)) {
            finalColor = mix(colors[i], colors[i+1], t - float(i));
        }
    }
    return finalColor;
  }
  
  float sdfRoundedBox(vec2 p, vec2 b, float r) { vec2 q = abs(p) - b + r; return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r; }
  float calculatePerimeterProgress(vec2 p, vec2 b, float r) { float w=b.x-r;float h=b.y-r;float c=PI*r/2.0;float H=2.0*w;float V=2.0*h;float s0_end=c;float s1_end=s0_end+H;float s2_end=s1_end+c;float s3_end=s2_end+V;float s4_end=s3_end+c;float s5_end=s4_end+H;float s6_end=s5_end+c;float perimeter=s6_end+V;if(perimeter==0.0)return 0.0;float dist=0.0;if(p.x<-w){if(p.y<-h){vec2 corner_p=p-vec2(-w,-h);dist=c*((atan(corner_p.y,corner_p.x)+PI)/(PI/2.0));}else if(p.y>h){vec2 corner_p=p-vec2(-w,h);dist=s5_end+c*((atan(corner_p.y,corner_p.x)-PI/2.0)/(PI/2.0));}else{dist=s6_end+(h-p.y);}}else if(p.x>w){if(p.y<-h){vec2 corner_p=p-vec2(w,-h);dist=s1_end+c*((atan(corner_p.y,corner_p.x)+PI/2.0)/(PI/2.0));}else if(p.y>h){vec2 corner_p=p-vec2(w,h);dist=s3_end+c*(atan(corner_p.y,corner_p.x)/(PI/2.0));}else{dist=s2_end+(h+p.y);}}else{if(p.y<0.0){dist=s0_end+(w+p.x);}else{dist=s4_end+(w-p.x);}} return dist/perimeter; }
  
  float getInterpolatedSize(float progress, vec4 sizes) { float segLen=1.0/3.0;if(progress<segLen){return mix(sizes.x,sizes.y,smooth(progress/segLen));}else if(progress<2.0*segLen){return mix(sizes.y,sizes.z,smooth((progress-segLen)/segLen));}else{return mix(sizes.z,sizes.w,smooth((progress-2.0*segLen)/segLen));} }
  
  float gaussian(float x, float mu, float sigma) { if(sigma<=0.0)return 0.0;return exp(-(pow(x-mu,2.0))/(2.0*pow(sigma,2.0))); }

  vec4 main(vec2 fragCoord) {
    vec2 center = u_resolution * 0.5;
    vec2 p = fragCoord - center;
    vec2 b = u_rectSize * 0.5;
    float d = sdfRoundedBox(p, b, u_cornerRadius);
    float perimeterProgress = calculatePerimeterProgress(p, b, u_cornerRadius);

    if (u_isBorderOnly > 0.5) {
      float borderDist = abs(d);
      float halfWidth = u_borderWidth / 2.0;
      float borderOpacity = 1.0 - step(halfWidth, borderDist);
      if (borderOpacity > 0.0) {
          float borderAnimatedProgress = fract(perimeterProgress - u_borderTime);
          vec4 borderColor = getGradientColor(borderAnimatedProgress, u_colors_0);
          return borderColor * u_masterOpacity;
      }
      return vec4(0.0);
    }

    vec4 finalColor = vec4(0.0);
    for (int i = 0; i < ${MAX_SKIA_LAYERS}; i++) {
        if (i >= u_layerCount) break;
        float time = u_baseTime * u_speedMultiplier[i];
        float animatedProgress = fract(perimeterProgress - time + u_relativeOffset[i]);
        if (animatedProgress > u_coverage[i] || u_coverage[i] == 0.0) { continue; }
        
        float segmentProgress = animatedProgress / u_coverage[i];
        float currentGlowSize = getInterpolatedSize(segmentProgress, u_glowSizes[i]);
        float calculatedOpacity = gaussian(abs(d), 0.0, currentGlowSize);
        if (calculatedOpacity > 0.0) {
            vec4 color;
            if (i == 0) { color = getGradientColor(segmentProgress, u_colors_1); }
            else if (i == 1) { color = getGradientColor(segmentProgress, u_colors_2); }
            else if (i == 2) { color = getGradientColor(segmentProgress, u_colors_3); }
            else if (i == 3) { color = getGradientColor(segmentProgress, u_colors_4); }
            else if (i == 4) { color = getGradientColor(segmentProgress, u_colors_5); }
            else if (i == 5) { color = getGradientColor(segmentProgress, u_colors_6); }
            else if (i == 6) { color = getGradientColor(segmentProgress, u_colors_7); }
            else if (i == 7) { color = getGradientColor(segmentProgress, u_colors_8); }
            else if (i == 8) { color = getGradientColor(segmentProgress, u_colors_9); }
            else if (i == 9) { color = getGradientColor(segmentProgress, u_colors_10); }

            finalColor += color * calculatedOpacity * u_opacity[i];
        }
    }
    
    return finalColor * u_masterOpacity;
  }
`;

const processColors = (colors: string[] | undefined): number[] => { const colorArray = Array.isArray(colors) ? colors : (colors ? [colors] : []); if (colorArray.length === 0) return Array(8 * 4).fill(0); const seamless = colorArray.length > 1 ? [...colorArray, colorArray[0]] : [...colorArray, ...colorArray]; const finalColors: number[] = []; for (let i = 0; i < 8; i++) { const p = i / 7.0; const segLen = 1.0 / (seamless.length - 1); const segIdx = Math.min(Math.floor(p / segLen), seamless.length - 2); const segProg = (p - segIdx * segLen) / segLen; const c1 = Skia.Color(seamless[segIdx]); const c2 = Skia.Color(seamless[segIdx + 1]); finalColors.push( c1[0] + segProg * (c2[0] - c1[0]), c1[1] + segProg * (c2[1] - c1[1]), c1[2] + segProg * (c2[2] - c1[2]), c1[3] + segProg * (c2[3] - c1[3]) ); } return finalColors; };

export interface UnifiedSkiaGlowProps { 
    layout: Layout; 
    cornerRadius: number; 
    borderColor: string | string[]; 
    animationSpeed: number; 
    outlineWidth: number; 
    borderSpeedMultiplier: number; 
    glowLayers: GlowLayerConfig[]; 
    masterOpacity: SharedValue<number>;
}
const GLOW_CANVAS_MARGIN = 100;

const getglowSizeVec4 = (glowSize: number | number[]): [number, number, number, number] => { 
    'worklet'; 
    const arr = Array.isArray(glowSize) ? glowSize : [glowSize]; 
    if (arr.length === 0) return [0, 0, 0, 0]; 
    if (arr.length === 1) return [arr[0], arr[0], arr[0], arr[0]]; 
    if (arr.length === 2) return [arr[0], arr[1], arr[1], arr[0]]; 
    if (arr.length === 3) return [arr[0], arr[1], arr[2], arr[2]]; 
    return [arr[0], arr[1], arr[2], arr[3]]; 
};

export const UnifiedSkiaGlow: FC<UnifiedSkiaGlowProps> = ({ layout, cornerRadius, borderColor, animationSpeed, glowLayers, outlineWidth, borderSpeedMultiplier, masterOpacity }) => {
  const animatedEffect = useMemo((): SkRuntimeEffect | null => { if (!Skia?.RuntimeEffect) return null; return Skia.RuntimeEffect.Make(sksl); }, []);
  const clock = useClock();
  const BASE_ANIMATION_SPEED = 6000;
  const skiaLayers = useMemo(() => glowLayers.slice(0, MAX_SKIA_LAYERS), [glowLayers]);
  const effectiveCornerRadius = useMemo(() => Math.min(cornerRadius, layout.width / 2, layout.height / 2), [cornerRadius, layout.width, layout.height]);

  const processedLayerColors = useMemo(() => {
    const colors = [processColors(Array.isArray(borderColor) ? borderColor : [borderColor])];
    for(let i=0; i < MAX_SKIA_LAYERS; i++) { colors.push(processColors(skiaLayers[i]?.colors)); }
    return colors;
  }, [skiaLayers, borderColor]);

  const placement = skiaLayers[0]?.glowPlacement ?? 'behind';

  const uniforms = useDerivedValue(() => {
    'worklet';
    const baseTime = animationSpeed === 0 ? 0 : clock.value / (BASE_ANIMATION_SPEED / Math.abs(animationSpeed)) * Math.sign(animationSpeed);
    const borderTime = borderSpeedMultiplier === 0 ? baseTime : baseTime * borderSpeedMultiplier;
    const coverage: number[] = []; const glowSizes: number[] = []; const opacity: number[] = []; const speedMultiplier: number[] = []; const relativeOffset: number[] = [];
    
    for (let i = 0; i < MAX_SKIA_LAYERS; i++) {
        const layer = skiaLayers[i];
        coverage.push(layer?.coverage ?? 1.0);
        opacity.push(layer?.opacity ?? 0.7);
        speedMultiplier.push(layer?.speedMultiplier ?? 1.0);
        relativeOffset.push(layer?.relativeOffset ?? 0.0);
        glowSizes.push(...getglowSizeVec4(layer?.glowSize ?? 0));
    }
    
    return {
      u_resolution: [layout.width+GLOW_CANVAS_MARGIN*2, layout.height+GLOW_CANVAS_MARGIN*2], u_rectSize: [layout.width, layout.height],
      u_cornerRadius: effectiveCornerRadius, u_baseTime: baseTime, u_borderTime: borderTime, u_borderWidth: outlineWidth,
      u_layerCount: skiaLayers.length, u_coverage: coverage, u_opacity: opacity, u_speedMultiplier: speedMultiplier, u_glowSizes: glowSizes, u_relativeOffset: relativeOffset,
      u_colors_0: processedLayerColors[0], 
      u_colors_1: processedLayerColors[1], 
      u_colors_2: processedLayerColors[2], 
      u_colors_3: processedLayerColors[3],
      u_colors_4: processedLayerColors[4],
      u_colors_5: processedLayerColors[5],
      u_colors_6: processedLayerColors[6],
      u_colors_7: processedLayerColors[7],
      u_colors_8: processedLayerColors[8],
      u_colors_9: processedLayerColors[9],
      u_colors_10: processedLayerColors[10],
      u_masterOpacity: masterOpacity.value,
    };
  }, [layout, effectiveCornerRadius, clock, animationSpeed, borderSpeedMultiplier, outlineWidth, skiaLayers, processedLayerColors, masterOpacity]);

  const glowUniforms = useDerivedValue(() => ({ ...uniforms.value, u_isBorderOnly: 0.0 }), [uniforms]);
  const borderUniforms = useDerivedValue(() => ({ ...uniforms.value, u_isBorderOnly: 1.0 }), [uniforms]);

  const clipPath = useMemo(() => { const path = Skia.Path.Make(); path.addRRect(Skia.RRectXY(rect(GLOW_CANVAS_MARGIN, GLOW_CANVAS_MARGIN, layout.width, layout.height), effectiveCornerRadius, effectiveCornerRadius)); return path; }, [layout.width, layout.height, effectiveCornerRadius]);

  if (!animatedEffect || layout.width <= 0 || layout.height <= 0) return null;

  const glowLayer = <Fill><Shader source={animatedEffect} uniforms={glowUniforms} /></Fill>;
  const borderLayer = <Fill><Shader source={animatedEffect} uniforms={borderUniforms} /></Fill>;
  const contentByPlacement = { behind: <>{glowLayer}{borderLayer}</>, over: <>{borderLayer}{glowLayer}</>, inside: <>{borderLayer}<Group clip={clipPath}>{glowLayer}</Group></>, };
  
  return (
    <View style={[StyleSheet.absoluteFill, { left: -GLOW_CANVAS_MARGIN, top: -GLOW_CANVAS_MARGIN, width: layout.width + GLOW_CANVAS_MARGIN * 2, height: layout.height + GLOW_CANVAS_MARGIN * 2 }]} pointerEvents="none">
      <Animated.View style={StyleSheet.absoluteFill}>
        <Canvas style={StyleSheet.absoluteFill}>
            {contentByPlacement[placement] || contentByPlacement.behind}
        </Canvas>
      </Animated.View>
    </View>
  );
};
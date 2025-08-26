// src/AnimatedGlow.tsx

import React, { useState, useMemo, FC, useEffect, Suspense } from 'react';
import { View, LayoutChangeEvent, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import type { AnimatedGlowProps, GlowLayerConfig, Layout, PresetConfig, GlowEvent } from './animated-glow/types';
import { LazyUnifiedSkiaGlow } from './animated-glow/LazyUnifiedSkiaGlow';
import { skiaWebState, ensureSkiaWebLoaded } from './animated-glow/SkiaWebLoader';

export type { PresetConfig, GlowLayerConfig, AnimatedGlowProps };

const isObject = (item: unknown): item is Record<string, any> => {
    return !!(item && typeof item === 'object' && !Array.isArray(item));
};

const mergeDeep = (target: Record<string, any>, source: Record<string, any>): Record<string, any> => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (key === 'glowLayers' && Array.isArray(source[key]) && Array.isArray(target[key])) {
        output[key] = target[key].map((layer, index) => 
          source[key][index] ? { ...layer, ...source[key][index] } : layer
        );
      } 
      else if (isObject(source[key]) && key in target && isObject(target[key])) {
        output[key] = mergeDeep(target[key], source[key]);
      } 
      else {
        output[key] = source[key];
      }
    });
  }
  return output;
};


const AnimatedGlow: FC<AnimatedGlowProps> = (props) => {
    const { preset = {}, states: statesProp, initialState = 'default', children, style, isVisible = true, ...overrideProps } = props;
    const states = statesProp || preset.states || [];
    
    const [isSkiaReady, setIsSkiaReady] = useState(skiaWebState.status === 'ready');
    const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
    const [hasLaidOut, setHasLaidOut] = useState(false);
    const [activeState, setActiveState] = useState<GlowEvent>(initialState);
    const skiaOpacity = useSharedValue(0);

    useEffect(() => {
        if (skiaWebState.status === 'ready') {
            if (!isSkiaReady) setIsSkiaReady(true);
            return;
        }
        const onReady = () => setIsSkiaReady(true);
        skiaWebState.subscribers.add(onReady);
        ensureSkiaWebLoaded();
        return () => { skiaWebState.subscribers.delete(onReady); };
    }, [isSkiaReady]);
    
    const finalProps = useMemo((): PresetConfig => {
        const basePreset = { ...preset, ...overrideProps };
        const stateOverride = states.find(s => s.name === activeState)?.preset || {};
        return mergeDeep(basePreset, stateOverride);
    }, [preset, overrideProps, states, activeState]);

    const {
        cornerRadius = 10, outlineWidth = 2, borderColor = 'white', backgroundColor = 'transparent',
        animationSpeed = 0.7, borderSpeedMultiplier = 1.0,
        glowLayers: rawGlowLayers = [],
    } = finalProps;

    const tapGesture = Gesture.Tap()
        .onBegin(() => { if (states.some(s => s.name === 'press')) setActiveState('press'); })
        .onFinalize(() => { setActiveState(initialState); });

    const hoverGesture = Gesture.Hover()
        .onBegin(() => { if (states.some(s => s.name === 'hover')) setActiveState('hover'); })
        .onEnd(() => { setActiveState(initialState); });

    const gesture = Gesture.Race(Platform.OS === 'web' ? hoverGesture : Gesture.Manual(), tapGesture);

    const glowLayers = useMemo((): GlowLayerConfig[] => {
        const layerDefaults: Omit<GlowLayerConfig, 'colors'> = { opacity: 0.5, glowSize: 75, speedMultiplier: 1.0, scaleAmplitude: 0, scaleFrequency: 2.5, glowPlacement: 'behind', coverage: 1.0, relativeOffset: 0 };
        return rawGlowLayers.map((layer: any) => ({ ...layerDefaults, ...layer, colors: layer.colors || [] }));
    }, [rawGlowLayers]);

    const skiaBehind = useMemo(() => glowLayers.filter(l => l.glowPlacement === 'behind'), [glowLayers]);
    const skiaInside = useMemo(() => glowLayers.filter(l => l.glowPlacement === 'inside'), [glowLayers]);
    const skiaOver = useMemo(() => glowLayers.filter(l => l.glowPlacement === 'over'), [glowLayers]);
    
    const useSkiaRenderer = useMemo(() => (glowLayers.length > 0) || (Array.isArray(borderColor) && borderColor.length > 1), [glowLayers, borderColor]);

    const wrapperStyle = useMemo<StyleProp<ViewStyle>>(() => ({
        backgroundColor: backgroundColor,
        borderWidth: useSkiaRenderer ? 0 : outlineWidth,
        borderColor: useSkiaRenderer ? 'transparent' : (Array.isArray(borderColor) ? borderColor[0] : borderColor),
        borderRadius: cornerRadius,
        overflow: useSkiaRenderer ? 'visible' : 'hidden',
    }), [useSkiaRenderer, backgroundColor, outlineWidth, borderColor, cornerRadius]);

    const skiaProps = { layout, cornerRadius, outlineWidth, borderColor, borderSpeedMultiplier, animationSpeed };
    
    const shouldRenderSkia = useSkiaRenderer && hasLaidOut && isVisible && isSkiaReady;

    useEffect(() => {
        const transition = states.find(s => s.name === activeState)?.transition ?? 300;
        if (shouldRenderSkia) {
            skiaOpacity.value = withTiming(1, { duration: transition });
        } else {
            skiaOpacity.value = withTiming(0, { duration: 250 });
        }
    }, [shouldRenderSkia, activeState]);

    const renderSkiaGlow = (layers: GlowLayerConfig[], key: string) => {
        if (layers.length === 0) return null;
        return (
            <Suspense fallback={null}>
                <LazyUnifiedSkiaGlow {...skiaProps} glowLayers={layers} masterOpacity={skiaOpacity} />
            </Suspense>
        );
    };

    return (
        <GestureHandlerRootView>
            <GestureDetector gesture={gesture}>
                <View 
                    style={[style]}
                    onLayout={(e: LayoutChangeEvent) => { 
                        const l = e.nativeEvent.layout; 
                        setLayout({ width: l.width, height: l.height });
                        if (!hasLaidOut) setHasLaidOut(true);
                    }}
                >
                    {shouldRenderSkia && renderSkiaGlow(skiaBehind, 'skia-behind')}
                    <View style={wrapperStyle}>
                        {shouldRenderSkia && renderSkiaGlow(skiaInside, 'skia-inside')}
                        {children}
                    </View>
                    {shouldRenderSkia && renderSkiaGlow(skiaOver, 'skia-over')}
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
};

export default AnimatedGlow;
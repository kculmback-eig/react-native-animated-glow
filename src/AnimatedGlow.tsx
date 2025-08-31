// src/AnimatedGlow.tsx

import React, { useState, useMemo, FC, useEffect, Suspense, useRef } from 'react';
import { View, LayoutChangeEvent, Platform, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { AnimatedGlowProps, GlowLayerConfig, Layout, PresetConfig, GlowEvent, GlowState, GlowConfig } from './animated-glow/types';
import { LazyUnifiedSkiaGlow } from './animated-glow/LazyUnifiedSkiaGlow';
import { skiaWebState, ensureSkiaWebLoaded } from './animated-glow/SkiaWebLoader';

export type { PresetConfig, GlowLayerConfig, AnimatedGlowProps, GlowEvent, GlowState, GlowConfig };

const isObject = (item: any) => (item && typeof item === 'object' && !Array.isArray(item));
const mergeDeep = (target: any, source: any): any => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (key === 'glowLayers' && Array.isArray(source[key]) && Array.isArray(target[key])) {
        const mergedLayers = target[key].map((layer, index) =>
          source[key][index] ? { ...layer, ...source[key][index] } : layer
        );
        if (source[key].length > target[key].length) {
          mergedLayers.push(...source[key].slice(target[key].length));
        }
        output[key] = mergedLayers;
      } else if (isObject(source[key]) && key in target && isObject(target[key])) {
        output[key] = mergeDeep(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
};

const AnimatedGlow: FC<AnimatedGlowProps> = (props) => {
    const { preset = {}, states: statesProp, initialState = 'default', children, style, isVisible = true, ...overrideProps } = props;
    
    const [isSkiaReady, setIsSkiaReady] = useState(skiaWebState.status === 'ready');
    const [layout, setLayout] = useState<Layout>({ width: 0, height: 0 });
    const [hasLaidOut, setHasLaidOut] = useState(false);
    const [activeState, setActiveState] = useState<GlowEvent>(initialState);
    const prevActiveState = useRef<GlowEvent>(initialState);
    const skiaOpacity = useSharedValue(0);
    const animationProgress = useSharedValue(0);
    const fromConfigSV = useSharedValue<GlowConfig>({});
    const toConfigSV = useSharedValue<GlowConfig>({});
    
    useEffect(() => {
        if (skiaWebState.status === 'ready') {
            if (!isSkiaReady) setIsSkiaReady(true); return;
        }
        const onReady = () => setIsSkiaReady(true);
        skiaWebState.subscribers.add(onReady);
        ensureSkiaWebLoaded();
        return () => { skiaWebState.subscribers.delete(onReady); };
    }, [isSkiaReady]);
    
    const states = useMemo(() => statesProp || preset.states || [], [statesProp, preset.states]);

    const targetConfig = useMemo((): GlowConfig => {
        const allStates = statesProp || preset.states || [];
        const defaultState = allStates.find(s => s.name === 'default')?.preset || {};
        
        const legacyBase = { ...preset, ...overrideProps };
        delete legacyBase.metadata;
        delete legacyBase.states;

        const baseConfig = mergeDeep(defaultState, legacyBase);
        const stateOverride = allStates.find(s => s.name === activeState)?.preset || {};
        
        return mergeDeep(baseConfig, stateOverride);
    }, [preset, overrideProps, statesProp, activeState]);
    
    useEffect(() => {
        if (animationProgress.value === 0 && !fromConfigSV.value.cornerRadius) {
            fromConfigSV.value = targetConfig;
            toConfigSV.value = targetConfig;
            animationProgress.value = 1;
            prevActiveState.current = activeState;
            return;
        }
        
        let transition = states.find(s => s.name === activeState)?.transition ?? 0;
        if (activeState === 'default' && prevActiveState.current !== 'default') {
            transition = states.find(s => s.name === prevActiveState.current)?.transition ?? transition;
        }
        
        fromConfigSV.value = toConfigSV.value;
        toConfigSV.value = targetConfig;

        if (transition > 0) {
            animationProgress.value = 0;
            animationProgress.value = withTiming(1, { duration: transition, easing: Easing.out(Easing.quad) });
        } else {
            animationProgress.value = 1;
        }
        
        prevActiveState.current = activeState;
    }, [targetConfig, activeState, states]);
    
    const pressGesture = Gesture.LongPress()
        .minDuration(1)
        .onStart(() => {
            if (states.some(s => s.name === 'press')) {
                setActiveState('press');
            }
        })
        .onEnd(() => {
            setActiveState(current => (current === 'press' ? initialState : current));
        });

    const hoverGesture = Gesture.Hover()
        .onStart(() => {
            if (states.some(s => s.name === 'hover')) {
                setActiveState('hover');
            }
        })
        .onEnd(() => {
            setActiveState(current => (current === 'hover' ? initialState : current));
        });

    const gesture = Gesture.Race(Platform.OS === 'web' ? hoverGesture : Gesture.Manual(), pressGesture);
    
    const { cornerRadius = 10, outlineWidth = 2, borderColor = 'white', backgroundColor } = targetConfig;
    const hasAnimatedBorder = Array.isArray(borderColor) && borderColor.length > 1;
    const hasGlowLayers = (targetConfig.glowLayers?.length ?? 0) > 0;
    const useSkiaRenderer = useMemo(() => hasGlowLayers || hasAnimatedBorder, [hasGlowLayers, hasAnimatedBorder]);

    const wrapperStyle = useMemo<StyleProp<ViewStyle>>(() => ({
        backgroundColor: useSkiaRenderer ? 'transparent' : backgroundColor,
        borderWidth: useSkiaRenderer ? 0 : outlineWidth,
        borderColor: useSkiaRenderer ? 'transparent' : (Array.isArray(borderColor) ? borderColor[0] : borderColor),
        borderRadius: cornerRadius,
        overflow: 'hidden',
    }), [useSkiaRenderer, outlineWidth, borderColor, cornerRadius, backgroundColor]);
    
    const shouldRenderSkia = useSkiaRenderer && hasLaidOut && isVisible && isSkiaReady;

    useEffect(() => {
        skiaOpacity.value = withTiming(shouldRenderSkia ? 1 : 0, { duration: 300 });
    }, [shouldRenderSkia]);

    return (
        <GestureDetector gesture={gesture}>
            <View 
                style={[style]}
                onLayout={(e: LayoutChangeEvent) => { 
                    const l = e.nativeEvent.layout; 
                    if (l.width !== layout.width || l.height !== layout.height) {
                      setLayout({ width: l.width, height: l.height });
                    }
                    if (!hasLaidOut) setHasLaidOut(true);
                }}
            >
                {shouldRenderSkia && (
                  <Suspense fallback={null}>
                    <LazyUnifiedSkiaGlow
                      layout={layout}
                      masterOpacity={skiaOpacity}
                      progress={animationProgress}
                      fromConfig={fromConfigSV}
                      toConfig={toConfigSV}
                    />
                  </Suspense>
                )}
                <View style={wrapperStyle}>
                    {children}
                </View>
            </View>
        </GestureDetector>
    );
};

export default AnimatedGlow;
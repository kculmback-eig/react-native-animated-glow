import React, { FC } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import type { Layout, GlowConfig } from './types';
import { LazyUnifiedSkiaGlow } from './LazyUnifiedSkiaGlow';

interface SkiaRootProps {
    layout: Layout;
    skiaOpacity: SharedValue<number>;
    animationProgress: SharedValue<number>;
    fromConfigSV: SharedValue<GlowConfig>;
    toConfigSV: SharedValue<GlowConfig>;
}

export const SkiaRoot: FC<SkiaRootProps> = (props) => {
    return (
        <LazyUnifiedSkiaGlow
            layout={props.layout}
            masterOpacity={props.skiaOpacity}
            progress={props.animationProgress}
            fromConfig={props.fromConfigSV}
            toConfig={props.toConfigSV}
        />
    );
};
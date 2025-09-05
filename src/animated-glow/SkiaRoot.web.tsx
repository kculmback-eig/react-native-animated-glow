import React, { FC, useMemo, ComponentType } from 'react';
import type { SharedValue } from 'react-native-reanimated';
import { WithSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
const skiaPackageJson = require('@shopify/react-native-skia/package.json');
const canvasKitVersion = skiaPackageJson.dependencies['canvaskit-wasm'];

import type { Layout, GlowConfig } from './types';
import { LazyUnifiedSkiaGlow } from './LazyUnifiedSkiaGlow';

interface SkiaRootProps {
    layout: Layout;
    skiaOpacity: SharedValue<number>;
    animationProgress: SharedValue<number>;
    fromConfigSV: SharedValue<GlowConfig>;
    toConfigSV: SharedValue<GlowConfig>;
}

const SkiaContent: FC<SkiaRootProps> = (props) => {
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

export const SkiaRoot: FC<SkiaRootProps> = (props) => {
    const MemoizedSkiaContent = useMemo((): ComponentType => {
        return () => <SkiaContent {...props} />;
    }, [props]);

    return (
        <WithSkiaWeb
            opts={{
                locateFile: (file: string) => {
                    const url = `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${canvasKitVersion}/bin/full/${file}`;
                    return url;
                }
            }}
            fallback={null}
            getComponent={() => {
                return Promise.resolve({ default: MemoizedSkiaContent });
            }}
        />
    );
};
// src/animated-glow/SkiaWebLoader.web.ts

import { Platform } from 'react-native';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';
import { version } from 'canvaskit-wasm/package.json';

type SkiaWebState = { status: 'idle' | 'loading' | 'ready'; subscribers: Set<() => void>; };

// The state starts as 'idle' on web
export const skiaWebState: SkiaWebState = {
  status: 'idle',
  subscribers: new Set(),
};

let hasBeenTriggered = false;

export const ensureSkiaWebLoaded = () => {
  if (Platform.OS !== 'web' || hasBeenTriggered || skiaWebState.status !== 'idle') {
    return;
  }
  
  hasBeenTriggered = true;
  skiaWebState.status = 'loading';

  LoadSkiaWeb({
    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${version}/bin/full/${file}`
  }).then(() => {
    skiaWebState.status = 'ready';
    skiaWebState.subscribers.forEach(callback => callback());
    skiaWebState.subscribers.clear(); // Clean up after notifying
  }).catch(console.error);
};
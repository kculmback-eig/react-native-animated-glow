import { Platform } from 'react-native';
import { LoadSkiaWeb } from '@shopify/react-native-skia/lib/module/web';

const skiaPackageJson = require('@shopify/react-native-skia/package.json');
const canvasKitVersion = skiaPackageJson.dependencies['canvaskit-wasm'];

type SkiaWebState = { status: 'idle' | 'loading' | 'ready'; subscribers: Set<() => void>; };

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
    locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${canvasKitVersion}/bin/full/${file}`
  }).then(() => {
    skiaWebState.status = 'ready';
    skiaWebState.subscribers.forEach(callback => callback());
    skiaWebState.subscribers.clear();
  }).catch((err) => {});
};
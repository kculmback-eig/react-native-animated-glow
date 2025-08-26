// src/animated-glow/SkiaWebLoader.ts

type SkiaWebState = { status: 'ready'; subscribers: Set<() => void>; };

export const skiaWebState: SkiaWebState = {
  status: 'ready',
  subscribers: new Set(),
};

// This function does nothing on native.
export const ensureSkiaWebLoaded = () => {};
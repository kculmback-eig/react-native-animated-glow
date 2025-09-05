type SkiaWebState = { status: 'ready'; subscribers: Set<() => void>; };

export const skiaWebState: SkiaWebState = {
  status: 'ready',
  subscribers: new Set(),
};

export const ensureSkiaWebLoaded = () => {};
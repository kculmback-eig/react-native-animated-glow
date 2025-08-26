// src/animated-glow/LazyUnifiedSkiaGlow.tsx

import React from 'react';

export const LazyUnifiedSkiaGlow = React.lazy(() => 
  import('./UnifiedSkiaGlow').then(module => ({ default: module.UnifiedSkiaGlow }))
);
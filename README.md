# ✨ React Native Animated Glow v2.0

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/react-native-animated-glow.svg)](https://www.npmjs.com/package/react-native-animated-glow)
[![NPM License](https://img.shields.io/npm/l/react-native-animated-glow.svg)](https://github.com/realimposter/react-native-animated-glow/blob/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dt/react-native-animated-glow.svg)](https://www.npmjs.com/package/react-native-animated-glow)
<br/>
<a href="https://github.com/realimposter/react-native-animated-glow">
  <img src="https://img.shields.io/github/stars/realimposter/react-native-animated-glow?style=social" alt="GitHub stars">
</a>

</div>

A performant, highly-customizable animated glow effect component for React Native, powered by **Skia** and **Reanimated 3**.

![React Native Animated Glow Demo](https://raw.githubusercontent.com/realimposter/react-native-animated-glow/main/assets/react-native-glow-demo.gif)

## Live Demo & Builder

Check out the **[live web demo and interactive builder](https://reactnativeglow.com/)** to see the component in action, browse tutorials, and create your own presets.

## Features

-   **GPU-Powered Performance:** Built with Skia for smooth, 60 FPS animations that run on the UI thread.
-   **Interactive:** Responds to `hover` and `press` events with configurable transitions using Reanimated & Gesture Handler.
-   **Highly Customizable:** Control colors, speed, shape, size, opacity, and more through a flexible `glowLayers` API.
-   **Advanced Effects:**
    -   Create flowing **gradient glows and borders**.
    -   Render glows `behind`, `inside` (clipped), or `over` your component.
    -   Achieve "comet trail" effects with variable `glowSize` arrays.
-   **Easy Web Setup:** Skia's CanvasKit WASM file is loaded automatically from a CDN, no extra configuration needed.
-   **Presets Included:** Ships with professionally designed presets to get you started instantly.

## 📦 Installation

**1. Install the library:**

```bash
npm install react-native-animated-glow
# or
yarn add react-native-animated-glow
```

**2. Install Peer Dependencies:**

The library depends on Skia, Reanimated, and Gesture Handler.

```bash
npm install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
# or
yarn add @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

**3. Configure Dependencies:**

You must follow the installation guides for the peer dependencies to ensure they are configured correctly for your project.
- [React Native Skia Docs](https://shopify.github.io/react-native-skia/docs/getting-started/installation)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) (Remember to add the Babel plugin!)
- [Gesture Handler Docs](https://docs.swmansion.com/react-native-gesture-handler/docs/installation) (Remember to add `GestureHandlerRootView`!)

## Usage

### Basic Example

Wrap any component in `<AnimatedGlow>` and configure it using props or a preset.

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedGlow from 'react-native-animated-glow';

export default function MyGlowingComponent() {
  return (
    <AnimatedGlow
      cornerRadius={50}
      outlineWidth={2}
      borderColor={['#ff00ff', '#00ffff']}
      glowLayers={[
        { colors: ['#ff00ff', '#00ffff'], opacity: 0.2, glowSize: 30 },
      ]}
    >
      <View style={styles.box}>
        <Text style={styles.text}>I'm Glowing!</Text>
      </View>
    </AnimatedGlow>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 20, paddingHorizontal: 40, backgroundColor: '#222' },
  text: { color: 'white', fontWeight: 'bold' }
});
```

### Using Presets & States

For reusability and interactivity, define presets and states.

```typescript
// in my-presets.ts
import { type PresetConfig } from 'react-native-animated-glow';

export const interactivePreset: PresetConfig = {
  cornerRadius: 50,
  animationSpeed: 1,
  glowLayers: [{ colors: ['#5a4ff9'], glowSize: 20 }],
  states: [
    {
      name: 'hover',
      transition: 300, // 300ms transition
      preset: { glowLayers: [{ glowSize: 35 }] }
    }
  ]
};

// in MyButton.tsx
import AnimatedGlow from 'react-native-animated-glow';
import { interactivePreset } from './my-presets';
import { TouchableOpacity } from 'react-native';

const MyButton = () => (
  <AnimatedGlow preset={interactivePreset}>
    <TouchableOpacity style={styles.button} />
  </AnimatedGlow>
);
```

## API Reference

For a complete list of all available props and their descriptions, please see the **[Docs Tab](https://reactnativeglow.com/docs)** in the live demo app.

## Changelog

### `v2.0.0` (Current Version)
This version marks a complete architectural rewrite for maximum performance and flexibility.

-   **Complete Rewrite with Skia:** The library is now powered by **Skia** and **Reanimated 3**, running animations smoothly on the UI thread.
-   **Interactive States:** Added support for `hover` and `press` events with configurable transitions using `react-native-gesture-handler`.
-   **BREAKING CHANGE:** The library now requires `@shopify/react-native-skia`, `react-native-reanimated`, and `react-native-gesture-handler` as peer dependencies. The old props (`glowColor`, `glowSize`, etc.) have been replaced by the `glowLayers` API.

### `v1.4.1`
-   Improved presets and fixed border radius calculations.
-   Added compatibility fixes for newer versions of Reanimated.

### `v1.4.0`
-   **Major Refactor:** Replaced Reanimated dependency with React Native's built-in Animated API to simplify installation.
-   **BREAKING CHANGE:** Removed `react-native-reanimated` as a peer dependency for this version.

### `v1.3.0`
-   **New Feature:** Added the `isVisible` prop to dynamically toggle the effect for performance optimization.
-   Improved rendering performance.

### `v1.2.2`
-   Minor documentation updates and bug fixes.

### `v1.2.1`
-   **Feature:** Added a `GlowDebugger` component for development and visualization of glow paths.

### `v1.2.0`
-   **Fix:** Corrected rendering issues with inner glows.
-   Minor bug fixes and documentation updates.

### `v1.1.1`
-   General performance improvements.

### `v1.0.1`
-   **Chore:** Renamed the package to `react-native-animated-glow`.

### `v1.0.0`
-   Initial public release.

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📜 License

This project is licensed under the MIT License.
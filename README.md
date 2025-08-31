# ✨ React Native Animated Glow v3.0

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
-   **Intelligent State Blending:** Responds to `hover` and `press` events by smoothly interpolating between different glow configurations.
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
```

**2. Install Peer Dependencies:**

The library depends on Skia, Reanimated, and Gesture Handler.

```bash
npm install @shopify/react-native-skia react-native-reanimated react-native-gesture-handler
```

**3. Configure Dependencies:**

You must follow the installation guides for the peer dependencies to ensure they are configured correctly for your project.
- [React Native Skia Docs](https://shopify.github.io/react-native-skia/docs/getting-started/installation)
- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation) (Remember to add the Babel plugin!)
- [Gesture Handler Docs](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation) (Remember to add `GestureHandlerRootView`!)

## Usage

The best way to use the component is with a `PresetConfig` object, which makes your styles reusable and type-safe.

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnimatedGlow, { type PresetConfig } from 'react-native-animated-glow';

// 1. Define your preset
const myCoolPreset: PresetConfig = {
  metadata: { 
    name: 'My Cool Preset', 
    textColor: '#FFFFFF', 
    category: 'Custom',
    tags: ['interactive']
  },
  states: [
    {
      name: 'default', // The base style for the component
      preset: {
        cornerRadius: 50,
        outlineWidth: 2,
        borderColor: '#E0FFFF',
        glowLayers: [
          { colors: ['#00BFFF', '#87CEEB'], opacity: 0.5, glowSize: 30 },
        ]
      }
    },
    // 2. Define interactive states
    { 
      name: 'hover', 
      transition: 300, // 300ms transition into this state
      preset: { 
        glowLayers: [{ glowSize: 40 }] // On hover, make the glow bigger
      } 
    },
    { 
      name: 'press', 
      transition: 100, // A faster transition for press
      preset: { 
        glowLayers: [{ glowSize: 45, opacity: 0.6 }] 
      } 
    }
  ]
};

// 3. Use it in your component
export default function MyGlowingComponent() {
  return (
    <AnimatedGlow preset={myCoolPreset}>
      <View style={styles.box}>
        <Text style={styles.text}>I'm Interactive!</Text>
      </View>
    </AnimatedGlow>
  );
}

const styles = StyleSheet.create({
  box: { paddingVertical: 20, paddingHorizontal: 40, backgroundColor: '#222' },
  text: { color: 'white', fontWeight: 'bold' }
});
```

## API Reference

For a complete list of all available props and their descriptions, please see the **[Docs Tab](https://reactnativeglow.com/docs)** in the live demo app.

## Changelog

### `v3.0.0`
This version introduces a more powerful and intelligent animation system along with a complete restructuring of the preset API for better organization and type safety.

-   **New Feature: Intelligent Animation Blending:** A new animation system powered by Reanimated worklets smoothly interpolates *between* state configurations. When you hover, press, or return to default, every animatable property (colors, sizes, opacity, etc.) will transition gracefully over the specified duration.
-   **New Feature: Reworked State Management API:** The `preset` prop now expects a `PresetConfig` object with a `states` array. All visual styles, including the `default` look, are defined within this array. This makes presets more organized and powerful.
-   **Architectural Improvement:** All glow layers, placements (`behind`, `inside`, `over`), and the animated border are now rendered in a single, unified Skia shader for maximum efficiency.
-   **BREAKING CHANGE:** The `preset` prop format has been completely overhauled. Old flat preset objects are incompatible and must be migrated to the new `PresetConfig` structure, which includes a `metadata` object and a `states` array.
-   **BREAKING CHANGE:** The `randomness` prop has been removed from the core API.

### `v2.0.0`
This version marked a complete architectural rewrite for maximum performance and flexibility.

-   **Complete Rewrite with Skia:** The library is now powered by **Skia** and **Reanimated 3**, running animations smoothly on the UI thread.
-   **Interactive States:** Added support for `hover` and `press` events with configurable transitions using `react-native-gesture-handler`.
-   **BREAKING CHANGE:** The library now requires `@shopify/react-native-skia`, `react-native-reanimated`, and `react-native-gesture-handler` as peer dependencies. The old props (`glowColor`, `glowSize`, etc.) have been replaced by the `glowLayers` API.

### `v1.0.0`
-   Initial release using glow particles and reanimated

## 📜 License

This project is licensed under the MIT License.
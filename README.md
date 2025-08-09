# React Native Animated Glow

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/react-native-animated-glow.svg)](https://www.npmjs.com/package/react-native-animated-glow)
[![NPM License](https://img.shields.io/npm/l/react-native-animated-glow.svg)](https://github.com/realimposter/react-native-animated-glow/blob/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dt/react-native-animated-glow.svg)](https://www.npmjs.com/package/react-native-animated-glow)
<br/>
<a href="https://github.com/realimposter/react-native-animated-glow">
  <img src="https://img.shields.io/github/stars/realimposter/react-native-animated-glow?style=social" alt="GitHub stars">
</a>

</div>

![React Native Animated Glow Demo](https://raw.githubusercontent.com/realimposter/react-native-animated-glow/main/assets/react-native-glow-demo.gif)

A fully customizable, performant, animated glow effect wrapper for any React Native component, powered by Reanimated and SVG.

## ✨ Live Demo & Builder

**Check out the official interactive showcase and documentation at [reactnativeglow.com](https://reactnativeglow.com)!**

Build your perfect glow effect with the live editor, browse tutorials, and copy the settings directly into your project.

## Features

-   **Highly Performant:** All animations run on the native UI thread thanks to React Native Reanimated.
-   **Multi-Layer Effects:** Add an infinite number of glow layers for complex and beautiful effects.
-   **Flexible Glow Placement:** Render glows `behind` (classic), `inside` (clipped), or `over` your component.
-   **Animated Gradient Borders:** Pass an array of colors to `borderColor` for a beautiful, rotating gradient outline.
-   **Variable Orb Sizes:** Provide an array to `dotSize` for organic, non-uniform effects.
-   **Extensive Presets:** Comes with 20+ professionally designed presets to get you started instantly.
-   **Easy to Use:** Wrap any component in `<AnimatedGlow>` to apply the effect.
-   **Backward Compatible:** Your V1 settings for `innerGlow` and `outerGlow` will still work perfectly.

## Installation

```bash
npm install react-native-animated-glow
```

### Peer Dependencies

This library relies on `react-native-reanimated` and `react-native-svg`. You must install them and follow their respective setup instructions.

```bash
npm install react-native-reanimated react-native-svg
```

-   [React Native Reanimated Installation Guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
-   [React Native SVG Installation Guide](https://github.com/react-native-svg/react-native-svg#installation)

## Usage

### Basic Example

The `glowLayers` prop is the recommended way to create effects. Each object in the array defines a new layer.

```jsx
import AnimatedGlow from 'react-native-animated-glow';
import { Text, View } from 'react-native';

function MyComponent() {
  return (
    <AnimatedGlow
      cornerRadius={20}
      glowLayers={[
        // A classic outer glow
        {
          colors: ['#00FFFF', '#FF00FF'],
          dotSize: [40, 100], // Orbs will have a variable size
          opacity: 0.4,
          glowPlacement: 'behind',
        },
        // An inward glow, clipped by the component
        {
          colors: ['#FFFFFF'],
          dotSize: 30,
          opacity: 0.5,
          glowPlacement: 'inside',
        },
      ]}
    >
      <View style={{ padding: 20, backgroundColor: '#222' }}>
        <Text style={{ color: 'white' }}>I'm Glowing!</Text>
      </View>
    </AnimatedGlow>
  );
}
```

### Using a Preset

```jsx
import AnimatedGlow from 'react-native-animated-glow';
// Presets must be imported from your own project files.
// See the showcase app for examples.
import { glowPresetsPro } from './path/to/your/presets';

function HotFlameButton() {
  return (
    <AnimatedGlow preset={glowPresetsPro.hotFlame} cornerRadius={50}>
      <Text style={{ fontSize: 40, padding: 20 }}>🔥</Text>
    </AnimatedGlow>
  );
}
```

## Props API

| Prop                      | Type                               | Default  | Description                                                                                               |
| ------------------------- | ---------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `children`                | `ReactNode`                        | -        | **Required.** The component to wrap.                                                                      |
| `preset`                  | `object`                           | `{}`     | A preset object containing any of the other props.                                                        |
| `cornerRadius`            | `number`                           | `10`     | Border radius of the child wrapper; defines the glow path.                                                |
| `outlineWidth`            | `number`                           | `2`      | The width of the visible border.                                                                          |
| `borderColor`             | `string \| string[]`               | `white`  | The color of the border. Can be an array of colors to create an animated gradient border.                 |
| `animationSpeed`          | `number`                           | `0.7`    | A master speed control for all layers. Higher is faster.                                                  |
| `borderSpeedMultiplier`   | `number`                           | `1.0`    | Controls the animation speed of the gradient border, independent of `animationSpeed`.                     |
| `randomness`              | `number`                           | `0.01`   | Adds slight randomness to orb starting positions for a more organic look.                                 |
| `glowLayers`              | `Array<GlowLayerConfig>`           | `[]`     | **The modern, recommended way to define glows.** An array of layer configuration objects.                 |
| `style`                   | `StyleProp<ViewStyle>`             | -        | Style for the outermost container view.                                                                   |

### `GlowLayerConfig` Object

The `glowLayers` prop takes an array of these objects. All properties are optional except `colors`.

| Prop              | Type                                | Default     | Description                                                                                               |
| ----------------- | ----------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------- |
| `colors`          | `string[]`                          | -           | **Required.** Array of colors for the glow gradient.                                                      |
| `glowPlacement`   | `'behind' \| 'inside' \| 'over'`    | `'behind'`  | Where to render the layer: `behind` (classic), `inside` (clipped), or `over` (on top of the child).       |
| `opacity`         | `number`                            | `0.5`       | Opacity of this specific layer (0-1).                                                                     |
| `dotSize`         | `number \| number[]`                | `75`        | Diameter of the orbs. An array (`[min, max]`) creates variable-sized orbs.                                |
| `numberOfOrbs`    | `number`                            | `20`        | The number of orbs to render for this layer.                                                              |
| `inset`           | `number`                            | `15`        | Distance of the glow path from the component edge. Negative values push the path further out.             |
| `speedMultiplier` | `number`                            | `1.0`       | Local speed multiplier for this layer.                                                                    |
| `scaleAmplitude`  | `number`                            | `0`         | How much the orbs "pulse" in size (0 for none).                                                           |
| `scaleFrequency`  | `number`                            | `2.5`       | How fast the orbs pulse.                                                                                  |
| `coverage`        | `number`                            | `1.0`       | Portion of the perimeter covered by orbs (0 to 1). Useful for creating partial glows or "glimmer" effects. |


## 🛠️ Performance Testing

Wondering how a complex glow effect will perform on your target device? The library includes a built-in debugging component that you can easily drop into your app.

It runs an automated test, increasing the number of glow "orbs" and plotting the frames per second (FPS) on a graph.

**Usage:**

```jsx
import { GlowDebugger } from 'react-native-animated-glow/debug';

// Define the preset you want to test
const getMyPreset = (orbCount) => ({
  glowLayers: [{ colors: ['#ff00ff'], numberOfOrbs: orbCount }]
});

function MyTestScreen() {
  return <GlowDebugger getPresetForOrbs={getMyPreset} />;
}
```

### Legacy Props

For full backward compatibility, the original V1 props (`outerGlow...` and `innerGlow...`) are still supported. If the `glowLayers` prop is not provided, the component will construct layers from these props automatically.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on our [GitHub repository](https://github.com/realimposter/react-native-animated-glow).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/realimposter/react-native-animated-glow/blob/main/LICENSE) file for details.
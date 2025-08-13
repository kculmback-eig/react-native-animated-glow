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

A highly customizable, performant, animated glow effect component for React Native, built with the built-in Animated API.

## ✨ Live Demo & Builder

**Check out the official interactive showcase and documentation at [reactnativeglow.com](https://reactnativeglow.com)!**

Build your perfect glow effect with the live editor, browse tutorials, and copy the settings directly into your project.

## Features

-   **Simple & Performant:** Built with the core `Animated` API for smooth animations. No complex dependencies like Reanimated needed.
-   **Multi-Layer Effects:** Stack multiple `glowLayers` for complex and beautiful effects like the Apple Intelligence UI.
-   **Flexible Glow Placement:** Render glows `behind` (classic), `inside` (clipped), or `over` your component.
-   **Animated Gradient Borders:** Pass an array of colors to `borderColor` for a beautiful, rotating gradient outline.
-   **Organic Effects:** Use arrays for `dotSize` and the `stretch` property to create non-uniform, natural-looking glows.
-   **Easy to Use:** Wrap any component in `<AnimatedGlow>` and configure it with a simple, typed `preset` object.

## Installation

```bash
npm install react-native-animated-glow
```

### Peer Dependency

For the animated gradient border feature, this library relies on `react-native-svg`. You must install it and follow its setup instructions.

```bash
npm install react-native-svg
```

-   [React Native SVG Installation Guide](https://github.com/react-native-svg/react-native-svg#installation)

That's it! No Babel plugin or other complex configuration is required.

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
        // A classic outer glow with variable orb sizes
        {
          colors: ['#00FFFF', '#FF00FF'],
          dotSize: [40, 100], 
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

### Creating a Preset (Recommended)

For the best developer experience with type safety and autocomplete, define your styles in a separate object using the `PresetConfig` type.

```typescript
// in my-presets.ts
import { type PresetConfig } from 'react-native-animated-glow';

export const iceKing: PresetConfig = {
  cornerRadius: 10,
  outlineWidth: 1,
  borderColor: '#E0FFFF',
  glowLayers: [
    { colors: ['#00BFFF', '#87CEEB'], opacity: 0.5 },
    { colors: ['#FFFFFF', '#AFEEEE'], glowPlacement: 'inside' }
  ]
};
```

### Using a Preset

Import your preset and pass it to the `preset` prop. This keeps your component code clean and your styles reusable.

```jsx
// in MyButton.tsx
import AnimatedGlow from 'react-native-animated-glow';
import { iceKing } from './my-presets';
import { Text, TouchableOpacity } from 'react-native';

function IceButton() {
  return (
    <AnimatedGlow preset={iceKing}>
      <TouchableOpacity style={{ padding: 20, backgroundColor: '#6495ED' }}>
        <Text style={{ color: 'white', fontSize: 24 }}>❄️</Text>
      </TouchableOpacity>
    </AnimatedGlow>
  );
}
```

## Props API

| Prop                      | Type                               | Default       | Description                                                                                               |
| ------------------------- | ---------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------- |
| `children`                | `ReactNode`                        | -             | **Required.** The component to wrap.                                                                      |
| `preset`                  | `PresetConfig`                     | `{}`          | A preset object containing default values for any of the props.                                           |
| `isVisible`               | `boolean`                          | `true`        | Controls whether the animations are active. Set to `false` to pause all animations for performance.       |
| `engine`                  | `'image' \| 'svg'`                 | `'image'`     | Orb rendering engine. `image` (default) is a performant PNG, `svg` uses a radial gradient.                |
| `cornerRadius`            | `number`                           | `10`          | Border radius of the child wrapper; defines the glow path.                                                |
| `outlineWidth`            | `number`                           | `2`           | The width of the visible border.                                                                          |
| `borderColor`             | `string \| string[]`               | `'white'`     | The color of the border. Can be an array of colors to create an animated gradient border.                 |
| `backgroundColor`         | `string`                           | `'transparent'` | The background color inside the border. Sits behind the child.                                            |
| `animationSpeed`          | `number`                           | `0.7`         | A master speed control for all layers. Higher is faster.                                                  |
| `borderSpeedMultiplier`   | `number`                           | `1.0`         | Controls the animation speed of the gradient border, independent of `animationSpeed`.                     |
| `randomness`              | `number`                           | `0.01`        | Adds slight randomness to orb starting positions for a more organic look.                                 |
| `glowLayers`              | `Array<Partial<GlowLayerConfig>>`  | `[]`          | **The recommended way to define glows.** An array of layer configuration objects.                         |
| `style`                   | `StyleProp<ViewStyle>`             | -             | Style for the outermost container view.                                                                   |

### `GlowLayerConfig` Object

The `glowLayers` prop takes an array of these objects. All properties are optional except `colors`.

| Prop              | Type                               | Default      | Description                                                                                               |
| ----------------- | ---------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------- |
| `colors`          | `string[]`                         | -            | **Required.** Array of colors for the glow gradient.                                                      |
| `glowPlacement`   | `'behind' \| 'inside' \| 'over'`   | `'behind'`   | Where to render the layer: `behind` (classic), `inside` (clipped), or `over` (on top of the child).       |
| `opacity`         | `number`                           | `0.5`        | Opacity of this specific layer (0-1).                                                                     |
| `dotSize`         | `number \| number[]`               | `75`         | Diameter of the orbs. An array (`[min, max]`) creates variable-sized orbs.                                |
| `stretch`         | `number`                           | `1.0`        | Stretches the orbs horizontally, creating an oval shape. `1.0` is a circle.                               |
| `numberOfOrbs`    | `number`                           | `20`         | The number of orbs to render for this layer.                                                              |
| `inset`           | `number`                           | `15`         | Distance of the glow path from the component edge. Negative values push the path further out.             |
| `speedMultiplier` | `number`                           | `1.0`        | Local speed multiplier for this layer.                                                                    |
| `scaleAmplitude`  | `number`                           | `0`          | How much the orbs "pulse" in size (0 for none).                                                           |
| `scaleFrequency`  | `number`                           | `2.5`        | How fast the orbs pulse.                                                                                  |
| `coverage`        | `number`                           | `1.0`        | Portion of the perimeter covered by orbs (0 to 1). Useful for partial glows or "glimmer" effects.         |

## 🛠️ Performance Testing

The library includes a built-in debugging component that you can easily drop into your app to test how a complex glow effect will perform on your target device. It runs an automated test, increasing the number of glow orbs and plotting the frames per second (FPS) on a graph.

**Usage:**

```jsx
// Import from the 'debug' entry point to avoid bloating your production bundle
import { GlowDebugger } from 'react-native-animated-glow/debug';

// Define a function that returns the preset you want to test
const getMyPreset = (orbCount) => ({
  glowLayers: [{ colors: ['#ff00ff'], numberOfOrbs: orbCount, dotSize: 100 }]
});

function MyTestScreen() {
  return <GlowDebugger getPresetForOrbs={getMyPreset} />;
}
```

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on our [GitHub repository](https://github.com/realimposter/react-native-animated-glow).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/realimposter/react-native-animated-glow/blob/main/LICENSE) file for details.
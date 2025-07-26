# React Native Animated Glow Wrapper

<div align="center">

[![NPM Version](https://img.shields.io/npm/v/react-native-animated-glow-wrapper.svg)](https://www.npmjs.com/package/react-native-animated-glow-wrapper)
[![NPM License](https://img.shields.io/npm/l/react-native-animated-glow-wrapper.svg)](https://github.com/realimposter/react-native-animated-glow-wrapper/blob/main/LICENSE)
[![NPM Downloads](https://img.shields.io/npm/dt/react-native-animated-glow-wrapper.svg)](https://www.npmjs.com/package/react-native-animated-glow-wrapper)

</div>

![React Native Animated Glow Wrapper Demo](https://raw.githubusercontent.com/realimposter/react-native-animated-glow-wrapper/main/assets/react-native-glow-demo.gif)

A fully customizable, performant, animated glow effect wrapper for any React Native component, powered by Reanimated 2 and SVG.

## Features

-   **Highly Performant:** All animations run on the native UI thread thanks to React Native Reanimated.
-   **Fully Customizable:** Control colors, speed, size, opacity, shape, and more for two independent glow layers.
-   **Preset System:** Easily apply complex styles by passing a simple preset object.
-   **Easy to Use:** Wrap any component in `<AnimatedGlowWrapper>` to apply the effect instantly.
-   **Lightweight:** No heavy dependencies outside of Reanimated and SVG.

## Installation

```bash
npm install react-native-animated-glow-wrapper
```

or

```bash
yarn add react-native-animated-glow-wrapper
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

```jsx
import AnimatedGlowWrapper from 'react-native-animated-glow-wrapper';
import { Text, View } from 'react-native';

function MyComponent() {
  return (
    <AnimatedGlowWrapper>
      <View style={{ padding: 20 }}>
        <Text>I'm Glowing!</Text>
      </View>
    </AnimatedGlowWrapper>
  );
}
```

### Using a Preset

The real power comes from using presets. You can define your own or use our official preset packs.

```jsx
import AnimatedGlowWrapper from 'react-native-animated-glow-wrapper';
import { glowPresetsPro } from './path/to/your/presets'; // Your local preset file

function HotFlameButton() {
  return (
    <AnimatedGlowWrapper preset={glowPresetsPro.hotFlame}>
      <Text>🔥</Text>
    </AnimatedGlowWrapper>
  );
}
```

### Overriding a Preset

You can easily override any value from a preset by passing it as a prop.

```jsx
<AnimatedGlowWrapper
  preset={glowPresetsPro.hotFlame}
  animationSpeed={5} // Makes the animation much faster
  borderColor="cyan"
>
  <Text>Fast Flame!</Text>
</AnimatedGlowWrapper>
```

## Presets

We offer preset packs to get you started with stunning effects out of the box.

-   🎁 **[Free Preset Pack](https://github.com/realimposter/react-native-animated-glow-wrapper/tree/main/products/free-presets)**: A set of hand-crafted presets to get you started. *(Coming soon!)*
-   💎 **[Premium Preset Pack](https://reactnativeglow.lemonsqueezy.com/)**: Unlock over 20 professional, high-impact presets for just $9.99! Get effects like "Vaporwave," "Showtime," "Siren," and more.

## Props API

All props are optional except for `children`. You can mix and match them to create unique effects or override values from a `preset`.

| Prop                        | Type                | Default                            | Description                                                              |
| --------------------------- | ------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `children`                  | `node`              | **Required**                       | The component(s) to wrap.                                                |
| `preset`                    | `object`            | `{}`                               | A style preset object. Overridden by other props.                        |
| `style`                     | `object` or `array` | `{}`                               | Custom style for the main container.                                     |
| `cornerRadius`              | `number`            | `10`                               | The corner radius of the border and the glow path.                       |
| `outlineWidth`              | `number`            | `2`                                | The width of the visible border. Set to `0` to hide.                     |
| `borderColor`               | `string`            | `'white'`                          | The color of the visible border.                                         |
| `animationSpeed`            | `number`            | `0.7`                              | The base speed of the animation. Higher is faster.                       |
| `randomness`                | `number`            | `0.01`                             | A factor (0-1) for how much each orb's position is randomized.           |
| **Outer Glow**              |                     |                                    | _Props for the outer, larger glow layer._                                |
| `outerGlowColors`           | `arrayOf(string)`   | `['#00FFFF', '#FF00FF', '#FFFF00']` | Array of colors for the outer glow gradient.                             |
| `outerGlowOpacity`          | `number`            | `0.15`                             | Opacity of the outer glow layer.                                         |
| `outerGlowDotSize`          | `number`            | `100`                              | The size of each orb in the outer glow.                                  |
| `outerGlowNumberOfOrbs`     | `number`            | `20`                               | The number of orbs in the outer glow. Set to 0 to disable.               |
| `outerGlowInset`            | `number`            | `15`                               | How far from the border the outer glow path is inset.                    |
| `outerGlowSpeedMultiplier`  | `number`            | `1.0`                              | Multiplier for the orb movement speed for this layer.                    |
| `outerGlowScaleAmplitude`   | `number`            | `0`                                | The magnitude of the orb size pulsation (0 for no pulsation).            |
| `outerGlowScaleFrequency`   | `number`            | `2.5`                              | How fast the orbs pulsate in size.                                       |
| **Inner Glow**              |                     |                                    | _Props for the inner, more subtle glow layer._                           |
| `innerGlowColors`           | `arrayOf(string)`   | `['#00FFFF', '#FF00FF', '#FFFF00']` | Array of colors for the inner glow gradient.                             |
| `innerGlowOpacity`          | `number`            | `0.3`                              | Opacity of the inner glow layer.                                         |
| `innerGlowDotSize`          | `number`            | `50`                               | The size of each orb in the inner glow.                                  |
| `innerGlowNumberOfOrbs`     | `number`            | `20`                               | The number of orbs in the inner glow. Set to 0 to disable.               |
| `innerGlowInset`            | `number`            | `15`                               | How far from the border the inner glow path is inset.                    |
| `innerGlowSpeedMultiplier`  | `number`            | `1.0`                              | Multiplier for the orb movement speed for this layer.                    |
| `innerGlowScaleAmplitude`   | `number`            | `0`                                | The magnitude of the orb size pulsation (0 for no pulsation).            |
| `innerGlowScaleFrequency`   | `number`            | `2.5`                              | How fast the orbs pulsate in size.                                       |

## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to improve the library, please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/realimposter/react-native-animated-glow-wrapper).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/realimposter/react-native-animated-glow-wrapper/blob/main/LICENSE) file for details.
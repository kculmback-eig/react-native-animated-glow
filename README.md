# React Native Animated Glow Wrapper

![React Native Animated Glow Wrapper Demo](https://raw.githubusercontent.com/YOUR_USERNAME/react-native-animated-glow-wrapper/main/.github/assets/react-native-glow-demo.gif)

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

function MyComponent() {
  return (
    <AnimatedGlowWrapper>
      <Text>I'm Glowing!</Text>
    </AnimatedGlowWrapper>
  );
}
```

### Using a Preset

The real power comes from using presets. You can define your own or use our official preset packs.

```jsx
import AnimatedGlowWrapper from 'react-native-animated-glow-wrapper';
import { myPresets } from './my-presets'; // Your local preset file

function HotFlameButton() {
  return (
    <AnimatedGlowWrapper preset={myPresets.hotFlame}>
      <Text>🔥</Text>
    </AnimatedGlowWrapper>
  );
}
```

### Overriding a Preset

You can easily override any value from a preset by passing it as a prop.

```jsx
<AnimatedGlowWrapper
  preset={myPresets.hotFlame}
  animationSpeed={5} // Makes the animation much faster
  borderColor="cyan"
>
  <Text>Fast Flame!</Text>
</AnimatedGlowWrapper>
```

## Presets

We offer preset packs to get you started with stunning effects out of the box.

-   🎁 **[Free Preset Pack](https://reactnativeglow.lemonsqueezy.com/)**: A set of 3 hand-crafted presets to get you started.
-   💎 **[Premium Preset Pack](https://reactnativeglow.lemonsqueezy.com/)**: Unlock over 20 professional, high-impact presets for just $9.99! Get effects like "Vaporwave," "Showtime," "Siren," and more.

## Props API

| Prop                      | Type                               | Default                                | Description                                                              |
| ------------------------- | ---------------------------------- | -------------------------------------- | ------------------------------------------------------------------------ |
| `children`                | `node`                             | **Required**                           | The component(s) to wrap.                                                |
| `preset`                  | `object`                           | `{}`                                   | A style preset object. Overridden by other props.                        |
| `style`                   | `object` or `array`                | `{}`                                   | Custom style for the container.                                          |
| `cornerRadius`            | `number`                           | `10`                                   | The corner radius of the border and the glow path.                       |
| `outlineWidth`            | `number`                           | `2`                                    | The width of the visible border.                                         |
| `borderColor`             | `string`                           | `'white'`                              | The color of the visible border.                                         |
| `animationSpeed`          | `number`                           | `0.7`                                  | The base speed of the animation. Higher is faster.                       |
| `randomness`              | `number`                           | `0.01`                                 | A factor (0-1) for how much each orb's position is randomized.           |
| **Outer Glow**            |                                    |                                        |                                                                          |
| `outerGlowColors`         | `arrayOf(string)`                  | `['#00FFFF', '#FF00FF', '#FFFF00']`     | Array of colors for the outer glow gradient.                             |
| `outerGlowOpacity`        | `number`                           | `0.15`                                 | Opacity of the outer glow layer.                                         |
| `outerGlowDotSize`        | `number`                           | `100`                                  | The size of each orb in the outer glow.                                  |
| `outerGlowNumberOfOrbs`   | `number`                           | `20`                                   | The number of orbs in the outer glow. Set to 0 to disable.               |
| `outerGlowInset`          | `number`                           | `15`                                   | How far from the border the outer glow path is inset.                    |
| **Inner Glow**            |                                    |                                        |                                                                          |
| `innerGlowColors`         | `arrayOf(string)`                  | `['#00FFFF', '#FF00FF', '#FFFF00']`     | Array of colors for the inner glow gradient.                             |
| `innerGlowOpacity`        | `number`                           | `0.3`                                  | Opacity of the inner glow layer.                                         |
| `innerGlowDotSize`        | `number`                           | `50`                                   | The size of each orb in the inner glow.                                  |
| `innerGlowNumberOfOrbs`   | `number`                           | `20`                                   | The number of orbs in the inner glow. Set to 0 to disable.               |
| `innerGlowInset`          | `number`                           | `15`                                   | How far from the border the inner glow path is inset.                    |
| *...and all other multiplier/amplitude/frequency props* |

## License

MIT
```
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

A fully customizable, performant, animated glow effect wrapper for any React Native component, powered by Reanimated 2 and SVG.

## ✨ Live Demo & Builder

**Check out the official interactive showcase and documentation at [reactnativeglow.com](https://reactnativeglow.com)!**

Build your perfect glow effect with the live editor, browse tutorials, and copy the settings directly into your project.

## Features

-   **Highly Performant:** All animations run on the native UI thread thanks to React Native Reanimated.
-   **Fully Customizable:** Control colors, speed, size, opacity, shape, and more for two independent glow layers.
-   **Extensive Presets:** Comes with 20+ professionally designed presets like "Hot Flame", "Vaporwave", and "Neon Green" to get you started instantly.
-   **Easy to Use:** Wrap any component in `<AnimatedGlow>` to apply the effect.
-   **Lightweight:** No heavy dependencies outside of Reanimated and SVG.

## Installation

```bash
npm install react-native-animated-glow
```

or

```bash
yarn add react-native-animated-glow
```

### Peer Dependencies

This library relies on `react-native-reanimated` and `react-native-svg`. You must install them and follow their respective setup instructions. This is the most common source of issues!

```bash
npm install react-native-reanimated react-native-svg
```

-   [React Native Reanimated Installation Guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation)
-   [React Native SVG Installation Guide](https://github.com/react-native-svg/react-native-svg#installation)

For a complete walkthrough, check out the [Installation Guide](https://reactnativeglow.com) on our docs site.

## Usage

### Basic Example

```jsx
import AnimatedGlow from 'react-native-animated-glow';
import { Text, View } from 'react-native';

function MyComponent() {
  return (
    <AnimatedGlow>
      <View style={{ padding: 20, backgroundColor: '#222' }}>
        <Text style={{ color: 'white' }}>I'm Glowing!</Text>
      </View>
    </AnimatedGlow>
  );
}
```

### Using a Preset

The real power comes from using presets. The included preset file can be found in the demo app source code.

```jsx
import AnimatedGlow from 'react-native-animated-glow';
import { glowPresetsPro } from './path/to/your/presets'; // Get presets from the demo app

function HotFlameButton() {
  return (
    <AnimatedGlow preset={glowPresetsPro.hotFlame} cornerRadius={50}>
      <Text style={{ fontSize: 40, padding: 20 }}>🔥</Text>
    </AnimatedGlow>
  );
}
```

### Overriding a Preset

You can easily override any value from a preset by passing it as a prop.

```jsx
<AnimatedGlow
  preset={glowPresetsPro.hotFlame}
  animationSpeed={5} // Makes the animation much faster
  borderColor="cyan"
>
  <Text>Fast Flame!</Text>
</AnimatedGlow>
```

## Props API

All props are optional except for `children`. You can mix and match them to create unique effects or override values from a `preset`. For a full breakdown, please see the [interactive docs](https://reactnativeglow.com).

| Prop                    | Type              | Default                            |
| ----------------------- | ----------------- | ---------------------------------- |
| `children`              | `node`            | **Required**                       |
| `preset`                | `object`          | `{}`                               |
| `cornerRadius`          | `number`          | `10`                               |
| `outlineWidth`          | `number`          | `2`                                |
| `borderColor`           | `string`          | `'white'`                          |
| `animationSpeed`        | `number`          | `0.7`                              |
| `outerGlowColors`       | `arrayOf(string)` | `['#00FFFF', '#FF00FF', '#FFFF00']` |
| `innerGlowColors`       | `arrayOf(string)` | `['#00FFFF', '#FF00FF', '#FFFF00']` |
| _...and many more!_     |                   |                                    |


## Contributing

Contributions are welcome! If you have a feature request, bug report, or want to improve the library, please feel free to open an issue or submit a pull request on our [GitHub repository](https://github.com/realimposter/react-native-animated-glow).

If you like the library, please give it a star ⭐ on GitHub! It helps a lot.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/realimposter/react-native-animated-glow/blob/main/LICENSE) file for details.
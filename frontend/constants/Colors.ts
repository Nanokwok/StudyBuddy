/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#3A63ED';
const tintColorDark = '#3A63ED';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#1f1f1f',
    background: '#fff',
    tint: tintColorDark,
    icon: '#7d7d7d',
    tabIconDefault: '#7d7d7d',
    tabIconSelected: tintColorDark,
  },
};

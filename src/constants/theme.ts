/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Texto
    text: "#111827",
    textSecondary: "#6B7280",

    // Fondos
    background: "#FFFFFF",
    backgroundElement: "#F5F3FF",
    backgroundSelected: "#EDE9FE",

    // Marca
    primary: "#7C3AED",
    primarySoft: "#DDD6FE",
    border: "#E9D5FF",
  },

  dark: {
    // Texto
    text: "#F9FAFB",
    textSecondary: "#C7C9D1",

    // Fondos (más contraste entre ellos)
    background: "#18181B",          // Fondo principal (gris muy oscuro con toque morado)
    backgroundElement: "#27272F",   // Tarjetas, inputs, botones
    backgroundSelected: "#37205F",  // Item seleccionado del Drawer

    // Marca
    primary: "#A855F7",             // Morado principal un poco más vivo
    primarySoft: "#9333EA",         // Glow/Fondo activo
    border: "#5B2AA8",              // Bordes visibles pero sutiles
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

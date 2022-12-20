import { computed, signal, useSignalEffect } from "@preact/signals-react";
import React, {
  ComponentType,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Dimensions,
  StyleProp,
  TextProps,
  Text,
  View,
  ViewProps,
  Pressable,
  PressableProps,
  TextInput,
  TextInputProps,
  ViewStyle,
  Appearance,
} from "react-native";

export const isFunction = (x: unknown): x is Function =>
  typeof x === "function";

export const defaultBreakpoints = signal([576, 768, 992, 1200] as const);

const windowWidth = signal(Dimensions.get("window").width);
const windowHeight = signal(Dimensions.get("window").height);

Dimensions.addEventListener("change", ({ window }) =>
  requestAnimationFrame(() => {
    windowWidth.value = window.width;
    windowHeight.value = window.height;
  })
);
Appearance.addChangeListener(({ colorScheme }) =>
  requestAnimationFrame(() => {
    theme.value = colorScheme === "dark" ? darkTheme : lightTheme;
  })
);

export const currentBreakpointIndex = computed(() => {
  const w = windowWidth.value;
  const b = defaultBreakpoints.value;
  return w >= b[3] ? 4 : w >= b[2] ? 3 : w >= b[1] ? 2 : w >= b[0] ? 1 : 0;
});

export function responsiveStyle<T>(
  base: StyleProp<T>,
  sm?: StyleProp<T>,
  md?: StyleProp<T>,
  lg?: StyleProp<T>,
  xl?: StyleProp<T>
) {
  return ([base, sm, md, lg, xl][currentBreakpointIndex.value] ?? base) as T;
}

export const SIZES = {
  s2: 2,
  s4: 4,
  s8: 8,
  s12: 12,
  s16: 16,
  s20: 20,
  s24: 24,
  s32: 32,
  s40: 40,
  s48: 48,
  s480: 480,
  s576: 576,
  s768: 768,
  s1024: 1024,
} as const;

const darkThemeColors = {
  background: "#0e172a",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textBorder: "",
  buttonPrimaryText: "#e2e8f0",
  buttonPrimaryBackground: "#0ea5e9",
  buttonPrimaryBackgroundPressed: "#00a509",
  buttonPrimaryBackgroundLoading: "#4b5563",
  buttonPrimaryBackgroundDisabled: "#4b5563",
};

const textBase = {
  color: darkThemeColors.textPrimary,
};

export const TEXT_VARIANTS = {
  xs: {
    ...textBase,
    fontSize: 12,
    lineHeight: 16,
  },
  sm: {
    ...textBase,
    fontSize: 14,
    lineHeight: 20,
  },
  md: {
    ...textBase,
    fontSize: 16,
    lineHeight: 24,
  },
  lg: {
    ...textBase,
    fontSize: 18,
    lineHeight: 28,
  },
  xl: {
    ...textBase,
    fontSize: 20,
    lineHeight: 28,
  },
  xl2: {
    ...textBase,
    fontSize: 24,
    lineHeight: 32,
  },
} as const;

const darkTheme = {
  size: SIZES,
  textVariant: TEXT_VARIANTS,
  color: darkThemeColors,
  border: {
    small: {
      borderWidth: 1,
      borderRadius: SIZES.s8,
    } as ViewStyle,
  },
};

const lightThemeColors = {
  textPrimary: "#000",
  textSecondary: "#444",
  background: "#ffffff",
  buttonPrimaryText: "#fff",
  buttonPrimaryBackground: "#4f46e5",
  buttonPrimaryBackgroundPressed: "#00ff0f",
  buttonPrimaryBackgroundLoading: "#4b5563",
  buttonPrimaryBackgroundDisabled: "#4b5563",
};

const lightTheme = {
  size: SIZES,
  textVariant: TEXT_VARIANTS,
  color: lightThemeColors,
  border: {
    small: {
      borderWidth: 1,
      borderRadius: SIZES.s8,
    } as ViewStyle,
  },
};

const selectedColorSheme = signal(Appearance.getColorScheme());

const theme = signal(
  selectedColorSheme.value === "dark" ? darkTheme : lightTheme
);
selectedColorSheme.subscribe((value) => {
  theme.value = value === "dark" ? darkTheme : lightTheme;
});

export type Theme = typeof theme["value"];

export const useTheme = () => {
  return theme;
};

export const WindowDimensions = { windowWidth, windowHeight };

export const toggleTheme = () => {
  selectedColorSheme.value =
    selectedColorSheme.value === "dark" ? "light" : "dark";
};

export type SX<T extends { style?: StyleProp<any> }> =
  | ((args: {
      t: typeof theme["value"];
      r: typeof responsiveStyle;
      d: typeof WindowDimensions;
    }) => StyleProp<T["style"]>)
  | StyleProp<T["style"]>;

export function useReactiveStyle<T extends { style?: StyleProp<any> }>(
  innerRef: React.RefObject<{
    setNativeProps: (arg: { style: StyleProp<T> }) => void;
  }>,
  sx?: SX<T>,
  ref?: React.RefObject<{
    setNativeProps: (arg: { style: StyleProp<T> }) => void;
  }>
) {
  const theme = useTheme();
  const style = useRef<StyleProp<T["style"]>>();

  useSignalEffect(() => {
    if (!sx) return;
    style.current = isFunction(sx)
      ? sx({ t: theme.value, r: responsiveStyle, d: WindowDimensions })
      : sx;
    innerRef.current?.setNativeProps({
      style: style.current,
    });
  });

  useImperativeHandle(ref, () => ({
    setNativeProps: (obj: { style: StyleProp<T> }) =>
      innerRef.current?.setNativeProps?.({
        ...obj,
        style: [style.current, obj?.style],
      }),
  }));
}

export function createStyledComponent<
  T extends { style?: StyleProp<any>; children?: any }
>(Comp: ComponentType<T>) {
  return React.memo(
    forwardRef<
      any,
      T & {
        sx?: SX<T>;
      }
    >((props, ref) => {
      if (!props.sx) return <Comp ref={ref} {...props} />;
      const innerRef = useRef<ComponentType<T>>(null);
      useReactiveStyle(innerRef as any, props.sx, ref as any);
      return <Comp ref={innerRef} {...props} />;
    }),
    ({ children }, { children: nextChildren }) => children === nextChildren
  );
}

export const StyledView = createStyledComponent<ViewProps>(View);
export const StyledText = createStyledComponent<TextProps>(Text);
export const StyledPressable = createStyledComponent<PressableProps>(Pressable);
export const StyledTextInput = createStyledComponent<TextInputProps>(TextInput);

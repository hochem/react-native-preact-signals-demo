import { signal, useSignalEffect } from "@preact/signals-react";
import React from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyledView, WindowDimensions } from "../theme";
import { Stack } from "./Stack";
import { Text } from "./Text";

const useSharedWindowDimensions = () => {
  const windowWidth = useSharedValue(WindowDimensions.windowWidth.peek());
  useSignalEffect(() => {
    windowWidth.value = WindowDimensions.windowWidth.value;
  });
  const windowHeight = useSharedValue(WindowDimensions.windowHeight.peek());
  useSignalEffect(() => {
    windowHeight.value = WindowDimensions.windowHeight.value;
  });
  return { windowWidth, windowHeight };
};

const navSignal = signal<boolean>(false);

export const useNav = () => ({
  toggleNav: () => (navSignal.value = !navSignal.peek()),
});

export const Nav: React.FC<{}> = React.memo(
  ({ children: _ }) => {
    console.log("Nav");

    const opacity = useSharedValue(0);
    const width = useSharedValue(-WindowDimensions.windowWidth.peek() / 3);
    const { windowWidth, windowHeight } = useSharedWindowDimensions();
    const animatedStyle = useAnimatedStyle(
      () => ({
        position: "absolute",
        opacity: opacity.value,
        width: windowWidth.value / 4,
        height: windowHeight.value,
        transform: [{ translateX: width.value }],
      }),
      [opacity]
    );

    useSignalEffect(() => {
      opacity.value = withTiming(navSignal.value ? 1 : 0, { duration: 1000 });
      width.value = withTiming(
        navSignal.value ? 0 : -WindowDimensions.windowWidth.peek() / 3,
        { duration: 1000 }
      );
    });

    return (
      <Animated.View style={animatedStyle}>
        <StyledView
          sx={({ t, d }) => ({
            paddingVertical: t.size.s48,
            height: d.windowHeight.value,
            backgroundColor: "#4f46e5",
            padding: t.size.s16,
          })}
        >
          <Stack space={"s4"}>
            <Text variant="lg">Nav</Text>
            <Text variant="md">Item 1</Text>
            <Text variant="md">Item 2</Text>
          </Stack>
        </StyledView>
      </Animated.View>
    );
  },
  (p, n) => p.children === n.children
);

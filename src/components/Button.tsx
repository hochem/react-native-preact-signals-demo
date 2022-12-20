import { Signal, useSignal, useSignalEffect } from "@preact/signals-react";
import React, { useRef } from "react";
import { PressableProps, View } from "react-native";
import { StyledPressable, StyledText, Theme } from "../theme";

export const Button = React.memo(
  ({
    signals,
    ...props
  }: PressableProps & {
    label: string;
    onPress: () => void;
  } & {
    signals?: {
      disabled?: Signal<boolean>;
      loading?: Signal<boolean>;
    };
  }) => {
    console.log("Button");

    const ref = useRef<View>(null);
    const $pressed = useSignal(false);

    useSignalEffect(() => {
      ref.current?.setNativeProps({
        disabled: signals?.loading?.value || signals?.disabled?.value,
      });
    });

    return (
      <StyledPressable
        {...props}
        ref={ref}
        onPressIn={() => ($pressed.value = true)}
        onPressOut={() => ($pressed.value = false)}
        sx={({ t }: { t: Theme }) => ({
          ...t.border.small,
          cursor: signals?.loading?.value ? "progress" : "pointer",
          backgroundColor:
            signals?.loading?.value || signals?.disabled?.value
              ? t.color.buttonPrimaryBackgroundLoading
              : $pressed.value
              ? t.color.buttonPrimaryBackgroundPressed
              : t.color.buttonPrimaryBackground,
          padding: t.size.s12,
        })}
      >
        <StyledText
          sx={({ t }) => ({
            color: t.color.buttonPrimaryText,
            textAlign: "center",
          })}
        >
          {props?.label}
        </StyledText>
      </StyledPressable>
    );
  },
  () => true
);

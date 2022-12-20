import React, { useRef } from "react";
import { StyledText, StyledTextInput, StyledView } from "../theme";
import { TextInputProps, TextInput as RNTextInput } from "react-native";
import { Signal, useSignal, useSignalEffect } from "@preact/signals-react";

export const TextInput = React.memo(
  ({
    signals,
    label,
    prefix,
    style,
    ...props
  }: TextInputProps & {
    label: string;
    prefix?: string;
    signals?: {
      text?: Signal<string>;
    };
  }) => {
    console.log("TextInput");

    const $focused = useSignal(false);

    const ref = useRef<RNTextInput>(null);

    useSignalEffect(() => {
      ref.current?.setNativeProps({
        text: signals?.text?.value ?? "",
      });
    });

    return (
      <>
        <StyledText
          sx={({ t }) => ({
            color: $focused.value ? t.color.textPrimary : t.color.textSecondary,
          })}
        >
          {label}
        </StyledText>
        <StyledView
          sx={({ t }) => ({
            ...t.border.small,
            padding: t.size.s4,
            marginTop: t.size.s8,
          })}
        >
          {!!prefix && (
            <StyledView>
              <StyledText>{prefix}</StyledText>
            </StyledView>
          )}
          <StyledTextInput
            {...props}
            ref={ref}
            sx={({ t }) => ({ color: t.color.textPrimary, padding: t.size.s8 })}
            onFocus={() => ($focused.value = true)}
            onBlur={() => ($focused.value = false)}
          />
        </StyledView>
      </>
    );
  },
  () => true
);

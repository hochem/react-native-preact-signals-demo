import React from "react";
import { StyledText, SX } from "../theme";
import { TextProps } from "react-native";
import { Signal } from "@preact/signals-react";

export const Label = React.memo(
  ({
    props,
  }: {
    props: {
      text: Signal<string>;
    } & { sx?: SX<TextProps> };
  }) => {
    console.log("Label");

    return <StyledText sx={props.sx}>{props.text.value}</StyledText>;
  },
  () => true
);

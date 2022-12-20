import React from "react";
import { TextProps } from "react-native";
import { StyledText, SX, Theme } from "../theme";

type Props = TextProps & {
  variant?: keyof Theme["textVariant"];
  color?: keyof Theme["color"];
  sx?: SX<TextProps>;
};

export const Text: React.FC<Props> = React.memo(
  ({
    children,
    variant,
    color = "textPrimary" as keyof Theme["color"],
    sx,
    style,
    ...props
  }) => {
    console.log("Text");

    return (
      <StyledText
        sx={({ t, r, d }) => [
          {
            ...(variant ? t.textVariant[variant] : {}),
            color: color ? t.color[color] : undefined,
          },
          style,
          typeof sx === "function" ? sx({ t, r, d }) : undefined,
        ]}
        {...props}
      >
        {children}
      </StyledText>
    );
  },
  ({ children }, { children: nextChildren }) => children === nextChildren
);

import React from "react";
import { ViewProps } from "react-native";
import { StyledView, SIZES, SX } from "../theme";

type Props = ViewProps & {
  space?: keyof typeof SIZES | (keyof typeof SIZES)[];
  direction?: "vertical" | "horizontal";
  sx?: SX<ViewProps>;
};

const Spacer = ({
  direction,
  space,
}: {
  direction: Props["direction"];
  space: NonNullable<Props["space"]>;
}) => (
  <StyledView
    sx={({ t, r }) => ({
      [direction === "horizontal" ? "width" : "height"]:
        typeof space === "string"
          ? SIZES[space]
          : r(
              t.size[space[0]],
              t.size[space[1]],
              t.size[space[2]],
              t.size[space[3]],
              t.size[space[4]]
            ),
    })}
  />
);

export const Stack: React.FC<Props> = React.memo(
  ({ space, direction = "vertical", children, style, ...props }) => {
    console.log("Stack");

    const spacer = space ? (
      <Spacer space={space} direction={direction} />
    ) : null;
    return (
      <StyledView
        style={[
          { flexDirection: direction === "horizontal" ? "row" : "column" },
          style,
        ]}
        {...props}
      >
        {React.Children.toArray(children)
          .filter((c) => !!c)
          .map((item, index, arr) => {
            return (
              <React.Fragment key={index}>
                {item}
                {!!(index < arr.length - 1) && spacer}
              </React.Fragment>
            );
          })}
      </StyledView>
    );
  },
  ({ children }, { children: newChildren }) => children === newChildren
);

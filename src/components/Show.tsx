import React from "react";

export const Show = React.memo(
  ({
    when,
    content,
    fallback,
  }: {
    when: () => boolean;
    content: () => JSX.Element;
    fallback?: any;
  }) => {
    console.log("Show");
    return when() ? content() : fallback ?? null;
  },
  () => true
);

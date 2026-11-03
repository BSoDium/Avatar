import { ComponentProps } from "react";
import colors from "./colors.json";

export type Colors = typeof colors;

export type Options = {
  /** Show the glasses */
  glasses?: boolean;
};

export default function Model({
  glasses = false,
  ...props
}: Colors & Options & ComponentProps<"svg">) {
  const { ...svgProps } = props;
  return <slot />;
}

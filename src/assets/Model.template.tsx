import { ComponentProps } from "react";
import colors from "./colors.json";

export type Colors = typeof colors;

export default function Model(props: Colors & ComponentProps<"svg">) {
  return <slot />;
}

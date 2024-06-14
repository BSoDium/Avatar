import { css } from "@emotion/css";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const roundingOptions = ["circle", "squircle", "square"] as const;
export type Rounding = (typeof roundingOptions)[number];

export function RoundingSelector({
  value,
  onChange,
}: {
  value?: Rounding;
  onChange?: (value: Rounding) => void;
}) {
  return (
    <Tabs
      defaultValue={value}
      className={css`
        width: 100%;
      `}
    >
      <TabsList className="grid w-full grid-cols-3">
        {roundingOptions.map((option) => (
          <TabsTrigger
            key={option}
            value={option}
            onClick={() => onChange?.(option)}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

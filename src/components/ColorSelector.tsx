import { css } from "@emotion/css";
import { Button } from "./ui/button";
import chroma from "chroma-js";
import { useMemo, useRef, useState } from "react";
import { FiLock, FiUnlock } from "react-icons/fi";

export default function ColorSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [lock, setLock] = useState(false);

  const color = useMemo(() => chroma(value), [value]);
  const isDark = useMemo(() => color.luminance() < 0.5, [color]);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: row;
      `}
    >
      <Button
        variant={lock ? "default" : "secondary"}
        size="icon"
        className={css`
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
        `}
        onClick={() => {
          setLock(!lock);
        }}
      >
        {lock ? <FiLock /> : <FiUnlock />}
      </Button>
      <div
        className={css`
          position: relative;
          display: flex;
          flex-direction: row;
        `}
      >
        <Button
          className={css`
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
            background-color: ${value};
            color: ${isDark ? "white" : "black"};
            &:hover {
              background-color: ${color.alpha(0.8).css()};
            }
          `}
          onClick={() => {
            inputRef.current?.click();
          }}
        >
          {value}
        </Button>
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={css`
            position: absolute;
            bottom: -0.2rem;
            left: 0;
            opacity: 0;
            pointer-events: none;
          `}
        />
      </div>
    </div>
  );
}

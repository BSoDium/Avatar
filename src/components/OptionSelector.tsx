import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { css } from "@emotion/css";
import { PiEyeglassesLight } from "react-icons/pi";
import { useEffect, useState } from "react";

export default function OptionSelector() {
  const [showGlasses, setShowGlasses] = useState(false);

  const svg = document.querySelector("svg#model");

  useEffect(() => {
    if (!svg) return;
    const glasses = svg.querySelector("#glasses") as SVGElement | null;
    if (!glasses) return;
    glasses.style.display = showGlasses ? "block" : "none";
  }, [svg, showGlasses]);

  return (
    <div
      className={css`
        display: flex;
        gap: 1rem;
        align-items: center;
        width: 100%;
        justify-content: space-between;
      `}
    >
      <Label
        htmlFor="glasses"
        className={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.9rem;
        `}
      >
        <PiEyeglassesLight className="h-8 w-8" />
        <p
          className={css`
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          `}
        >
          Display glasses
          <span className="text-xs text-muted-foreground">
            Show or hide the glasses on the model
          </span>
        </p>
      </Label>
      <Switch
        id="glasses"
        checked={showGlasses}
        onClick={() => setShowGlasses(!showGlasses)}
      />
    </div>
  );
}

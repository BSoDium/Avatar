import { Colors } from "@/assets/Model";
import chroma from "chroma-js";
import { useEffect, useMemo, useState } from "react";
import { css } from "@emotion/css";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function severity(warningCount: number) {
  if (warningCount === 0) {
    return "low";
  } else if (warningCount < 2) {
    return "moderate";
  } else if (warningCount < 4) {
    return "high";
  } else {
    return "severe";
  }
}

interface Warning {
  type: "contrast" | "brightness";
  title: string;
  message: string;
  colors?: string[];
}

export default function ViolationWatcher(colors: Colors) {
  const [expanded, setExpanded] = useState(false);

  const warnings = useMemo(() => {
    const warnings: Warning[] = [];

    // contrast
    if (chroma.contrast(colors.tonal, colors.background) < 1.2) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Tonal color",
        message: "Tonal color doesn't have enough contrast with the background",
        colors: [colors.tonal, colors.background],
      });
    }
    if (chroma.contrast(colors.secondary, colors.background) < 1.2) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Secondary color",
        message:
          "Secondary color doesn't have enough contrast with the background",
        colors: [colors.secondary, colors.background],
      });
    }
    if (chroma.contrast(colors.primary, colors.background) < 1.2) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Primary color",
        message:
          "Primary color doesn't have enough contrast with the background",
        colors: [colors.primary, colors.background],
      });
    }
    if (chroma.contrast(colors.secondary, colors.primary) < 1) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Secondary color",
        message:
          "Secondary color doesn't have enough contrast with the primary color",
        colors: [colors.secondary, colors.primary],
      });
    }
    if (chroma.contrast(colors.background, "white") < 1.2) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Background color",
        message:
          "Background color doesn't have enough contrast with white elements",
        colors: [colors.background, "white"],
      });
    }
    if (chroma.contrast(colors.tonal, "white") < 1.2) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Tonal color",
        message: "Tonal color doesn't have enough contrast with white elements",
        colors: [colors.tonal, "white"],
      });
    }

    // background brightness
    if (chroma(colors.background).luminance() < 0.7) {
      warnings.push({
        type: "brightness",
        title: "Dark background",
        message: "Background color is too dark",
        colors: [colors.background],
      });
    } else if (chroma(colors.background).luminance() > 0.95) {
      warnings.push({
        type: "brightness",
        title: "Bright background",
        message: "Background color is too bright",
        colors: [colors.background],
      });
    }

    return warnings;
  }, [colors]);

  useEffect(() => {
    setExpanded(false);
  }, [warnings]);

  return warnings.length > 0 ? (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      `}
    >
      <div
        className={`rounded-md border px-2 py-2 ps-4 font-mono text-sm ${css`
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        `}`}
      >
        <span
          className={css`
            display: flex;
            gap: 0.5rem;
          `}
        >
          {warnings.length} warning{warnings.length === 1 ? "" : "s"}
          <Badge
            variant={
              severity(warnings.length) === "severe" ? "destructive" : "default"
            }
          >
            {severity(warnings.length)}
          </Badge>
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      {expanded
        ? warnings.map((warning) => (
            <div
              className={`rounded-md border p-4 ${css`
                display: flex;
                flex-direction: row;
                gap: 0.7rem;
                align-items: center;
              `}`}
              key={`${warning.title}-${warning.colors?.join("-")}`}
            >
              <div
                className={css`
                  display: flex;
                  flex-direction: column;
                  gap: 0.2rem;
                `}
              >
                <h5 className="mb-1 font-medium leading-none tracking-tight">
                  {warning.title}
                </h5>
                <p className="text-sm">{warning.message}</p>
              </div>
              {warning.colors ? (
                <div
                  className={css`
                    position: relative;
                    width: 3rem;
                    height: 3rem;
                    flex-shrink: 0;
                    border-radius: 0.5rem;
                    overflow: hidden;
                  `}
                >
                  <div
                    className={css`
                      position: absolute;
                      top: 12%;
                      left: 12%;
                      width: 100%;
                      height: 150%;
                      border-radius: 0.5rem;
                      background-color: ${warning.colors[0]};
                      transform: translate(-50%, -50%) rotate(45deg);
                    `}
                  />
                  <div
                    className={css`
                      position: absolute;
                      top: 88%;
                      left: 90%;
                      width: 100%;
                      height: 150%;
                      border-radius: 0.5rem;
                      background-color: ${warning.colors[1]};
                      transform: translate(-50%, -50%) rotate(45deg);
                    `}
                  />
                </div>
              ) : null}
            </div>
          ))
        : null}
    </div>
  ) : null;
}

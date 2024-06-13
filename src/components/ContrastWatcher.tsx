import { Colors } from "@/assets/Model";
import chroma from "chroma-js";
import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { css } from "@emotion/css";

interface Warning {
  type: "contrast" | "brightness";
  title: string;
  message: string;
  colors?: string[];
}

export default function ContrastWatcher(colors: Colors) {
  console.log(chroma.contrast(colors.tonal, colors.background));

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
    if (
      chroma.contrast(colors.secondary, colors.background) < 1.2
    ) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Secondary color",
        message:
          "Secondary color doesn't have enough contrast with the background",
        colors: [colors.secondary, colors.background],
      });
    }
    if (
      chroma.contrast(colors.primary, colors.background) < 1.2
    ) {
      warnings.push({
        type: "contrast",
        title: "Low contrast: Primary color",
        message:
          "Primary color doesn't have enough contrast with the background",
        colors: [colors.primary, colors.background],
      });
    }
    if (
      chroma.contrast(colors.secondary, colors.primary) < 1
    ) {
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

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        max-height: 15rem;
        overflow-y: auto;
      `}
    >
      {warnings.map((warning, index) => (
        <Alert key={index}>
          <div
            className={css`
              display: flex;
              align-items: center;
              gap: 0.5rem;
              padding-bottom: 1rem;
            `}
          >
            {warning.colors?.map((color, index) => (
              <div
                key={index}
                className={css`
                  background-color: ${color};
                  width: 2rem;
                  height: 2rem;
                  border-radius: .5rem;
                `}
              />
            ))}
          </div>
          <AlertTitle>{warning.title}</AlertTitle>
          <AlertDescription>{warning.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

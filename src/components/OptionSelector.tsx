import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { css } from "@emotion/css";
import { MouseEvent } from "react";
import { PiEyeglassesLight } from "react-icons/pi";

export default function OptionSelector({
  glasses,
  onGlassesChange,
}: {
  glasses: boolean;
  onGlassesChange: (value: boolean) => void;
}) {
  const easterEgg = (event: MouseEvent) => {
    event.preventDefault(); // the icon sits in the glasses label, do not toggle the switch
    const duration = 4000;
    document.body.style.animation = `degressive-blur ${duration}ms`;
    setTimeout(() => {
      document.body.style.animation = "";
    }, duration);
  };

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
        htmlFor="glasses-switch"
        className={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.9rem;
          cursor: pointer;
        `}
      >
        <PiEyeglassesLight
          className={`h-8 w-8 ${css`
            transition: transform 0.2s;
            &:hover {
              transform: scale(1.1);
            }
          `}`}
          onClick={easterEgg}
        />
        <p
          className={css`
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          `}
          onClick={() => onGlassesChange(!glasses)}
        >
          Display glasses
          <span className="text-xs text-muted-foreground">
            Show or hide the glasses on the model
          </span>
        </p>
      </Label>
      <Switch
        id="glasses-switch"
        checked={glasses}
        onClick={() => onGlassesChange(!glasses)}
      />
    </div>
  );
}

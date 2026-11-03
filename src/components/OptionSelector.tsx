import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { css } from "@emotion/css";
import { MouseEvent, ReactNode } from "react";
import { PiEyeglassesLight, PiMoonLight } from "react-icons/pi";

function Option({
  id,
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
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
        htmlFor={id}
        className={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.9rem;
          cursor: pointer;
        `}
      >
        {icon}
        <p
          className={css`
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
          `}
        >
          {title}
          <span className="text-xs text-muted-foreground">{description}</span>
        </p>
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

const iconClass = `h-8 w-8 ${css`
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.1);
  }
`}`;

export default function OptionSelector({
  glasses,
  onGlassesChange,
  dark,
  onDarkChange,
}: {
  glasses: boolean;
  onGlassesChange: (value: boolean) => void;
  dark: boolean;
  onDarkChange: (value: boolean) => void;
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
        flex-direction: column;
        gap: 1rem;
        width: 100%;
      `}
    >
      <Option
        id="glasses-switch"
        icon={<PiEyeglassesLight className={iconClass} onClick={easterEgg} />}
        title="Display glasses"
        description="Show or hide the glasses on the model"
        checked={glasses}
        onChange={onGlassesChange}
      />
      <Option
        id="dark-switch"
        icon={<PiMoonLight className={iconClass} />}
        title="Dark background"
        description="Generate a dark or a light palette"
        checked={dark}
        onChange={onDarkChange}
      />
    </div>
  );
}

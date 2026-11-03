import "./App.global.scss";
import { ThemeProvider } from "@/components/ThemeProvider";
import { css } from "@emotion/css";
import colors from "@/assets/colors.json";
import { useEffect, useState } from "react";
import Model from "./assets/Model";
import { complete, hairColors, isDark, randomPrimary } from "@/lib/palette";
import {
  Rounding,
  roundingOptions,
  RoundingSelector,
} from "@/components/RoudingSelector";
import ExportSelector from "@/components/ExportSelector";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ColorSelector from "@/components/ColorSelector";
import { useSearchParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import OptionSelector from "@/components/OptionSelector";
import { Button } from "@/components/ui/button";
import { FiShuffle } from "react-icons/fi";
import ViolationWatcher from "@/components/ViolationWatcher";
import Socials from "./components/Socials";

const borderRadii: Record<Rounding, string> = {
  circle: "50%",
  squircle: "30%",
  square: "calc(var(--radius) - 2px)",
};

export default function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Color locks
  const [primaryLock, setPrimaryLock] = useState(false);
  const [secondaryLock, setSecondaryLock] = useState(false);
  const [tonalLock, setTonalLock] = useState(false);
  const [backgroundLock, setBackgroundLock] = useState(false);
  const [hairLock, setHairLock] = useState(true);

  // Color states
  const [primary, setPrimary] = useState(
    searchParams.get("primary") || colors.primary
  );
  const [secondary, setSecondary] = useState(
    searchParams.get("secondary") || colors.secondary
  );
  const [tonal, setTonal] = useState(searchParams.get("tonal") || colors.tonal);
  const [background, setBackground] = useState(
    searchParams.get("background") || colors.background
  );
  const [hair, setHair] = useState(searchParams.get("hair") || colors.hair);

  const [rounding, setRounding] = useState<Rounding>(
    (searchParams.get("rounding") as Rounding) || roundingOptions[0]
  );

  // Options
  const [glasses, setGlasses] = useState(false);
  const [dark, setDark] = useState(isDark(background));

  // Update URL search params
  useEffect(() => {
    searchParams.set("primary", primary);
    searchParams.set("secondary", secondary);
    searchParams.set("tonal", tonal);
    searchParams.set("background", background);
    searchParams.set("hair", hair);
    searchParams.set("rounding", rounding);
    setSearchParams(searchParams);
  }, [
    primary,
    rounding,
    searchParams,
    secondary,
    setSearchParams,
    tonal,
    background,
    hair,
  ]);

  const palette = { primary, secondary, tonal, background, hair };
  const locks = {
    secondary: secondaryLock,
    tonal: tonalLock,
    background: backgroundLock,
    hair: hairLock,
  };

  const apply = (next: typeof palette) => {
    setPrimary(next.primary);
    setSecondary(next.secondary);
    setTonal(next.tonal);
    setBackground(next.background);
    setHair(next.hair);
  };

  // Relational color generation: the other colors follow the shirt and hair colors
  const changePrimary = (value: string) =>
    apply(complete({ ...palette, primary: value }, locks, dark));

  const changeHair = (value: string) =>
    apply(complete({ ...palette, hair: value }, locks, dark));

  const changeDark = (value: boolean) => {
    setDark(value);
    apply(complete(palette, locks, value));
  };

  // Random color generation
  const randomize = () => {
    apply(
      complete(
        {
          ...palette,
          primary: primaryLock ? primary : randomPrimary(),
          hair: hairLock
            ? hair
            : hairColors[Math.floor(Math.random() * hairColors.length)],
        },
        locks,
        dark,
        true
      )
    );
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Toaster />
      <div
        className={css`
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          padding-top: clamp(5rem, 10vw, 8rem);
          padding-bottom: clamp(1rem, 5vw, 4rem);
        `}
      >
        <Socials />
        <div
          className={css`
            display: flex;
            gap: 2rem;
            flex-direction: column;
            align-items: center;
            width: min(90vw, 25rem);
          `}
        >
          <AspectRatio ratio={1}>
            <Model
              {...palette}
              glasses={glasses}
              className={css`
                width: 100%;
                height: 100%;
                transition: border-radius ease 0.2s;
                border-radius: ${borderRadii[rounding]};
              `}
              id="model"
            />
          </AspectRatio>
          <div
            className={css`
              display: flex;
              gap: 1rem;
              width: 100%;
              flex-direction: column;
              align-items: center;
            `}
          >
            <RoundingSelector
              value={rounding}
              onChange={(value) => {
                setRounding(value);
              }}
            />
            <section
              className={css`
                display: flex;
                flex-flow: row wrap;
                justify-content: center;
                width: 100%;
                gap: 0.5rem;
              `}
            >
              <ColorSelector
                value={primary}
                setValue={changePrimary}
                lock={primaryLock}
                setLock={setPrimaryLock}
                label="Shirt"
              />
              <ColorSelector
                value={secondary}
                setValue={setSecondary}
                lock={secondaryLock}
                setLock={setSecondaryLock}
                label="Jacket"
              />
              <ColorSelector
                value={tonal}
                setValue={setTonal}
                lock={tonalLock}
                setLock={setTonalLock}
                label="Skin"
              />
              <ColorSelector
                value={background}
                setValue={setBackground}
                lock={backgroundLock}
                setLock={setBackgroundLock}
                label="Background"
              />
              <ColorSelector
                value={hair}
                setValue={changeHair}
                lock={hairLock}
                setLock={setHairLock}
                label="Hair"
              />
            </section>
            <Button
              variant="secondary"
              onClick={randomize}
              className={css`
                width: 100%;
              `}
            >
              <FiShuffle className="mr-2 h-4 w-4" />
              Randomize
            </Button>
          </div>
          <OptionSelector
            glasses={glasses}
            onGlassesChange={setGlasses}
            dark={dark}
            onDarkChange={changeDark}
          />
          <ViolationWatcher {...palette} />
          <ExportSelector />
        </div>
      </div>
    </ThemeProvider>
  );
}

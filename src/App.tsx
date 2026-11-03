import "./App.global.scss";
import { ThemeProvider } from "@/components/ThemeProvider";
import { css } from "@emotion/css";
import colors from "@/assets/colors.json";
import { useEffect, useState } from "react";
import Model from "./assets/Model";
import chroma from "chroma-js";
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

/**
 * Generate tonal color
 * @param primary the primary color
 * @returns the adjusted tonal color
 */
function genTonal(primary: string) {
  const primaryColor = chroma(primary).hsl();
  return chroma
    .hsl(
      primaryColor[0],
      primaryColor[1] * 1.3,
      Math.max(Math.min(primaryColor[2] * 1.3, 1), 0.7)
    )
    .hex();
}

/**
 * Generate secondary color
 * @param primary the primary color
 * @returns the adjusted secondary color
 */
function genSecondary(primary: string) {
  const primaryColor = chroma(primary).hsl();
  return chroma
    .hsl(primaryColor[0] + 180, primaryColor[1] * 0.5, primaryColor[2] * 0.9)
    .hex();
}

/**
 * Generate background color
 * @param primary the primary color
 * @returns the adjusted background color
 */
function genBackground(primary: string) {
  const primaryColor = chroma(primary).hsl();
  return chroma.hsl(primaryColor[0], primaryColor[1] * 0.5, 0.9).hex();
}

function randomColor(
  {
    minHue = 0,
    maxHue = 360,
    minSaturation = 0.5,
    maxSaturation = 1,
    minLightness = 0.5,
    maxLightness = 0.9,
  }: {
    minHue?: number;
    maxHue?: number;
    minSaturation?: number;
    maxSaturation?: number;
    minLightness?: number;
    maxLightness?: number;
  } = {
    minHue: 0,
    maxHue: 360,
    minSaturation: 0.5,
    maxSaturation: 1,
    minLightness: 0.5,
    maxLightness: 0.9,
  }
) {
  return chroma
    .hsl(
      Math.random() * (maxHue - minHue) + minHue,
      Math.random() * (maxSaturation - minSaturation) + minSaturation,
      Math.random() * (maxLightness - minLightness) + minLightness
    )
    .hex();
}

const hairColors = ["#000000", "#2B1B14", "#5A3825", "#B5651D", "#D9B26F", "#8A8A8A"];

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

  // Relational color generation: the other colors follow the primary one
  const changePrimary = (value: string) => {
    setPrimary(value);
    if (!tonalLock) setTonal(genTonal(value));
    if (!secondaryLock) setSecondary(genSecondary(value));
    if (!backgroundLock) setBackground(genBackground(value));
  };

  // Random color generation
  const randomize = () => {
    if (primaryLock) {
      if (!tonalLock) setTonal(randomColor({ minLightness: 0.5 }));
      if (!secondaryLock) setSecondary(randomColor());
      if (!backgroundLock)
        setBackground(
          randomColor({ maxSaturation: 0.6, minLightness: 0.8, maxLightness: 0.95 })
        );
    } else {
      changePrimary(randomColor());
    }
    if (!hairLock)
      setHair(hairColors[Math.floor(Math.random() * hairColors.length)]);
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
              {...{ primary, secondary, tonal, background, hair }}
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
                setValue={setHair}
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
          />
          <ViolationWatcher {...{ primary, secondary, tonal, background, hair }} />
          <ExportSelector />
        </div>
      </div>
    </ThemeProvider>
  );
}

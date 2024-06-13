import "./App.global.scss";
import { ThemeProvider } from "@/components/ThemeProvider";
import { css } from "@emotion/css";
import colors from "@/assets/colors.json";
import { useEffect, useMemo, useState } from "react";
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
import ContrastWatcher from "./components/ContrastWatcher";

const borderRadii: Record<Rounding, string> = {
  circle: "50%",
  squircle: "30%",
  square: "calc(var(--radius) - 2px)",
};

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

function genSecondary(primary: string) {
  const primaryColor = chroma(primary).hsl();
  return chroma
    .hsl(primaryColor[0] + 180, primaryColor[1] * 0.5, primaryColor[2] * 0.9)
    .hex();
}

function genBackground(primary: string) {
  const primaryColor = chroma(primary).hsl();
  return chroma.hsl(primaryColor[0], primaryColor[1] * 0.5, 0.9).hex();
}

function randomColor(
) {
  return chroma.random().hex();
}

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Color locks
  const [primaryLock, setPrimaryLock] = useState(false);
  const [secondaryLock, setSecondaryLock] = useState(false);
  const [tonalLock, setTonalLock] = useState(false);

  // Color states
  const [primary, setPrimary] = useState(
    searchParams.get("primary") || colors.primary
  );
  const [secondary, setSecondary] = useState(
    searchParams.get("secondary") || colors.secondary
  );
  const [tonal, setTonal] = useState(searchParams.get("tonal") || colors.tonal);

  const [rounding, setRounding] = useState<Rounding>(
    (searchParams.get("rounding") as Rounding) || roundingOptions[0]
  );

  // Update URL search params
  useEffect(() => {
    searchParams.set("primary", primary);
    searchParams.set("secondary", secondary);
    searchParams.set("tonal", tonal);
    searchParams.set("rounding", rounding);
    setSearchParams(searchParams);
  }, [primary, rounding, searchParams, secondary, setSearchParams, tonal]);

  // Relational color generation
  useEffect(() => {
    if (!tonalLock) setTonal(genTonal(primary));
  }, [primary, tonalLock]);

  useEffect(() => {
    if (!secondaryLock) setSecondary(genSecondary(primary));
  }, [primary, secondaryLock]);

  const background = useMemo(() => {
    return genBackground(primary);
  }, [primary]);

  // Random color generation
  const randomize = () => {
    if (!primaryLock) setPrimary(randomColor());
    if (!secondaryLock) setSecondary(randomColor());
    if (!tonalLock) setTonal(randomColor());
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Toaster />
      <div
        className={css`
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          padding-top: clamp(2rem, 10vw, 8rem);
        `}
      >
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
              {...{
                primary,
                secondary,
                tonal,
                background,
              }}
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
                setValue={setPrimary}
                lock={primaryLock}
                setLock={setPrimaryLock}
              />
              <ColorSelector
                value={secondary}
                setValue={setSecondary}
                lock={secondaryLock}
                setLock={setSecondaryLock}
              />
              <ColorSelector
                value={tonal}
                setValue={setTonal}
                lock={tonalLock}
                setLock={setTonalLock}
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
          <OptionSelector />
          <ContrastWatcher
            {...{
              primary,
              secondary,
              tonal,
              background,
            }}
          />
          <ExportSelector />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

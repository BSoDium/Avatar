import "./App.global.scss";
import { ThemeProvider } from "./components/ThemeProvider";
import { css } from "@emotion/css";
import colors from "@/assets/colors.json";
import { useEffect, useMemo, useState } from "react";
import Model from "./assets/Model";
import chroma from "chroma-js";
import {
  Rounding,
  roundingOptions,
  RoundingSelector,
} from "./components/RoudingSelector";
import ExportSelector from "./components/ExportSelector";
import { AspectRatio } from "./components/ui/aspect-ratio";
import ColorSelector from "./components/ColorSelector";
import { useSearchParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import OptionSelector from "./components/OptionSelector";

const borderRadii: Record<Rounding, string> = {
  circle: "50%",
  squircle: "30%",
  square: "0",
};

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [primaryLock, setPrimaryLock] = useState(false);
  const [secondaryLock, setSecondaryLock] = useState(false);
  const [tonalLock, setTonalLock] = useState(false);

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

  useEffect(() => {
    searchParams.set("primary", primary);
    searchParams.set("secondary", secondary);
    searchParams.set("tonal", tonal);
    searchParams.set("rounding", rounding);
    setSearchParams(searchParams);
  }, [primary, rounding, searchParams, secondary, setSearchParams, tonal]);

  // Relational color generation

  useEffect(() => {
    if (!tonalLock) {
      const primaryColor = chroma(primary).hsl();
      const tonalColor = chroma
        .hsl(
          primaryColor[0],
          primaryColor[1] * 0.6,
          Math.max(primaryColor[2] * 1.1, 0.6)
        )
        .hex();
      setTonal(tonalColor);
    }
  }, [primary, tonalLock]);

  useEffect(() => {
    if (!secondaryLock) {
      const primaryColor = chroma(primary).hsl();
      const secondaryColor = chroma
        .hsl(
          primaryColor[0] + 180,
          primaryColor[1] * 0.5,
          primaryColor[2] * 0.9
        )
        .hex();
      setSecondary(secondaryColor);
    }
  }, [primary, secondaryLock]);

  useEffect(() => {
    if (!primaryLock && secondaryLock) {
      const secondaryColor = chroma(secondary).hsl();
      const primaryColor = chroma
        .hsl(
          secondaryColor[0] + 180,
          Math.min(secondaryColor[1] * 2, 1),
          Math.min(secondaryColor[2] * 1.1, 1)
        )
        .hex();
      setPrimary(primaryColor);
    }
  }, [secondary, primaryLock, secondaryLock]);

  const background = useMemo(() => {
    const primaryColor = chroma(primary).hsl();
    return chroma
      .hsl(
        primaryColor[0],
        primaryColor[1] * 0.5,
        0.90,
      )
      .hex();
  }, [primary]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <Toaster />
      <div
        className={css`
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
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
          </div>
          <OptionSelector />
          <ExportSelector />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

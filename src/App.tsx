import "./App.global.scss";
import { ThemeProvider } from "./components/ThemeProvider";
import { css } from "@emotion/css";
import colors from "@/assets/colors.json";
import { useEffect, useState } from "react";
import Model from "./assets/Model";
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

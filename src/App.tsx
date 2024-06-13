import "./App.global.scss";
import { ThemeProvider } from "./components/ThemeProvider";
import { css } from "@emotion/css";
import colors from "@/assets/colors.json";
import { useState } from "react";
import Model from "./assets/Model";
import {
  Rounding,
  roundingOptions,
  RoundingSelector,
} from "./components/RoudingSelector";
import DownloadSelector from "./components/DownloadSelector";
import { AspectRatio } from "./components/ui/aspect-ratio";
import ColorSelector from "./components/ColorSelector";

const borderRadii: Record<Rounding, string> = {
  circle: "50%",
  squircle: "30%",
  square: "0",
};

function App() {
  const [primaryLock, setPrimaryLock] = useState(false);
  const [secondaryLock, setSecondaryLock] = useState(false);
  const [tonalLock, setTonalLock] = useState(false);

  const [primary, setPrimary] = useState(colors.primary);
  const [secondary, setSecondary] = useState(colors.secondary);
  const [tonal, setTonal] = useState(colors.tonal);

  const [rounding, setRounding] = useState<Rounding>(roundingOptions[0]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
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
          <DownloadSelector />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

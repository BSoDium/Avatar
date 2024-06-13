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

function App() {
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
                border-radius: ${rounding === "circle"
                  ? "50%"
                  : rounding === "squircle"
                  ? "30%"
                  : "0"};
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
                flex-direction: row;
                gap: 0.5rem;
              `}
            >
              <ColorSelector 
                value={primary}
                onChange={setPrimary}
              />
              <ColorSelector 
                value={secondary}
                onChange={setSecondary}
              />
              <ColorSelector 
                value={tonal}
                onChange={setTonal}
              />
            </section>
            <DownloadSelector />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

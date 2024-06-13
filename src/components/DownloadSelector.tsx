import { Button } from "@/components/ui/button";
import { css } from "@emotion/css";

export default function DownloadSelector() {
  return (
    <section
      className={css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
      `}
    >
      <Button variant="ghost">Download PNG</Button>
      <Button>Download SVG</Button>
    </section>
  );
}

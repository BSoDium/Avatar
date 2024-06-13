import { Button } from "@/components/ui/button";
import { css } from "@emotion/css";
import { FiDownload, FiShare } from "react-icons/fi";

export default function DownloadSelector() {
  return (
    <section
      className={css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        width: 100%;
      `}
    >
      <Button
        variant="outline"
        className={css`
          flex: 1;
        `}
      >
        <FiShare className="mr-2 h-4 w-4" />
        Share
      </Button>
      <Button
        className={css`
          flex: 1;
        `}
      >
        <FiDownload className="mr-2 h-4 w-4" />
        Download
      </Button>
    </section>
  );
}

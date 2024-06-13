import { Button } from "@/components/ui/button";
import { css } from "@emotion/css";
import {
  FiDownload,
  FiExternalLink,
  FiImage,
  FiLink,
  FiShare,
} from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect } from "react";
import { toast } from "sonner";
import { TbVectorSpline } from "react-icons/tb";

export default function ExportSelector() {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast("Link has been copied", {
      description: "Share away, my friend 🚀",
      action: {
        label: "Dismiss",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
  };

  const share = () => {
    navigator.share({
      title: "Color Generator",
      text: "Generate colors and export them as code",
      url: window.location.href,
    });
  };

  const downloadSVG = () => {
    const svg = document.querySelector("svg");
    const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "colors.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = () => {
    const svg = document.querySelector("svg");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const svgString = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "colors.png";
        a.click();
        URL.revokeObjectURL(url);
      });
    };

    img.src = url;
  };

  useEffect(() => {
    const action = (event: KeyboardEvent) => {
      if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
        copyLink();
      }
    };

    document.addEventListener("keydown", action);

    return () => {
      document.removeEventListener("keydown", action);
    };
  }, []);

  return (
    <section
      className={css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        width: 100%;
      `}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={css`
              flex: 1;
            `}
          >
            <FiShare className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Sharing options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyLink}>
            <FiLink className="mr-2 h-4 w-4" />
            <span>Copy link</span>
            <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={share}>
            <FiExternalLink className="mr-2 h-4 w-4" />
            <span>Share in app</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className={css`
              flex: 1;
            `}
          >
            <FiDownload className="mr-2 h-4 w-4" />
            Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>File format</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={downloadSVG}>
            <TbVectorSpline className="mr-2 h-4 w-4" />
            <span>Vector graphics</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadPNG}>
            <FiImage className="mr-2 h-4 w-4" />
            <span>Rasterized</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
}

import { css } from "@emotion/css";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FiGithub, FiHeart } from "react-icons/fi";

export default function Socials() {
  return (
    <div
      className={css`
        position: fixed;
        top: 1rem;
        right: 1rem;
        max-width: 100vw;
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        `}
    >
      <Button variant="ghost" asChild>
        <Link to="https://github.com/BSoDium/Avatar/fork" target="_blank">
          <FiGithub className="mr-2 h-4 w-4" />
          Fork on GitHub
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link to="https://github.com/sponsors/BSoDium" target="_blank">
          <FiHeart className="mr-2 h-4 w-4" />
          Sponsor author
        </Link>
      </Button>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { FolderIcon, InfoIcon, NewProjectIcon } from "./Icons";

interface ActivityBarProps {
  onCreate: () => void;
  onAbout: () => void;
}

export default function ActivityBar({ onCreate, onAbout }: ActivityBarProps) {
  const { pathname } = useLocation();

  return (
    <nav className="activity-bar" aria-label="Main menu">
      <Link
        to="/"
        className={`activity-item${pathname === "/" ? " active" : ""}`}
        title="Projects"
      >
        <FolderIcon />
        <span className="activity-tip">Projects</span>
      </Link>
      <button
        className="activity-item"
        title="New project"
        onClick={onCreate}
      >
        <NewProjectIcon />
        <span className="activity-tip">New project</span>
      </button>
      <button
        className="activity-item activity-item--bottom"
        title="About"
        onClick={onAbout}
      >
        <InfoIcon />
        <span className="activity-tip">About</span>
      </button>
    </nav>
  );
}

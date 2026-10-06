import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useTheme } from "@renderer/contexts/ThemeContext";
import { MoonIcon, SunIcon } from "./Icons";

interface AppHeaderProps {
  onRefresh: () => void;
  onCreate: () => void;
}

export default function AppHeader({ onRefresh, onCreate }: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <header className="app-header">
      <Link to="/" className="app-brand">
        <span className="brand-logo">D</span>
        <span className="brand-name">Dark Project</span>
      </Link>
      <div className="app-header__actions">
        <Button
          variant="outline-secondary"
          onClick={toggleTheme}
          title={isLight ? "Switch to dark theme" : "Switch to light theme"}
          aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
        >
          {isLight ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Button variant="outline-secondary" onClick={onRefresh}>
          Refresh
        </Button>
        <Button variant="primary" onClick={onCreate}>
          New project
        </Button>
      </div>
    </header>
  );
}
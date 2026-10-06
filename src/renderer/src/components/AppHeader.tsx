import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

interface AppHeaderProps {
  onRefresh: () => void;
  onCreate: () => void;
}

export default function AppHeader({ onRefresh, onCreate }: AppHeaderProps) {
  return (
    <header className="app-header">
      <Link to="/" className="app-brand">
        <span className="brand-logo">D</span>
        <span className="brand-name">Dark Project</span>
      </Link>
      <div className="app-header__actions">
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

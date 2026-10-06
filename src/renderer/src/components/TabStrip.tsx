import { useNavigate, useParams } from "react-router-dom";
import { useTabs } from "@renderer/contexts/TabsContext";
import { FolderIcon } from "./Icons";
import "../css/tabs.css";

interface TabStripProps {
  showNewTab?: boolean;
}

export default function TabStrip({ showNewTab = true }: TabStripProps) {
  const { tabs, closeTab } = useTabs();
  const { project } = useParams<{ project: string }>();
  const navigate = useNavigate();

  if (tabs.length === 0) return null;

  const handleClose = (name: string) => {
    const index = tabs.indexOf(name);
    const remaining = tabs.filter((t) => t !== name);
    closeTab(name);
    if (name === project) {
      const next = remaining[Math.min(index, remaining.length - 1)];
      navigate(next ? `/project/${next}` : "/");
    }
  };

  return (
    <div className="tab-strip" role="tablist" aria-label="Open projects">
      <div className="tab-strip__list">
        {tabs.map((name) => (
          <div
            key={name}
            role="tab"
            aria-selected={name === project}
            className={`app-tab${name === project ? " app-tab--active" : ""}`}
            title={name}
            onClick={() => navigate(`/project/${name}`)}
          >
            <span className="app-tab__icon">
              <FolderIcon />
            </span>
            <span className="app-tab__label">{name}</span>
            <button
              className="app-tab__close"
              title="Close tab"
              aria-label={`Close ${name}`}
              onClick={(e) => {
                e.stopPropagation();
                handleClose(name);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {showNewTab && (
        <button
          className="tab-add"
          title="Open project"
          aria-label="Open project"
          onClick={() => navigate("/")}
        >
          +
        </button>
      )}
    </div>
  );
}

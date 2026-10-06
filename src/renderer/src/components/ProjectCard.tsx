import { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { useTabs } from "@renderer/contexts/TabsContext";
import { FolderIcon } from "./Icons";

interface ProjectCardProps {
  name: string;
}

export default function ProjectCard({ name }: ProjectCardProps) {
  const { tabs, openTab } = useTabs();
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (tabs.includes(name)) {
        navigate(`/project/${name}`);
      } else {
        openTab(name);
      }
    }
  };

  return (
    <Card
      as={Link}
      to={`/project/${name}`}
      onClick={handleClick}
      title={`${name} — Ctrl+click to open in a new tab`}
      className="project-card h-100"
    >
      <Card.Body>
        <div className="project-card__icon">
          <FolderIcon />
        </div>
        <Card.Title as="h3" className="project-card__title">
          {name}
        </Card.Title>
        <span className="project-card__meta">Open &rarr;</span>
      </Card.Body>
    </Card>
  );
}

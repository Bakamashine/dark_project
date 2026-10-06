import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { FolderIcon } from "./Icons";

interface ProjectCardProps {
  name: string;
}

export default function ProjectCard({ name }: ProjectCardProps) {
  return (
    <Card as={Link} to={`/project/${name}`} className="project-card h-100">
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

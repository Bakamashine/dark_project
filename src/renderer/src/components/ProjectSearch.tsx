import Form from "react-bootstrap/Form";
import { SearchIcon } from "./Icons";

interface ProjectSearchProps {
  value: string;
  onChange: (value: string) => void;
}

function ProjectSearch({ value, onChange }: ProjectSearchProps) {
  return (
    <div className="project-search">
      <span className="project-search__icon">
        <SearchIcon />
      </span>
      <Form.Control
        type="search"
        placeholder="Search projects..."
        aria-label="Search projects"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default ProjectSearch;

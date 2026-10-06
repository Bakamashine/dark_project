import { Pagination } from "react-bootstrap";

interface ProjectsPaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function ProjectsPagination({
  currentPage,
  totalPages,
  onChange,
}: ProjectsPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrap">
      <Pagination className="mb-0">
        <Pagination.Prev
          onClick={() => onChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        />
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i}
            active={i + 1 === currentPage}
            onClick={() => onChange(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}

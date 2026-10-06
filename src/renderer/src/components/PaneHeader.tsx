import { ReactNode } from "react";

interface PaneHeaderProps {
  title: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  children?: ReactNode;
}

export default function PaneHeader({
  title,
  onClose,
  closeLabel = "Close",
  children,
}: PaneHeaderProps) {
  return (
    <div className="pane-head">
      <h1>{title}</h1>
      {children}
      {onClose && (
        <button
          className="pane-close"
          title={closeLabel}
          aria-label={closeLabel}
          onClick={onClose}
        >
          &times;
        </button>
      )}
    </div>
  );
}

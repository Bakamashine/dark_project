import ModalWindow from "./ModalWindow";

interface AboutModalProps {
  show: boolean;
  onClose: () => void;
}

export default function AboutModal({ show, onClose }: AboutModalProps) {
  return (
    <ModalWindow
      show={show}
      onClose={onClose}
      hideSubmitButton={true}
      cancelLabel="Close"
      title="About"
    >
      <div>
        <p>Dark Project — a document authoring app instead of Word/LaTeX.</p>
        <p className="text-muted mb-0">
          Version 1.0.0 · page numbering, GOST title blocks, PDF export.
        </p>
      </div>
    </ModalWindow>
  );
}

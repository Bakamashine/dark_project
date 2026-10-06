import CssClassesTip from "./CssClassesTip";

interface EditorToolbarProps {
  saving: boolean;
  loading: boolean;
  onSave: () => void;
  onAddPage: () => void;
  onRevert: () => void;
  onApplyNumbering: () => void;
  onExportPdf: () => void;
}

export default function EditorToolbar({
  saving,
  loading,
  onSave,
  onAddPage,
  onRevert,
  onApplyNumbering,
  onExportPdf,
}: EditorToolbarProps) {
  return (
    <div className="editor-toolbar">
      <button
        className="btn btn-primary"
        onClick={onSave}
        disabled={saving || loading}
      >
        {saving ? "Saving..." : "Save"}
      </button>
      <button className="btn btn-primary" onClick={onAddPage}>
        Add page
      </button>
      <button className="btn btn-primary" onClick={onRevert}>
        Revert changes
      </button>
      <button className="btn btn-primary" onClick={onApplyNumbering}>
        Apply numbering from .env
      </button>
      <button className="btn btn-primary" onClick={onExportPdf}>
        Export to PDF
      </button>
      <CssClassesTip />
    </div>
  );
}

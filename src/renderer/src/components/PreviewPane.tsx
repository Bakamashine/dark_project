import PaneHeader from "./PaneHeader";

interface PreviewPaneProps {
  html: string;
  onClose: () => void;
}

export default function PreviewPane({ html, onClose }: PreviewPaneProps) {
  return (
    <div className="box">
      <PaneHeader
        title="Preview"
        onClose={onClose}
        closeLabel="Close preview"
      />
      <div className="preview" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

interface LoaderProps {
  text?: string
  height?: string
  size?: "sm" | "lg"
}

export default function Loader({ text = "Загрузка...", height = "200px", size }: LoaderProps) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center gap-2" style={{ height }}>
      <div className={`spinner-border text-primary${size === "sm" ? " spinner-border-sm" : ""}`} role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <span className="text-muted">{text}</span>}
    </div>
  )
}

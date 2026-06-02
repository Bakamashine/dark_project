import { Editor } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate, useParams } from "react-router-dom";
import "../css/project.css";

export default function Project() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { project } = useParams<{ project: string }>();
  const navigation = useNavigate();

  const loadContent = useCallback(async () => {
    if (!project) return;
    setLoading(true);
    const result = await window.Files.getResource(project);
    if (result) {
      setText(result);
    }
    setLoading(false);
  }, [project]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const save = async () => {
    if (!project) return;
    setSaving(true);
    setMessage(null);
    const ok = await window.Files.save(project, text);
    if (ok) {
      setMessage({ type: "success", text: "Файл сохранён" });
    } else {
      setMessage({ type: "error", text: "Ошибка сохранения" });
    }
    setSaving(false);
  };

  useHotkeys("ctrl+s", save, { preventDefault: true }, [save]);

  return (
    <section>
      <button className="btn btn-link p-0 mb-3" onClick={() => navigation(-1)}>
        ← Назад
      </button>

      {message && (
        <div className={`alert alert-${message.type === "error" ? "danger" : "success"} py-2`}>
          {message.text}
        </div>
      )}

      <section className="d-flex justify-content-between align-items-start">
        <div className="box sticky-top">
          <h1>Редактор</h1>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <Editor
              height="calc(100vh - 120px)"
              defaultLanguage="html"
              value={text}
              onChange={(e) => setText(e as string)}
            />
          )}
          <button className="btn btn-primary mt-2" onClick={save} disabled={saving || loading}>
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
        <div className="box">
          <h1>Результат</h1>
          <div
            className="border rounded p-3 bg-light"
            style={{ minHeight: "200px" }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </section>
    </section>
  );
}

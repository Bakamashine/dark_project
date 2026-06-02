import { Editor } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate, useParams } from "react-router-dom";
import "../css/project.css";
import Loader from "@renderer/components/Loader";
import { getCommentParam } from "@renderer/helper/regex";
import { startPageKey } from "@renderer/constants/key";

export default function Project() {
  const [text, setText] = useState("");
  const [oldText, setOldText] = useState("")
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { project } = useParams<{ project: string }>();
  const [startPageNumber, setStartPageNumber] = useState(1);
  const [saveStatus, setSaveStatus] = useState(false)
  const navigation = useNavigate();

  const readVariables = async () => {
    if (project) {
      const str_array = await window.Files.getResourceArray(project);
      for (let i of str_array) {
        setStartPageNumber(
          parseInt(getCommentParam(i, startPageKey) || "1", 10),
        );
      }

      console.log("start_page: ", startPageNumber);
    }
  };

  const loadContent = useCallback(async () => {
    if (!project) return;
    setLoading(true);
    const result = await window.Files.getResource(project);
    if (result) {
      setText(result);
      setOldText(result)
    }
    setLoading(false);
  }, [project]);

 

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
    setSaveStatus(false)
  };

  useHotkeys("ctrl+s", save, { preventDefault: true }, [save]);


   useEffect(() => {
    readVariables();
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (oldText !== text && !saveStatus) {
        setSaveStatus(true)
    }
  }, [text])
  return (
    <section>
      <button className="btn btn-link p-0 mb-3" onClick={() => navigation(-1)}>
        ← Назад
      </button>

      {message && (
        <div
          className={`alert alert-${message.type === "error" ? "danger" : "success"} py-2`}
        >
          {message.text}
        </div>
      )}

      <section className="d-flex justify-content-between align-items-start">
        <div className="box sticky-top">
          <h1>Редактор {saveStatus ? "*" : ""}</h1>
          {loading ? (
            <Loader />
          ) : (
            <Editor
              height="calc(100vh - 120px)"
              defaultLanguage="html"
              value={text}
              onChange={(e) => setText(e as string)}
            />
          )}
          <button
            className="btn btn-primary mt-2"
            onClick={save}
            disabled={saving || loading}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
        <div className="box">
          <h1>Результат</h1>
          <div
            className="border rounded p-3 bg-light preview"
            style={{ minHeight: "200px" }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </section>
    </section>
  );
}

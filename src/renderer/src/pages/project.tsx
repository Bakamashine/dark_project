import { Editor } from "@monaco-editor/react";
import { useCallback, useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate, useParams } from "react-router-dom";
import "../css/project.css";
import Loader from "@renderer/components/Loader";
import PaneHeader from "@renderer/components/PaneHeader";
import EditorToolbar from "@renderer/components/EditorToolbar";
import PreviewPane from "@renderer/components/PreviewPane";
import { useTheme } from "@renderer/contexts/ThemeContext";

export default function Project() {
  const [_html, _setHtml] = useState("");
  const [oldHtml, setOldHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { project } = useParams<{ project: string }>();
  const [startPageNumber, setStartPageNumber] = useState(1);
  const [saveStatus, setSaveStatus] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const navigation = useNavigate();
  const { theme } = useTheme();

  const readVariables = useCallback(async (): Promise<number> => {
    if (project) {
      const envContent = await window.Files.getResource(project, ".env");
      if (envContent) {
        for (const line of envContent.split("\n")) {
          const [key, value] = line.split("=");
          if (key?.trim() === "startPage") {
            const pageNumber = parseInt(value?.trim() || "1", 10);
            console.log("start_page: ", pageNumber);
            return pageNumber;
          }
        }
      }
    }
    return 1;
  }, [project]);

  const setPages = useCallback((html: string, startPage: number) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const content = doc.querySelectorAll(".page") as NodeListOf<HTMLDivElement>;
    content.forEach((element, i) => {
      const page_number = element.querySelector(
        "#page_number",
      ) as HTMLDivElement;
      if (page_number) {
        page_number.textContent = String(startPage + i);
      }
    });
    const updatedHtml = doc.body.innerHTML;
    _setHtml(updatedHtml);
    setOldHtml(updatedHtml);
  }, []);

  const loadContent = useCallback(async () => {
    if (!project) return;
    setLoading(true);
    const [pageNumber, result] = await Promise.all([
      readVariables(),
      window.Files.getResource(project),
    ]);
    setStartPageNumber(pageNumber);
    if (result) {
      setPages(result, pageNumber);
    }
    setLoading(false);
  }, [project]);

  const save = useCallback(async () => {
    if (!project) return;
    setSaving(true);
    setMessage(null);
    const ok = await window.Files.save(project, _html);
    if (ok) {
      setOldHtml(_html);
      setMessage({ type: "success", text: "File saved" });
    } else {
      setMessage({ type: "error", text: "Save failed" });
    }
    setSaving(false);
    setSaveStatus(false);
  }, [project, _html]);

  const addPage = async () => {
    const examplePage = `<section class="page">
  <div class="border">
    <h1 class="title-one">Привет мир</h1>

    <div class="stamp">
      <div class="left">
        <div class="left-top">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div class="left-bottom">
          <div>Изм.</div>
          <div>Лист</div>
          <div>№ докум.</div>
          <div>Подп.</div>
          <div>Дата</div>
        </div>
      </div>

      <div class="center">09.02.07 И 124 20 ДП-ПЗ</div>

      <div class="right">
        <div class="right-top">Лист</div>
        <div class="right-bottom" id="page_number"></div>
      </div>
    </div>
  </div>
</section>`;

    setPages(_html + examplePage, startPageNumber);
  };

  const dropSave = () => {
    setSaveStatus(false);
    _setHtml(oldHtml);
  };

  const parseEnv = async () => {
    if (!project) return;
    const pageNumber = await readVariables();
    setStartPageNumber(pageNumber);
    setPages(_html, pageNumber);
  };

  const saveToPdf = async () => {
    if (project) await window.Files.saveToPdf(project, _html);
  };
  useHotkeys("ctrl+s", save, { preventDefault: true }, [save]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    if (oldHtml !== _html && !saveStatus) {
      setSaveStatus(true);
    }
  }, [_html]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage(null);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <section>
      <button className="back-link" onClick={() => navigation('/')}>
        &larr; Back
      </button>

      {message && (
        <div
          className={`alert message-bar alert-${message.type === "error" ? "danger" : "success"} py-2`}
        >
          {message.text}
        </div>
      )}

      <section className="d-flex justify-content-between align-items-start">
        <div
          className={`box editor-pane sticky-top${showPreview ? "" : " box--full"}`}
        >
          <PaneHeader title={`Editor${saveStatus ? " *" : ""}`}>
            {!showPreview && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setShowPreview(true)}
              >
                Show preview
              </button>
            )}
          </PaneHeader>

          <EditorToolbar
            saving={saving}
            loading={loading}
            onSave={save}
            onAddPage={addPage}
            onRevert={dropSave}
            onApplyNumbering={parseEnv}
            onExportPdf={saveToPdf}
          />

          {loading ? (
            <Loader />
          ) : (
            <Editor
              height="calc(100vh - 156px)"
              defaultLanguage="html"
              theme={theme === "dark" ? "vs-dark" : "light"}
              value={_html}
              onChange={(e) => _setHtml(e as string)}
            />
          )}
        </div>

        {showPreview && (
          <PreviewPane html={_html} onClose={() => setShowPreview(false)} />
        )}
      </section>
    </section>
  );
}

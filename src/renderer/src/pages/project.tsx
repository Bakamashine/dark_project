import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function Project() {
  const [text, setText] = useState("");
  const [trueText, setTrueText] = useState(
    "<p class='text-success'>Its working!</p>",
  );
  const { project } = useParams<{ project: string }>();
  const navigation = useNavigate();
  const loadContent = async () => {
    console.log("content is loaded!");
    if (project) {
      const result = await window.Files.getResource(project);
      console.log("loadContent: ", result);
      if (result) {
        setTrueText(result);
        setText(result);
      }
    }
  };

  const save = async () => {
    if (project) {
      console.log('saving...')
      const res = await window.Files.save(project, text);
      if (res) await loadContent();
    }
  };

  useHotkeys("ctrl+s", async () => {
    await save();
  });
  useEffect(() => {
    loadContent();
  }, []);

  return (
    <section>
      <Link to={""} onClick={() => navigation(-1)}>
        Назад
      </Link>

      <section className="d-flex justify-content-around ">
        <div>
          <h1>Ваш редактор: </h1>
          <textarea onChange={(e) => setText(e.target.value)} value={text} />
          <button onClick={save}>Сохранить</button>
        </div>
        <div>
          <h1>Результат: </h1>
          <div dangerouslySetInnerHTML={{ __html: trueText ?? "" }}></div>
        </div>
      </section>
    </section>
  );
}

import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages";
import Project from "./pages/project";
import BasicRedactorLayout from "./layouts/basic_redactor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route element={<BasicRedactorLayout />}>
          <Route path="project/:project" element={<Project />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

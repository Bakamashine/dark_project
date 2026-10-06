import { HashRouter, Route, Routes } from "react-router-dom";
import MainPage from "./pages";
import Project from "./pages/project";
import BasicRedactorLayout from "./layouts/basic_redactor";
import { TabsProvider } from "./contexts/TabsContext";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <TabsProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route element={<BasicRedactorLayout />}>
              <Route path="project/:project" element={<Project />} />
            </Route>
          </Routes>
        </HashRouter>
      </TabsProvider>
    </ThemeProvider>
  );
}

export default App;

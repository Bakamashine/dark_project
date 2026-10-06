import { FormEvent, useEffect, useState } from "react";
import { Alert, Button, Container, Col, Row } from "react-bootstrap";
import AppHeader from "@renderer/components/AppHeader";
import ActivityBar from "@renderer/components/ActivityBar";
import ProjectCard from "@renderer/components/ProjectCard";
import ProjectSearch from "@renderer/components/ProjectSearch";
import ProjectsPagination from "@renderer/components/ProjectsPagination";
import CreateProjectModal from "@renderer/components/CreateProjectModal";
import AboutModal from "@renderer/components/AboutModal";
import TabStrip from "@renderer/components/TabStrip";
import Loader from "@renderer/components/Loader";
import { timeout_alert } from "@renderer/constants/timeout";
import "../css/home.css";

const ITEMS_PER_PAGE = 8;

function MainPage() {
  const [projects, setProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [show, setShow] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [badAlert, setBadAlert] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");

  const loadProjects = async () => {
    try {
      const projects = await window.Projects.getProjects();
      if (projects) {
        setProjects(projects);
      }
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setLoading(true);
    loadProjects();
  };

  const handleCreateProject = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectName) {
      setBadAlert(true);
      return;
    }
    const newDir = await window.Projects.createProject(projectName);
    if (newDir) {
      setSuccessAlert(true);
      setNewProjectName(newDir);
      loadProjects();
    } else {
      setBadAlert(true);
    }
    setShow(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (!successAlert && !badAlert) return;
    const timer = setTimeout(() => {
      setSuccessAlert(false);
      setBadAlert(false);
    }, timeout_alert);
    return () => clearTimeout(timer);
  }, [successAlert, badAlert]);

  const trimmedQuery = query.trim().toLowerCase();
  const filteredProjects = trimmedQuery
    ? projects.filter((name) => name.toLowerCase().includes(trimmedQuery))
    : projects;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / ITEMS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const visibleProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <>
      <AppHeader onRefresh={refresh} onCreate={() => setShow(true)} />
      <TabStrip showNewTab={false} />

      <div className="app-shell">
        <ActivityBar
          onCreate={() => setShow(true)}
          onAbout={() => setShowAbout(true)}
        />

        <main className="app-content">
          <Container fluid className="px-4 py-4">
            <Alert variant="success" show={successAlert}>
              Project created successfully! New project name: {newProjectName}
            </Alert>
            <Alert variant="danger" show={badAlert}>
              The project already exists, the field was empty, or an error
              occurred
            </Alert>

            <div className="content-head">
              <div>
                <h1>Projects</h1>
                <p className="text-muted mb-0">Your documents</p>
              </div>
              <div className="content-head__actions">
                <ProjectSearch value={query} onChange={setQuery} />
                <span className="project-count text-muted">
                  {trimmedQuery
                    ? `${filteredProjects.length} of ${projects.length}`
                    : `${projects.length} total`}
                </span>
              </div>
            </div>

            {loading ? (
              <Loader height="300px" />
            ) : projects.length > 0 ? (
              filteredProjects.length > 0 ? (
                <>
                  <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                    {visibleProjects.map((item) => (
                      <Col key={item}>
                        <ProjectCard name={item} />
                      </Col>
                    ))}
                  </Row>

                  <ProjectsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onChange={setCurrentPage}
                  />
                </>
              ) : (
                <div className="empty-state">
                  <p className="mb-0">No projects found</p>
                </div>
              )
            ) : (
              <div className="empty-state">
                <p className="mb-3">No projects yet</p>
                <Button variant="primary" onClick={() => setShow(true)}>
                  Create your first project
                </Button>
              </div>
            )}
          </Container>
        </main>
      </div>

      <CreateProjectModal
        show={show}
        onClose={() => setShow(false)}
        name={projectName}
        onNameChange={setProjectName}
        onSubmit={handleCreateProject}
      />
      <AboutModal show={showAbout} onClose={() => setShowAbout(false)} />
    </>
  );
}

export default MainPage;

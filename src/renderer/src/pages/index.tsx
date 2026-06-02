import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Form,
  Alert,
  Button,
} from "react-bootstrap";
import ModalWindow from "@renderer/components/ModalWindow";
import { timeout_alert } from "@renderer/constants/timeout";

function MainPage() {
  const [projects, setProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState("");
  const [show, setShow] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [badAlert, setBadAlert] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

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

  return (
    <>
      <Alert variant="success" show={successAlert}>
        Проект был успешно создан! Имя нового проекта: {newProjectName}
      </Alert>
      <Alert variant="danger" show={badAlert}>
        Проект существует, либо поле было пустое, либо произошла ошибка
      </Alert>
      <ModalWindow
        show={show}
        onClose={() => setShow(false)}
        hideSubmitButton={true}
      >
        <Form onSubmit={handleCreateProject}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ваше название проекта</Form.Label>
            <Form.Control
              type="text"
              placeholder="Название проекта..."
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
            />
            <Button type="submit" variant="primary">
              Сохранить
            </Button>
          </Form.Group>
        </Form>
      </ModalWindow>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title as="h1" className="mb-3">
                  Здравствуйте!
                </Card.Title>
                <Card.Subtitle className="mb-4 text-muted">
                  Ваши проекты |{" "}
                  <Link to={""} onClick={() => setShow(true)}>
                    Создать
                  </Link>
                </Card.Subtitle>

                {loading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : projects.length > 0 ? (
                  <ListGroup variant="flush">
                    {projects.map((item, i) => (
                      <ListGroup.Item
                        key={i}
                        action
                        as={Link}
                        to={`/project/${item}`}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {item}
                        <span className="text-muted">&rarr;</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <p className="text-muted mb-0 text-center">Проектов нет</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default MainPage;

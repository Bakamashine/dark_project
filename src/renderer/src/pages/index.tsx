import { ChangeEvent, FormEvent, useEffect, useState } from "react";
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
  const [project_name, setProjectName] = useState("");
  const [show, setShow] = useState(false);
  const [showSuccessAlert, setSuccessAlert] = useState(false);
  const [showBadAlert, setBadAlert] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const _getProjects = async () => {
    try {
      const projects = await window.Projects.getProjects();
      if (projects) {
        setProjects(projects);
      }
    } finally {
      setLoading(false);
    }
  };

  const _createProject = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!project_name) {
      setBadAlert(true)
      return;
    }
    console.log("project_name: ", project_name);
    const new_dir = await window.Projects.createProject(project_name);
    console.log("new_dir: ", new_dir);
    if (new_dir) {
      setSuccessAlert(true);
      setNewProjectName(new_dir);
      _getProjects();
    } else {
      setBadAlert(true);
    }
    setShow(false);
  };

  useEffect(() => {
    _getProjects();
  }, []);


  useEffect(() => {
    setTimeout(() => {
      setBadAlert(false)
    }, timeout_alert)
  }, [showBadAlert])

  useEffect(() => {
    setTimeout(() => {
      setSuccessAlert(false)
    }, timeout_alert)
  }, [showSuccessAlert])
  return (
    <>
      <Alert variant="success" show={showSuccessAlert}>
        Проект был успешно создан! Имя нового проекта: {newProjectName}
      </Alert>
      <Alert variant="danger" show={showBadAlert}>
        Проект существует, либо поле было пустое, либо произошла ошибка
      </Alert>
      <ModalWindow
        show={show}
        handle_close={() => setShow(false)}
        submit_button_hidden={true}
      >
        <Form onSubmit={_createProject}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Ваше название проекта</Form.Label>
            <Form.Control
              type="text"
              placeholder="Название проекта..."
              // autoFocus
              onChange={(e) => setProjectName(e.target.value)}
              value={project_name}
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

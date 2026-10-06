import { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import ModalWindow from "./ModalWindow";

interface CreateProjectModalProps {
  show: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (name: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function CreateProjectModal({
  show,
  onClose,
  name,
  onNameChange,
  onSubmit,
}: CreateProjectModalProps) {
  return (
    <ModalWindow
      show={show}
      onClose={onClose}
      hideSubmitButton={true}
      title="New project"
    >
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Your project name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Project name..."
            onChange={(e) => onNameChange(e.target.value)}
            value={name}
          />
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Form.Group>
      </Form>
    </ModalWindow>
  );
}

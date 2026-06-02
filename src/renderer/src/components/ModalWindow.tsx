import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export interface ModalWindowProps {
  onSubmit?: () => void;
  onHide?: () => void;
  onClose?: () => void;
  title?: string;
  submitLabel?: string;
  cancelLabel?: string;
  show: boolean;
  hideSubmitButton?: boolean;
  children: React.ReactElement;
}

function ModalWindow(props: ModalWindowProps) {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title || "Стандартный заголовок"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}>
          {props.cancelLabel || "Отменить"}
        </Button>
        {!props.hideSubmitButton && (
          <Button variant="primary" onClick={props.onSubmit}>
            {props.submitLabel || "Создать"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalWindow;

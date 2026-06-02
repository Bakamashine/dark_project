import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

export interface ModalWindowProps {
  handle_submit?: () => void;
  handle_show?: () => void;
  handle_hide?: () => void;
  handle_close?: () => void;
  submit_text?: string;
  title_text?: string;

  submit_button_text?: string;
  cancel_button_text?: string;
  show: boolean;
  submit_button_hidden?: boolean;

  children: React.ReactElement;
}

function ModalWindow(props: ModalWindowProps) {
  //   const [show, setShow] = useState(false);

  //   const handleClose = () => setShow(false);
  //   const handleShow = () => setShow(true);

  return (
    <Modal show={props.show} onHide={props.handle_close}>
      <Modal.Header closeButton>
        <Modal.Title>
          {" "}
          {props.title_text || "Стандартный заголовок"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handle_close}>
          {props.cancel_button_text || "Отменить"}
        </Button>
        {!props.submit_button_hidden && (
          <Button variant="primary" onClick={props.handle_submit}>
            {props.submit_button_text || "Создать"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalWindow;

import React from "react";
import { Button, Modal } from "react-bootstrap";

let modalComponent = (props) => {
  return (
    <Modal show="true" className="mt-5 modal-component">
      <Modal.Header className="modal-component-header">
        <Modal.Title>{props.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-component-body">
        <p className="fs-3">{props.body}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            props.clickHandler(false, "shoppers");
          }}
        >
          Shopper
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            props.clickHandler(false, "customers");
          }}
        >
          Customer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default modalComponent;

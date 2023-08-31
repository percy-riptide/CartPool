import { React, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const DeliveryFeeModal = (props) => {
  const [validated, setValidated] = useState(true);
  const [amount, setAmount] = useState("");

  const saveFinalDeliveryFee = () => {
    if (amount) {
      props.clickHandler(false, "done", amount);
    } else {
      setValidated(false);
    }
  };

  return (
    <>
      <Modal show="true" className="mt-5 modal-component">
        <Modal.Header className="modal-component-header">
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-component-body">
          <Form>
            <Form.Group>
              <Form.Label style={{ margin: "0" }}>
                Final delivery fee
              </Form.Label>
              <div
                style={{
                  fontSize: "small",
                  fontStyle: "italic",
                  marginBottom: "2%",
                  color: "lightslategrey",
                }}
              >
                Only enter the amount and no alphabets
              </div>
              <Form.Control
                type="text"
                placeholder="E.g: 4.5"
                style={{ marginLeft: "0px" }}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (e.target.value) {
                    setValidated(true);
                  } else {
                    setValidated(false);
                  }
                }}
              />
              {!validated && (
                <div
                  style={{
                    fontSize: "14px",
                    color: "red",
                    fontStyle: "italic",
                  }}
                >
                  Please enter the amount.
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              props.clickHandler(false, "cancel", amount);
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={saveFinalDeliveryFee}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeliveryFeeModal;

import axios from "axios";
import { React, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

const InvoiceModal = (props) => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${window.sessionStorage.getItem("token")}`;

  const userType = props.userType;
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [input, setInput] = useState();

  const getImage = (e) => {
    const { files } = e.target;
    const image = files[0];

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      setInput(base64String);
    };
  };

  const removeImage = () => {
    setInput(null);
  };

  const saveInvoiceDetails = () => {
    setLoading(true);
    const apiBody = {
      table: "orders",
      attribute: "order_id",
      value: props.orderDetails.order_id,
      operator: "=",
      setValues: {
        invoice: input,
        invoice_amount: amount,
        delivery_status: "delivered",
      },
    };
    axios
      .post("update", apiBody)
      .then((response) => {
        if (response?.data?.res?.changedRows) {
          setLoading(false);
          setShowSuccessMessage(true);
        }
      })
      .catch((error) => {});
  };

  return (
    <>
      <Modal show="true" className="mt-5 modal-component">
        <Modal.Header className="modal-component-header">
          <Modal.Title>
            {userType === "shoppers" ? (
              <>Upload invoice details</>
            ) : (
              <>Check invoice details</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-component-body">
          {userType === "shoppers" && !showSuccessMessage ? (
            <>
              <Form>
                <Form.Group>
                  <Form.Label style={{ margin: "0" }}>Order Id</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter the order id displayed on account page"
                    style={{ marginLeft: "0px" }}
                    value={props.orderDetails.order_id}
                    disabled
                  />
                  <Form.Label style={{ margin: "3% 0 0 0" }}>
                    Invoice amount
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
                    }}
                  />
                </Form.Group>
              </Form>
              {!input && (
                <>
                  <label
                    style={{ marginTop: "20px" }}
                    htmlFor="image-upload"
                    className="btn btn-secondary"
                  >
                    Choose Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={getImage}
                    style={{ display: "none" }}
                  />
                </>
              )}
              {input && (
                <Button
                  style={{ marginTop: "20px" }}
                  variant="secondary"
                  onClick={removeImage}
                >
                  Delete Image
                </Button>
              )}
              {input && (
                <>
                  <br />
                  <br />
                  <img
                    src={"data:image/png;base64," + input}
                    style={{ height: "100%", width: "100%" }}
                    alt=""
                  />
                </>
              )}
            </>
          ) : (
            <>
              {props.orderDetails.invoice && (
                <>
                  <div>
                    <span style={{ fontWeight: "400", fontSize: "18px" }}>
                      Invoice amount:
                    </span>
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "18px",
                        marginLeft: "2%",
                      }}
                    >
                      ${props.orderDetails.invoice_amount}
                    </span>
                  </div>
                  <br />
                  <img
                    src={"data:image/png;base64," + props.orderDetails.invoice}
                    style={{ height: "100%", width: "100%" }}
                    alt=""
                  />
                </>
              )}
            </>
          )}
          {userType === "shoppers" && showSuccessMessage && (
            <>
              <div>Invoice submitted successfully</div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {userType === "shoppers" && !showSuccessMessage && (
            <>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  props.clickHandler(false, "cancel");
                }}
              >
                Cancel
              </Button>
              {loading && (
                <>
                  <Button variant="primary">
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  </Button>
                </>
              )}
              {!loading && (
                <>
                  <Button variant="primary" onClick={saveInvoiceDetails}>
                    Submit
                  </Button>
                </>
              )}
            </>
          )}
          {userType === "shoppers" && showSuccessMessage && (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  props.clickHandler(false, "done");
                }}
              >
                Close
              </Button>
            </>
          )}
          {userType === "customers" && (
            <>
              <Button
                variant="primary"
                onClick={() => {
                  props.clickHandler(false, "done");
                }}
              >
                Close
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvoiceModal;

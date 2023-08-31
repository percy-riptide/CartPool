import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Invoice from "./Invoice";

const PaymentForm = (props) => {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const amount = `$${window.sessionStorage.getItem("amountForPayment")}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${window.sessionStorage.getItem("token")}`;
        const response = await axios.post("pay", {
          amount: parseFloat(amount.match(/([0-9]*[.])?[0-9]+/)[0]) * 100,
          id,
        });

        if (response.status === 200) {
          console.log("Successful payment::" + JSON.stringify(response));
          setLoading(false);
          setSuccess(true);
          const apiBody = {
            table: "orders",
            attribute: "order_id",
            value: window.sessionStorage.getItem("orderIdForPayment"),
            operator: "=",
            setValues: {},
          };
          if (props.payType === "invoice") {
            apiBody.setValues.invoice_status = "paid";
          } else {
            apiBody.setValues.delivery_fee_paid = "paid";
          }
          axios
            .post("update", apiBody)
            .then((response) => {})
            .catch((error) => {});
        }
      } catch (error) {
        console.log("Error", error);
        setLoading(false);
      }
    } else {
      console.log(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show="true" className="mt-5 modal-component">
        <Modal.Header className="modal-component-header">
          <Modal.Title>Make payment</Modal.Title>
        </Modal.Header>

        {!success ? (
          <>
            <Modal.Body className="modal-component-body">
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Delivery fee</Form.Label>
                  <Form.Control type="text" value={amount} disabled="true" />
                </Form.Group>
              </Form>
              <div>Enter your card details below to make the payment</div>
              <form>
                <fieldset
                  className="FormGroup"
                  style={{
                    margin: "2% 0 5% 0",
                    padding: "5%",
                    border: "1px solid lightgrey",
                    borderRadius: "0.3rem",
                  }}
                >
                  <div className="FormRow">
                    <CardElement />
                  </div>
                </fieldset>
              </form>
            </Modal.Body>
            <Modal.Footer>
              {!loading && (
                <>
                  <Button
                    variant="outline-secondary"
                    type="submit"
                    onClick={() => {
                      props.clickHandler(false, "cancel");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Pay
                  </Button>
                </>
              )}
              {loading && (
                <Button variant="primary">
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </Button>
              )}
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Body className="modal-component-body">
              <Invoice amount={amount} />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  props.clickHandler(false, "done");
                }}
              >
                Close
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
};

export default PaymentForm;

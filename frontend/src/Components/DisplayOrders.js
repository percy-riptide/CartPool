import React, { useState } from "react";
import { Button } from "react-bootstrap";
import DisplayOrderDetailsTable from "./DisplayOrderDetailsTable";
import { RxCross2 } from "react-icons/rx";
import { BsFillBagCheckFill } from "react-icons/bs";
import { BsFillChatDotsFill } from "react-icons/bs";
import PaymentGatewayContainer from "./PaymentGatewayContainer";

function DisplayOrders(props) {
  let orderTemp = JSON.parse(props.order.order_details);
  const userType = props.userType;
  const displayType = props.displayType;
  const [showModal, setShowModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentType, setPaymentType] = useState();

  const handleModal = (displayModal, status) => {
    if (!displayModal) {
      setShowModal(false);
    }
  };

  const handlePayModal = (display, reason) => {
    if (!display) {
      setShowPayModal(false);
    }
  };
  return (
    <tr>
      <td>{props.order.order_id}</td>
      <td>{props.order.delivery_fee}</td>
      <td>
        <Button variant="link" onClick={() => setShowModal(true)}>
          View
        </Button>
        {showModal && (
          <DisplayOrderDetailsTable
            orderDetails={orderTemp}
            order={props.order}
            clickHandler={handleModal}
          ></DisplayOrderDetailsTable>
        )}
      </td>
      <td>{props.order.delivery_address}</td>
      <td>
        {userType === "shoppers" && (
          <>
            {displayType !== "account" && (
              <Button
                variant="outline-success"
                onClick={(event) => props.acceptOrder(event, props.order)}
              >
                <BsFillBagCheckFill />
              </Button>
            )}{" "}
            {!props.order.invoice && displayType !== "account" && (
              <>
                <Button
                  variant="outline-danger"
                  onClick={() => props.rejectOrder(props.order)}
                >
                  <RxCross2 />
                </Button>{" "}
              </>
            )}
            {!props.order.invoice && displayType === "account" && (
              <>
                <Button
                  variant="outline-danger"
                  onClick={() => props.rejectOrder(props.order)}
                >
                  Reject
                </Button>{" "}
              </>
            )}
            {displayType === "account" && !props.order.invoice && (
              <>
                <Button
                  variant="outline-success"
                  onClick={() => props.invoice(props.order)}
                >
                  Upload invoice
                </Button>{" "}
              </>
            )}
            {displayType === "account" && props.order.invoice && (
              <>
                <Button variant="outline-secondary" disabled>
                  Invoice submitted
                </Button>{" "}
              </>
            )}
            {displayType === "account" && props.order.invoice && (
              <>
                <Button variant="outline-secondary" disabled>
                  Delivered
                </Button>{" "}
              </>
            )}
            {displayType !== "account" && (
              <Button
                variant="outline-primary"
                onClick={() => props.bargainOrder(props.order)}
              >
                <BsFillChatDotsFill />
              </Button>
            )}
          </>
        )}
        {userType === "shoppers" &&
          displayType === "account" &&
          props.order.delivery_fee_paid === "paid" && (
            <>
              <Button variant="outline-secondary" disabled>
                Delivery fees paid
              </Button>{" "}
            </>
          )}
        {userType === "shoppers" && props.order.invoice_status === "paid" && (
          <>
            <Button variant="outline-secondary" disabled>
              Invoice paid
            </Button>{" "}
          </>
        )}
        {userType === "customers" && !props.order.delivery_fee_paid && (
          <>
            <Button
              variant="outline-success"
              onClick={() => {
                setShowPayModal(true);
                setPaymentType("delivery_fee");
                window.sessionStorage.setItem(
                  "orderIdForPayment",
                  props.order.order_id
                );
                window.sessionStorage.setItem(
                  "amountForPayment",
                  props.order.delivery_fee
                );
              }}
            >
              Pay delivery fee
            </Button>{" "}
          </>
        )}
        {userType === "customers" && props.order.delivery_fee_paid && (
          <>
            <Button variant="outline-secondary" disabled="true">
              Delivery fee paid
            </Button>{" "}
          </>
        )}
        {userType === "customers" && showPayModal && (
          <PaymentGatewayContainer
            clickHandler={handlePayModal}
            payType={paymentType}
          />
        )}
        {userType === "customers" && props.order.invoice && (
          <>
            <Button
              variant="outline-primary"
              onClick={() => props.invoice(props.order)}
            >
              View Invoice
            </Button>{" "}
          </>
        )}
        {userType === "customers" &&
          props.order.invoice &&
          props.order.invoice_status !== "paid" && (
            <>
              <Button
                variant="outline-success"
                onClick={() => {
                  setShowPayModal(true);
                  setPaymentType("invoice");
                  window.sessionStorage.setItem(
                    "orderIdForPayment",
                    props.order.order_id
                  );
                  window.sessionStorage.setItem(
                    "amountForPayment",
                    props.order.invoice_amount
                  );
                }}
              >
                Pay invoice amount
              </Button>{" "}
            </>
          )}
        {userType === "customers" &&
          props.order.invoice &&
          props.order.invoice_status === "paid" && (
            <>
              <Button variant="outline-secondary" disabled="true">
                Invoice paid
              </Button>{" "}
            </>
          )}
      </td>
      <td>{props.distance}</td>
    </tr>
  );
}
export default DisplayOrders;

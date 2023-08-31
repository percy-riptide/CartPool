import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import PaymentGateway from "./PaymentGateway";

const PUBLIC_KEY =
  "your stripe key go here";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const PaymentGatewayContainer = (props) => {
  const handleModal = (showModal, status) => {
    props.clickHandler(showModal, status);
  };
  return (
    <Elements stripe={stripeTestPromise}>
      <PaymentGateway clickHandler={handleModal} payType={props.payType} />
    </Elements>
  );
};

export default PaymentGatewayContainer;

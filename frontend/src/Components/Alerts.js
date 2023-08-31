import React, { useState } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/Toast";

function DisplayAlerts(props) {
  const [show, setShow] = useState(true);
  return (
    <ToastContainer style={{ position: "absolute", right: 0, border: "0px" }}>
      <Toast
        bg={props.variant.toLowerCase()}
        delay={3000}
        onClose={() => setShow(false)}
        show={show}
        autohide
      >
        <Toast.Body style={{ color: "white" }}>{props.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default DisplayAlerts;

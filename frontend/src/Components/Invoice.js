import React from "react";
import { FcApproval } from "react-icons/fc";

const Invoice = (props) => {
  const invoiceNumber =
    "ORDERID-" + window.sessionStorage.getItem("orderIdForPayment");
  return (
    <>
      <div
        style={{
          padding: "7%",
          border: "1px solid lightgrey",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "7%" }}>
          <FcApproval style={{ height: "2rem", width: "2rem" }} />
          <h5>Payment successful!</h5>
        </div>
        <div>
          <p style={{ marginBottom: "0", fontWeight: "600" }}>
            {window.sessionStorage.getItem("username")}
          </p>
          <p style={{ marginBottom: "0", fontWeight: "300", fontSize: "14px" }}>
            Invoice # {invoiceNumber}
          </p>
          <p style={{ marginBottom: "0", fontWeight: "300", fontSize: "14px" }}>
            {new Date().toLocaleString().slice(0, 8)}
          </p>
        </div>
        <hr style={{ margin: "1rem 0 0.5rem 0px" }}></hr>
        <div>
          <span style={{ float: "left" }}>Delivery Fee</span>
          <span style={{ float: "right" }}>{props.amount}</span>
        </div>
        <hr
          style={{
            margin: "2.5rem 0 0.5rem 0px",
            borderTop: "7px solid #8c8b8b",
          }}
        ></hr>
        <div style={{ fontWeight: "700" }}>
          <span style={{ float: "left" }}>Total</span>
          <span style={{ float: "right" }}>{props.amount}</span>
        </div>
        <hr
          style={{
            margin: "2.5rem 0 0.5rem 0px",
            borderTop: "7px solid #8c8b8b",
          }}
        ></hr>
        <div>
          <p
            style={{
              textAlign: "center",
              marginTop: "11%",
              marginBottom: "2%",
              fontWeight: "300",
              fontSize: "large",
            }}
          >
            Team CartPool
          </p>
          <p
            style={{
              fontWeight: "300",
              fontSize: "12px",
              fontStyle: "italic",
              textAlign: "center",
              marginBottom: "0px",
            }}
          >
            Incase of any inquiries email us at teamCartPool@gmail.com
          </p>
        </div>
      </div>
    </>
  );
};

export default Invoice;

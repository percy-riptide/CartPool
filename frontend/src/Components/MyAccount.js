import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import UnauthorizedPage from "./UnauthorizedPage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DisplayOrders from "./DisplayOrders";
import InvoiceModal from "./FinalInvoiceModal";

import Badge from "react-bootstrap/Badge";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
firebase.initializeApp({
// your firebase settings go here
});
const firestore = firebase.firestore();

const MyAccount = () => {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${window.sessionStorage.getItem("token")}`;

  const [showBellIcon, setShowBellIcon] = useState(false);
  const [orderId, setOrderId] = useState();
  const chatWithRef = firestore.collection("chatWith");
  let chatWithQuery = chatWithRef.limit(100);
  let [chatWith] = useCollectionData(chatWithQuery, { idField: "id" });
  if (!showBellIcon) {
    if (
      chatWith?.length &&
      chatWith[0].chatWith === window.sessionStorage.getItem("username")
    ) {
      setOrderId(chatWith.orderId);
      setShowBellIcon(true);
    }
  }

  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [userType, setUserType] = useState("");
  const [username, setUserName] = useState("");
  const [useremail, setUserEmail] = useState("");
  const [usercontact, setUserContact] = useState("");
  const [myOrders, setMyOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [currOrderInvoice, setCurrOrderInvoice] = useState(false);

  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
    const storedUserType = window.sessionStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
    if (!filteredOrders.length) {
      if (userType === "customers") {
        let createReq = {
          table: "customers",
          operator: "=",
          attribute: "customer_username",
          value: `${user}`,
        };
        axios
          .post("fetch", createReq)
          .then((response) => {
            setUserName(response.data[0].customer_username);
            setUserEmail(response.data[0].customer_email);
            setUserContact(response.data[0].customer_phone);
          })
          .catch((err) => {
            console.log(err);
          });
        axios
          .post("fetch", { table: "orders", allRows: "true" })
          .then((resp) => {
            setMyOrders(resp.data);
            setFilteredOrders(
              myOrders.filter((o) => o.customer_username === `${user}`)
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        let createReq = {
          table: "shoppers",
          operator: "=",
          attribute: "shopper_username",
          value: `${user}`,
        };
        axios
          .post("fetch", createReq)
          .then((response) => {
            setUserName(response.data[0].shopper_username);
            setUserEmail(response.data[0].shopper_email);
            setUserContact(response.data[0].shopper_phone);
          })
          .catch((err) => {
            console.log(err);
          });
        axios
          .post("fetch", { table: "orders", allRows: "true" })
          .then((resp) => {
            setMyOrders(resp.data);
            setFilteredOrders(
              myOrders.filter((o) => o.accepted_by === `${user}`)
            );
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, [user, userType, myOrders]);

  const handleLogout = () => {
    window.sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const readMessages = () => {
    const params = {
      chatWith: window.sessionStorage.getItem("username"),
      orderId: orderId,
    };
    navigate("/chat", { state: params }, "_blank");
  };

  let rejectOrders = (order) => {
    let updatedOrder = filteredOrders.filter((currOrder) => {
      return currOrder.order_id !== order.order_id;
    });
    axios
      .post("update", {
        table: "orders",
        attribute: "order_id",
        value: order.order_id,
        operator: "=",
        setValues: {
          accepted_by: null,
        },
      })
      .then((response) => {})
      .catch((error) => {});
    setFilteredOrders([...updatedOrder]);
  };

  const uploadInvoice = (order) => {
    setShowInvoiceModal(true);
    setCurrOrderInvoice(order);
  };

  const handleInvoiceModal = (hideModal, reason) => {
    if (!hideModal) {
      setShowInvoiceModal(false);
    }
  };

  return (
    <>
      {showInvoiceModal && (
        <>
          <InvoiceModal
            clickHandler={handleInvoiceModal}
            orderDetails={currOrderInvoice}
            userType={userType}
          />
        </>
      )}
      {!(user === null || user === "") ? (
        <>
          <Container style={{ marginBottom: "10%", maxWidth: "100%" }}>
            <Row className="justify-content-center mt-5">
              <Col xs={12} md={12}>
                <Card>
                  <Card.Header>
                    <h3>My {userType} account</h3>
                  </Card.Header>
                  <Card.Body>
                    <p>Name: {username}</p>
                    <p>Email: {useremail}</p>
                    <p>Phone: {usercontact}</p>
                  </Card.Body>
                  <Card.Footer
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button variant="primary" onClick={handleLogout}>
                      Log out
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            </Row>

            {userType === "customers" && (
              <>
                <Row className="justify-content-center mt-5">
                  <Col xs={12} md={6}>
                    <Card>
                      <Card.Header>
                        <h3>Notifications</h3>
                      </Card.Header>
                      <Card.Body>
                        {showBellIcon && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span>You've new notification</span>
                              <span>
                                <Button
                                  variant="primary"
                                  onClick={readMessages}
                                >
                                  New message{" "}
                                  <Badge
                                    style={{
                                      backgroundColor: "white !important",
                                      color: "blue",
                                    }}
                                  >
                                    1+
                                  </Badge>
                                  <span className="visually-hidden">
                                    unread messages
                                  </span>
                                </Button>
                              </span>
                            </div>
                          </>
                        )}
                        {!showBellIcon && (
                          <>
                            <div>You have no new notifications.</div>
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            <Row className="justify-content-center mt-5">
              <Col xs={12} md={12}>
                <Card>
                  {filteredOrders.length > 0 ? (
                    <>
                      <Card.Header>
                        <h3>My Orders</h3>
                      </Card.Header>
                      <Card.Body>
                        <Table responsive striped>
                          <thead style={{ textAlign: "center" }}>
                            <tr>
                              <th>Order Id </th>
                              <th>Delivery Fee</th>
                              <th>Order Details</th>
                              <th>Address</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody style={{ textAlign: "center" }}>
                            {filteredOrders.map((order, index) => (
                              <DisplayOrders
                                key={index}
                                order={order}
                                userType={userType}
                                rejectOrder={rejectOrders}
                                invoice={uploadInvoice}
                                displayType="account"
                              />
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </>
                  ) : (
                    <>
                      <Card.Header>
                        <h3>My orders</h3>
                      </Card.Header>
                      <Card.Body>
                        <p>You have no orders</p>
                      </Card.Body>
                    </>
                  )}
                </Card>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <>
          <UnauthorizedPage userType="Customers / Shoppers" />
        </>
      )}
    </>
  );
};

export default MyAccount;

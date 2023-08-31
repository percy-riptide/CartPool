import React, { useState, useEffect } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { motion } from "framer-motion";
import DisplayRow from "./DisplayRow";
import EditingRow from "./EditingRow";
import Dropdown from "react-bootstrap/Dropdown";
import InputGroup from "react-bootstrap/InputGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UnauthorizedPage from "./UnauthorizedPage";
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng,
// } from "react-places-autocomplete";
import AddressAutoComplete from "./AddressAutoComplete";

function CustomerOrderPage() {
  const [input, setInput] = useState(null);
  const [user, setUser] = useState("");
  const [userType, setUserType] = useState("");
  useEffect(() => {
    const storedUser = window.sessionStorage.getItem("username");
    if (storedUser) {
      setUser(storedUser);
    }
    const storedUserType = window.sessionStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);

  const addressCreated = (latLng,address) => {
    setLang(latLng.lat);
    setLong(latLng.lng);
    setGetAddress(address);
  };
  
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
  const navigate = useNavigate();
  const addresses = [
    {
      id: "1",
      address: "6967 Bayers Road",
    },
    {
      id: "2",
      address: "5991 Spring Garden Road",
    },
  ];
  const stores = [
    {
      id: "1",
      store: "Walmart",
    },
    {
      id: "2",
      store: "Sobeys",
    },
    {
      id: "3",
      store: "Atlantic SuperStore",
    },
  ];

  const [deliveryFee, setDeliveryFee] = useState(2);
  const [getAddress, setGetAddress] = useState("");
  const [preferredStore, setPreferredStore] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [preferredBrand, setPreferredBrand] = useState("");
  const [alternateBrand, setAlternateBrand] = useState("");
  const [itemNumber, setItemNumber] = useState(1);
  const [finalOrder, setFinalOrder] = useState([]);
  let [lat, setLang] = useState("");
  let [long, setLong] = useState("");
  const [addFormData, setAddFormData] = useState({
    itemName: "",
    itemQuantity: "",
    preferredBrand: "",
    alternateBrand: "",
  });
  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;
    setAddFormData(newFormData);
  };
  const handleAddFormSubmit = (event) => {
    event.preventDefault();
    setItemNumber(itemNumber + 1);
    const newOrderDetails = {
      itemNo: itemNumber,
      itemName: addFormData.itemName,
      itemQuantity: addFormData.itemQuantity,
      preferredBrand: addFormData.preferredBrand,
      alternateBrand: addFormData.alternateBrand,
    };
    const newOrder = [...finalOrder, newOrderDetails];
    setFinalOrder(newOrder);
    setItemName("");
    setItemQuantity("");
    setPreferredBrand("");
    setAlternateBrand("");
  };
  const [editItemId, setEditItemId] = useState(null);
  const handleEditClick = (event, order) => {
    event.preventDefault();
    setEditItemId(order.itemNo);
    const formValues = {
      itemName: order.itemName,
      itemQuantity: order.itemQuantity,
      preferredBrand: order.preferredBrand,
      alternateBrand: order.alternateBrand,
    };
    setEditFormData(formValues);
  };
  const [editFormData, setEditFormData] = useState({
    itemName: "",
    itemQuantity: "",
    preferredBrand: "",
    alternateBrand: "",
  });
  const handleEditFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;
    const newFormData = { ...editFormData };
    newFormData[fieldName] = fieldValue;
    setEditFormData(newFormData);
  };
  const removeImage = () => {
    setInput(null);
  };
  const handleEditFormSubmit = (event, order) => {
    event.preventDefault();
    const editedOrder = {
      itemNo: editItemId,
      itemName: editFormData.itemName,
      itemQuantity: editFormData.itemQuantity,
      preferredBrand: editFormData.preferredBrand,
      alternateBrand: editFormData.alternateBrand,
    };
    const OrderInfo = [...finalOrder];
    const index = finalOrder.findIndex((order) => order.itemNo === editItemId);
    OrderInfo[index] = editedOrder;
    setFinalOrder(OrderInfo);
    setEditItemId(null);
  };
  const handleCancelClick = () => {
    setEditItemId(null);
  };
  const handleDeleteClick = (itemId) => {
    var iterator = 1;
    const orderInfo = [...finalOrder];
    const index = finalOrder.findIndex((order) => order.itemNo === itemId);
    orderInfo.splice(index, 1);
    orderInfo.forEach((orderInfo) => {
      orderInfo["itemNo"] = iterator;
      iterator += 1;
    });
    setItemNumber(iterator);
    setFinalOrder(orderInfo);
  };

  const handleClearFields = () => {
    setItemName("");
    setItemQuantity("");
    setPreferredBrand("");
    setAlternateBrand("");
  };

  const handlePreferredStore = (event) => {
    setPreferredStore(event);
  };

  const handleSubmitOrder = () => {
    let createReq = {
      table: "orders",
      setValues: {
        customer_username: window.sessionStorage.getItem("username"),
        order_details: JSON.stringify(finalOrder),
        delivery_address: getAddress,
        preferred_store: preferredStore,
        delivery_fee: deliveryFee,
        order_details_blob: input,
        delivery_latitude: lat,
        delivery_longitude: long,
      },
    };
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${window.sessionStorage.getItem("token")}`;
    axios
      .post("create", createReq)
      .then()
      .catch((error) => {});
    navigate("/account");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {userType === "customers" && (
        <>
          <div style={{ marginRight: "20px", marginLeft: "20px" }}>
            <h1 style={{ marginBottom: "20px" }}>
              What are you getting today {user}?
            </h1>
            <Form className="fluid" onSubmit={handleAddFormSubmit}>
              <Row>
                <Col sm={3}>
                  <Form.Group className="mb-3" controlId="orderDetails">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      name="itemName"
                      placeholder="Name of the product"
                      value={itemName}
                      onChange={(e) => {
                        setItemName(e.target.value);
                        handleAddFormChange(e);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group className="mb-3" controlId="orderDetails">
                    <Form.Label>Item Quantity</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      name="itemQuantity"
                      placeholder="How many would you like?"
                      value={itemQuantity}
                      onChange={(e) => {
                        setItemQuantity(e.target.value);
                        handleAddFormChange(e);
                      }}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group className="mb-3" controlId="orderDetails">
                    <Form.Label>Preferred Brand</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      name="preferredBrand"
                      placeholder="Chosen Brand?"
                      value={preferredBrand}
                      onChange={(e) => {
                        setPreferredBrand(e.target.value);
                        handleAddFormChange(e);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col sm={3}>
                  <Form.Group className="mb-3" controlId="orderDetails">
                    <Form.Label>Alternate Brand</Form.Label>
                    <Form.Control
                      type="text"
                      name="alternateBrand"
                      placeholder="What if the chosen isn't available?"
                      value={alternateBrand}
                      onChange={(e) => {
                        setAlternateBrand(e.target.value);
                        handleAddFormChange(e);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Button
                style={{ marginTop: "20px" }}
                variant="warning"
                onClick={handleClearFields}
              >
                Clear Fields
              </Button>{" "}
              <Button
                style={{ marginTop: "20px" }}
                variant="danger"
                onClick={() => {
                  if (finalOrder.length > 0 || input) {
                    var answer = window.confirm(
                      "Are you sure you want to delete your whole order?"
                    );
                    if (answer) {
                      handleClearFields();
                      setFinalOrder([]);
                      setDeliveryFee(2);
                      setItemNumber(1);
                      setGetAddress("");
                      setPreferredStore("");
                      setInput(null);
                    }
                  }
                }}
              >
                Delete Order
              </Button>{" "}
              <Button
                style={{ marginTop: "20px" }}
                variant="primary"
                type="submit"
              >
                Add Item
              </Button>{" "}
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
            </Form>
          </div>
          <div
            style={{
              marginRight: "20px",
              marginLeft: "20px",
              marginBottom: "40px",
            }}
          >
            {finalOrder.length === 0 && !input && (
              <>
                <h2 style={{ marginTop: "20px" }}>
                  Please add at least one item or upload an image
                </h2>
                <Button
                  style={{ marginTop: "20px" }}
                  variant="info"
                  onClick={() => navigate("/")}
                >
                  Go To HomePage
                </Button>
              </>
            )}
            {(finalOrder.length > 0 || input) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Form
                  className="fluid"
                  onSubmit={handleEditFormSubmit}
                  style={{ marginTop: "20px" }}
                >
                  {finalOrder.length > 0 && (
                    <>
                      <Table responsive striped size="sm">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Item Name</th>
                            <th>Item Quantity</th>
                            <th>Preferred Brand</th>
                            <th>Alternate Brand</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {finalOrder.map((order) => (
                            <>
                              {editItemId === order.itemNo ? (
                                <EditingRow
                                  itemNumber={order.itemNo}
                                  editFormData={editFormData}
                                  handleEditFormChange={handleEditFormChange}
                                  handleCancelClick={handleCancelClick}
                                />
                              ) : (
                                <DisplayRow
                                  order={order}
                                  handleEditClick={handleEditClick}
                                  handleDeleteClick={handleDeleteClick}
                                />
                              )}
                            </>
                          ))}
                        </tbody>
                      </Table>
                    </>
                  )}
                  <div className="flex-container">
                    <div
                      className="flex-child"
                      style={{
                        borderRadius: "10px",
                        padding: "15px",
                        boxShadow: "1px 1px 1px",
                        width: "90%",
                        margin: "20px",
                      }}
                    >
                      <p>Delivery Address</p>
                      <AddressAutoComplete
                        setOrderAddress={addressCreated}
                      ></AddressAutoComplete>
                    </div>
                    <div
                      className="flex-child"
                      style={{
                        borderRadius: "10px",
                        padding: "15px",
                        boxShadow: "1px 1px 1px",
                        width: "90%",
                        margin: "20px",
                      }}
                    >
                      <p>Preferred Store</p>
                      <InputGroup className="mb-3">
                        <Form.Control
                          aria-label="Text input with dropdown button"
                          value={preferredStore}
                          onChange={(e) => setPreferredStore(e.target.value)}
                        />
                        <DropdownButton
                          variant="outline-secondary"
                          title="Existing"
                          id="input-group-dropdown-1"
                          onSelect={handlePreferredStore}
                        >
                          {stores.map((stores) => (
                            <>
                              <Dropdown.Item eventKey={stores.store}>
                                {stores.store}
                              </Dropdown.Item>
                            </>
                          ))}
                          <Dropdown.Divider />
                          <Dropdown.Item
                            onClickCapture={() => {
                              setPreferredStore("");
                            }}
                          >
                            Clear
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item>Cancel</Dropdown.Item>
                        </DropdownButton>
                      </InputGroup>
                    </div>
                    <div
                      className="flex-child"
                      style={{
                        borderRadius: "10px",
                        padding: "15px",
                        boxShadow: "1px 1px 1px",
                        width: "90%",
                        margin: "20px",
                      }}
                    >
                      <p style={{ textAlign: "center" }}>
                        Delivery Fee: {deliveryFee}CAD
                      </p>
                      <Form.Range
                        style={{ width: "100%" }}
                        min="1"
                        max="10"
                        step={0.25}
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                      />
                    </div>
                  </div>
                </Form>
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
                <br />
                <Button
                  style={{ marginTop: "2%" }}
                  variant="success"
                  onClick={handleSubmitOrder}
                >
                  Submit Order
                </Button>
              </motion.div>
            )}
          </div>
        </>
      )}
      {userType !== "customers" && (
        <>
          <UnauthorizedPage userType="customers" />
        </>
      )}
    </motion.div>
  );
}

export default CustomerOrderPage;

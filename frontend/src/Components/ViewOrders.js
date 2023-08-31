import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Table } from "react-bootstrap";
import { MDBSwitch } from "mdb-react-ui-kit";
import axios from "axios";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import DisplayOrders from "./DisplayOrders";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import UnauthorizedPage from "./UnauthorizedPage";

let ViewOrders = (props) => {
  let count = 0;
  let [isNotOnline, setOrders] = useStateWithCallbackLazy(true);
  let [acceptOrderCount, setAcceptOrderCount] = useState(0);
  let [finalOrder, setAllOrders] = useState([]);
  let [currentOrder, setCurrentOrders] = useState([]);
  let [backupCurrentOrder, setBackupCurrentOrders] = useState([]);
  const [preferredStore, setPreferredStore] = useState("All Store");
  const [store, setStore] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [distance, setDistance] = useState(10);
  const navigate = useNavigate();

  let onToggle = () => {
    setOrders(!isNotOnline, () => {
      if (isNotOnline) {
        getCurrentLocation();
        getAllOrders();
      }
    });
  };

  useEffect(() => {
    axios
      .post("fetch", { table: "orders", allRows: "true" })
      .then((resp) => {})
      .catch((err) => {});
  }, [acceptOrderCount]);

  const checkFilterType = (distance, store) => {
    handleDistance(distance, store);
  };

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

  let getAllOrders = () => {
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${window.sessionStorage.getItem("token")}`;
    axios
      .post("fetch", { table: "orders", allRows: "true" })
      .then((resp) => {
        let preferredAllStore = resp.data.map((value) => {
          return value.preferred_store;
        });
        setStore([...new Set(preferredAllStore)]);
        const filteredOrder = resp.data.filter(
          (o) => o.accepted_by !== `${user}` && o.accepted_by === null
        );
        setCurrentOrders(filteredOrder);
        setBackupCurrentOrders(filteredOrder);
        setAllOrders(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let acceptOrders = (e, order) => {
    let updatedOrder = currentOrder.filter((currOrder) => {
      return currOrder.order_id !== order.order_id;
    });
    setCurrentOrders([...updatedOrder]);
    setBackupCurrentOrders([...updatedOrder]);
    setAcceptOrderCount(count++);
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${window.sessionStorage.getItem("token")}`;
    axios
      .post("update", {
        table: "orders",
        attribute: "order_id",
        value: order.order_id,
        operator: "=",
        setValues: { accepted_by: user },
      })
      .then()
      .catch((err) => {
        console.log(err);
      });
  };

  let rejectOrders = (order) => {
    let updatedOrder = currentOrder.filter((currOrder) => {
      return currOrder.order_id !== order.order_id;
    });
    setCurrentOrders([...updatedOrder]);
    setBackupCurrentOrders([...updatedOrder]);
  };

  let bargainOrders = (order) => {
    const params = {
      chatWith: order.customer_username,
      orderId: order.order_id,
    };
    navigate("/chat", { state: params }, "_blank");
  };

  const getCurrentLocation = () => {
    const success = (pos) => {
      const crd = pos.coords;
      setLatitude(crd.latitude);
      setLongitude(crd.longitude);
      console.log("Your current position is:");
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    };
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const error = (error) => {
      console.log("Error getting co-ordinates." + JSON.stringify(error));
      setLatitude(44.63833);
      setLongitude(-63.58447);
      getAllOrders();
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  const handleDistance = (eDistance, eStore) => {
    let orders = backupCurrentOrder;
    let filteredData = [];
    let finalFilteredData = [];

    orders.forEach((obj) => {
      if (obj.delivery_latitude && obj.delivery_longitude) {
        let radlat1 = (Math.PI * latitude) / 180;
        let radlat2 = (Math.PI * obj.delivery_latitude) / 180;
        let theta = longitude - obj.delivery_longitude;
        let radtheta = (Math.PI * theta) / 180;
        let dist =
          Math.sin(radlat1) * Math.sin(radlat2) +
          Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;

        if (dist <= eDistance) {
          filteredData = [...filteredData, obj];
        }
      }
    });

    filteredData.forEach((obj) => {
      if (eStore && eStore !== "All Store" && obj.preferred_store === eStore) {
        finalFilteredData = [...finalFilteredData, obj];
      } else if (eStore === "All Store") {
        finalFilteredData = filteredData;
      }
    });

    setCurrentOrders(finalFilteredData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {userType === "shoppers" && (user !== "" || user !== null) && (
        <>
          <Card className="text-center" style={{ margin: "2% 5% 2% 5%" }}>
            <Card.Body>
              <MDBSwitch
                style={{ height: "2rem", width: "3.5rem" }}
                id="flexSwitchCheckDefault"
                onChange={onToggle}
              />
              <div style={{ marginTop: "1%" }}>
                {isNotOnline && (
                  <h4>Please make yourself online to view orders</h4>
                )}
                {!isNotOnline && (
                  <>
                    <h4>Available Orders</h4>
                    <span>
                      You can view your accepted orders under{" "}
                      <a href="" onClick={() => navigate("/account")}>
                        My Account
                      </a>{" "}
                      tab.
                    </span>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>

          <div>
            {!isNotOnline && (
              <>
                <div>
                  <div className="flex-child">
                    <Card
                      className="text-center"
                      style={{ margin: "2% 5% 2% 5%" }}
                    >
                      <Card.Header>Preferred Store</Card.Header>
                      <Card.Body>
                        <Card.Title>
                          You can filter the list based on your preferred store
                        </Card.Title>
                        <Card.Text>
                          Choose one of the option from the dropdown below:
                        </Card.Text>
                        <InputGroup
                          className="mb-3"
                          style={{ display: "block" }}
                        >
                          <DropdownButton
                            variant="outline-secondary"
                            title={preferredStore}
                            id="input-group-dropdown-1"
                            onSelect={(event) => {
                              setPreferredStore(event);
                              checkFilterType(distance, event);
                            }}
                            disabled={!latitude && !longitude}
                          >
                            {store.map((store) => (
                              <>
                                <Dropdown.Item key={store} eventKey={store}>
                                  {store}
                                </Dropdown.Item>
                              </>
                            ))}
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="All Store">
                              All Store
                            </Dropdown.Item>
                          </DropdownButton>
                        </InputGroup>

                        <div
                          className="flex-child"
                          style={{
                            padding: "15px",
                          }}
                        >
                          <p style={{ textAlign: "center" }}>
                            Distance: {distance} km
                          </p>
                          <Form.Range
                            style={{ width: "100%" }}
                            min="1"
                            max="10"
                            step={0.25}
                            value={distance}
                            onChange={(e) => {
                              setDistance(parseFloat(e.target.value));
                              checkFilterType(
                                parseFloat(e.target.value),
                                preferredStore
                              );
                            }}
                            disabled={!latitude && !longitude}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </div>

                  <Card style={{ margin: "2% 5% 2% 5%" }}>
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
                          {currentOrder.map((order, index) => (
                            <DisplayOrders
                              key={index}
                              order={order}
                              acceptOrder={acceptOrders}
                              rejectOrder={rejectOrders}
                              bargainOrder={bargainOrders}
                              userType="shoppers"
                            />
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
              </>
            )}
          </div>
        </>
      )}
      {userType !== "shoppers" && (
        <>
          <UnauthorizedPage userType="shoppers" />
        </>
      )}
    </motion.div>
  );
};

export default ViewOrders;

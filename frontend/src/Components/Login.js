import React, { useState } from "react";
import { motion } from "framer-motion";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import logo from "../assets/loginpage.png";
import axios from "axios";
import ModalComponent from "./ModalComponent";
import DisplayAlerts from "./Alerts.js";

//import Input from 'react-bootstrap/Input';

function Login() {
  let [loginType, setLoginType] = useState("");
  let [textValue1, setTextValue1] = useState("");
  let [textValue2, setTextValue2] = useState("");
  let [isModalOpen, setModalOpen] = useState(true);

  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();
  let handleLoginTypeChange = (value, type) => {
    setModalOpen(value);
    setLoginType(type);
  };

  const handleTextChange1 = (event) => {
    setTextValue1(event.target.value);
  };
  const handleTextChange2 = (event) => {
    setTextValue2(event.target.value);
  };

  console.log(textValue1);
  console.log(textValue2);

  const handleSubmit = (event) => {
    event.preventDefault();
    let tableName;
    let createReq = {};
    if (loginType === "shoppers") {
      tableName = "shoppers";
      createReq = {
        table: tableName,
        operator: "=",
        attribute: "shopper_username",
        value: textValue1,
        pass: textValue2,
        operation: 'login'
      };
    } else {
      tableName = "customers";
      createReq = {
        table: tableName,
        operator: "=",
        attribute: "customer_username",
        value: textValue1,
        pass: textValue2,
        operation: 'login'
      };
    }
    setShowAlert(false);

    // make POST request using axios
    axios
      .post("fetch", createReq)
      .then((response) => {
        if(response.data.isAuthSuccess){
          window.sessionStorage.setItem("token", response.data.accessToken);
          window.sessionStorage.setItem("username", textValue1);
          window.sessionStorage.setItem("userType", loginType);
          navigate("/");
          window.location.reload();
        }else{
          setAlertMsg("Incorrect password");
          setAlertVariant("danger");
          setShowAlert(true);
        }
      })
      .catch((error) => {});
  }

  return (
    <>
    {showAlert && <DisplayAlerts variant={alertVariant} message={alertMsg} />}
    <motion.div
      className="flex-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex-child centered">
        <div style={{ margin: "20px" }}>
          {isModalOpen && (
            <div>
              <ModalComponent header="Login as"
                  body="How do you wish to login?" clickHandler={handleLoginTypeChange} />
            </div>
          )}
          {!isModalOpen && (
            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-3"
                style={{ margin: "20px" }}
                controlId="formBasicEmail"
              >
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={textValue1}
                  onChange={handleTextChange1}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group
                style={{ margin: "20px" }}
                className="mb-3"
                controlId="formBasicPassword"
              >
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={textValue2}
                  onChange={handleTextChange2}
                  placeholder="Password"
                />
              </Form.Group>
              <Button
                style={{ margin: "20px" }}
                variant="primary"
                type="submit"
              >
                Submit
              </Button>
              <a href="/forgotpassword">Forgot password</a>
            </Form>
          )}
          <p style={{ marginLeft: "20px" }}>
            {" "}
            Don't have an account?<a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
      <div className="flex-child centered">
        <Image src={logo} fluid></Image>
      </div>
    </motion.div>
    </>
  );
}
export default Login;
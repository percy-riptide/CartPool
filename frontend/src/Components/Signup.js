import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import logo from "../assets/undraw_sign__up_nm4k.png";
import ModalComponent from "./ModalComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form, Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import PasswordChecklist from "react-password-checklist";
import AddressAutoComplete from "./AddressAutoComplete";

function SignUp() {
  const [username, setUserName] = useState("");
  const [showPasswordMismatchModal, setShowPasswordMismatchModal] =
    useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  let [street, setStreet] = useState("");
  let [email, setEmail] = useState("");
  let [phoneNumber, setPhoneNumber] = useState("");
  let [password, passwordSet] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [isModalOpen, checkModal] = useState(true);
  let [type, setUserType] = useState("");
  let [errorMessage, setErrorMessage] = useState("");
  let [isFormValid, isFormCorrect] = useState(true);
  let [isPasswordValid, isPasswordCorrect] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  let [lat, setLang] = useState("");
  let [long, setLong] = useState("");
  const navigate = useNavigate();
  const ModalHandle = (value, type) => {
    checkModal(value);
    setUserType(type);
  };

  const userNameChange = (event) => {
    setUserName(event.target.value);
  };

  const emailChange = (event) => {
    setEmail(event.target.value);
  };

  const phoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };
  const passwordChange = (event) => {
    passwordSet(event.target.value);
  };
  const confirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };
  const addressCreated = (address, latLng) => {
    setStreet(address);
    setLang(latLng.lat);
    setLong(latLng.lng);
  };
  let createReq = {};
    if (type === "customers") {
      createReq = {
        table: type,
        operation: "signup",
        setValues: {
          customer_username: username,
          customer_email: email,
          customer_street: street,
          customer_phone: phoneNumber,
          customer_password: password,
          customer_latitude: lat,
          customer_longitude: long,
        },
      };
    } else {
      createReq = {
        table: type,
        operation: "signup",
        setValues: {
          shopper_username: username,
          shopper_email: email,
          shopper_street: street,
          shopper_phone: phoneNumber,
          shopper_password: password,
        },
      };
    }
  const submitSignUp = (event) => {
    event.preventDefault();
    if (isPasswordValid) {
      setShowTermsModal(true);
    } else {
      isPasswordCorrect(false);
      setShowPasswordMismatchModal(true);
      setErrorMessage("Incorrect Confirm Password");
    }
  };
  const handleClosePasswordMismatchModal = () =>
    setShowPasswordMismatchModal(false);
  const handleCloseTermsModal = () => setShowTermsModal(false);
  const handleTermsAccepted = () => {
    setShowTermsModal(false);
    axios
    .post("create", createReq)
    .then((response) => {
      navigate("/login");
    })
    .catch((error) => {
      isFormCorrect(false);
      isPasswordCorrect(true);
      setErrorMessage(error);
    });
  }
  return (
    <>
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
                <ModalComponent
                  header="Sign Up as"
                  body="How do you wish to sign up?"
                  clickHandler={ModalHandle}
                />
              </div>
            )}
            {!isModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 style={{ marginLeft: "20px", marginRight: "20px" }}>
                  We are so glad you are joining one of our {type}!{" "}
                  <a
                    href=""
                    onClick={() => {
                      window.location.reload();
                    }}
                  >
                    Change
                  </a>
                </h1>
                <Form onSubmit={submitSignUp} style={{ margin: "20px" }}>
                  <Form.Group className="mb-1" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      required
                      placeholder="Make it sassy B)"
                      onChange={userNameChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-1" controlId="Street">
                    <Form.Label>Address</Form.Label>
                    <AddressAutoComplete
                      addressFunction={addressCreated}
                    ></AddressAutoComplete>
                  </Form.Group>
                  <Form.Group className="mb-1" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      required
                      placeholder="we won't spam you :)"
                      onChange={emailChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-1" controlId="PhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phoneNumber}
                      required
                      maxLength={10}
                      minLength={10}
                      placeholder="communication is key ;)"
                      onChange={phoneNumberChange}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-1" controlId="Password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={password}
                      required
                      placeholder="Keep your account secure!"
                      onChange={passwordChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-1" controlId="ConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      required
                      placeholder="Type it again! Just to be sure :P"
                      onChange={confirmPasswordChange}
                    />
                  </Form.Group>
                  <PasswordChecklist
                    style={{ marginTop: "20px" }}
                    rules={[
                      "minLength",
                      "specialChar",
                      "number",
                      "capital",
                      "match",
                    ]}
                    minLength={8}
                    value={password}
                    valueAgain={confirmPassword}
                    onChange={(isValid) => {
                      if (isValid) {
                        isPasswordCorrect(true);
                      } else {
                        isPasswordCorrect(false);
                      }
                    }}
                  />
                  <Form.Group controlId="formSubmit" className="mt-1">
                    <h5>
                      {!isFormValid && (
                        <h5
                          style={{ marginTop: "20px" }}
                          className="alert alert-danger"
                        >
                          Could not signup, please try again later!
                        </h5>
                      )}{" "}
                    </h5>
                    <Button
                      style={{ marginTop: "10px", marginBottom: "30px" }}
                      variant="success"
                      type="submit"
                    >
                      Sign Up
                    </Button>
                  </Form.Group>
                </Form>
                <Modal
                  show={showPasswordMismatchModal}
                  onHide={handleClosePasswordMismatchModal}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Password Mismatch</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Your password and confirm password fields do not match.
                      Please try again.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleClosePasswordMismatchModal}
                    >
                      OK
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal show={showTermsModal} onHide={handleCloseTermsModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Terms and Conditions</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Please go through the terms and conditions and accept them to create your account.
                    </p>
                    <h2> Customers </h2>
                    <ul>
                      <li>
                        You will rightfully pay what is owed to the shopper
                      </li>
                      <li>You will not create fake orders</li>
                      <li>
                        Be nice to the shoppers
                      </li>
                      <li>We are not liable for any losses incurred due to calamities</li>
                      <li>You are bound by the governing laws</li>
                    </ul>
                    <h2> Customers </h2>
                    <ul>
                      <li>
                        You will deliver the orders that you accept
                      </li>
                      <li>You will not ask the customers for extra money if it isn't a tip</li>
                      <li>
                        You will only be paid for what you are getting apart from the delivery fee
                      </li>
                      <li>We are not liable for any losses incurred due to calamities</li>
                      <li>You are bound by the governing laws</li>
                    </ul>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTermsModal}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleTermsAccepted}>Accept</Button>
                  </Modal.Footer>
                </Modal>
              </motion.div>
            )}
          </div>
        </div>
        <div className="flex-child centered">
          <Image src={logo} fluid></Image>
        </div>
      </motion.div>
    </>
  );
}

export default SignUp;
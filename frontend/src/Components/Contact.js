import React, { useState } from "react";
import Image from "react-bootstrap/Image";
import logo from "../assets/help.png";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function Contact() {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${window.sessionStorage.getItem("token")}`;

  let [emailValue, setEmail] = useState("");
  let [phoneValue, setPhone] = useState("");
  let [messageValue, setMessage] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const navigate = useNavigate();

  function handleFormSubmit(event) {
    event.preventDefault();
    let createReq = {
      table: "contact",
      operation: "support",
      setValues: {
        email: emailValue,
        phone: phoneValue,
        issue: messageValue,
      },
    };
    axios
      .post("create", createReq)
      .then((response) => {
        alert("Thank you!, we will contact you soon!");
        navigate("/");
      })
      .catch((error) => {});
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
            <h1>Always here to help!</h1>
            <br />
            <p style={{ fontSize: "18px" }}>
              Please send us a query so we can help you better!
            </p>
            <Form
              onSubmit={(e) => {
                handleFormSubmit(e);
              }}
            >
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={emailValue}
                  onChange={handleEmailChange}
                  required
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="tel"
                  required
                  minLength={10}
                  maxLength={10}
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  placeholder="Enter Phone Number"
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="textarea">
                <Form.Label>What's the issue?</Form.Label>
                <Form.Control
                  as="textarea"
                  required
                  rows={3}
                  value={messageValue}
                  onChange={handleMessageChange}
                  placeholder="Describe your issue for us"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  required
                  label="I agree to be called by Cart Pool"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
        <div className="flex-child centered">
          <Image src={logo} fluid></Image>
        </div>
      </motion.div>
    </>
  );
}

export default Contact;

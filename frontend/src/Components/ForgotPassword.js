import React, { useState } from "react";
import axios from "axios";
import DisplayAlerts from "./Alerts.js";
import ModalComponent from "./ModalComponent";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { useTimer } from "react-timer-hook";
import Image from "react-bootstrap/Image";
import logo from "../assets/undraw_sign__up_nm4k.png";
import PasswordChecklist from "react-password-checklist";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPswrd, setConfirmPswrd] = useState("");
  const [profile, setProfile] = useState("");
  const [otpExpMsg, setOtpExpMsg] = useState("");
  const [validated, setValidated] = useState(false);
  const [isInfoForm, setIsInfoForm] = useState(true);
  const [isOTPForm, setIsOTPForm] = useState(false);
  const [isCredForm, setIsCredForm] = useState(false);
  const [isSuccessScreen, setIsSuccessScreen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showResendBtn, setShowResendBtn] = useState(true);

  const signUpHandle = (value, type) => {
    setShowModal(value);
    setProfile(type);
  };

  const handleInfoFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else if (form.checkValidity()) {
      event.preventDefault();
      setValidated(false);
      handleForgotPassword();
    }
  };

  const handleOTPFormSubmit = async (event) => {
    const form = event.currentTarget;
    setShowAlert(false);

    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else if (form.checkValidity()) {
      event.preventDefault();
      setValidated(false);
      const isOTPValid = await matchOTP();
      if (isOTPValid) {
        setIsOTPForm(false);
        setIsCredForm(true);
        setAlertMsg("Verification code matched!");
        setAlertVariant("success");
        setShowAlert(true);
      } else {
        event.stopPropagation();
        setValidated(true);
        setAlertMsg("Verification code does not match, please check again");
        setAlertVariant("danger");
        setShowAlert(true);
      }
    }
  };

  const handleForgotPassword = () => {
    setShowAlert(false);
    const otpCode = (Math.random() + 1).toString(36).substring(2);
    if (email && profile) {
      let apiBody = {
        table: profile,
        attribute: profile.includes("customers")
          ? "customer_username"
          : "shopper_username",
        value: username,
        operator: "=",
        operation: "resetPassword",
        email: email,
        sendEmail: true,
        emailSubject: "Reset your password",
        emailBody: `Your one time verification code: <strong>${otpCode}</strong>`,
      };
      axios
        .post("fetch", apiBody)
        .then((response) => {
          if (response?.data) {
            setIsInfoForm(false);
            setIsOTPForm(true);
            setAlertMsg("Verification code sent to the email");
            setAlertVariant("success");
            setShowAlert(true);
            updateDatabaseOtp(otpCode);
          }
        })
        .catch((error) => {
          setAlertMsg("Could not find user");
          setAlertVariant("danger");
          setShowAlert(true);
        });
    }
  };

  const [passwordValidation, setPasswordValidation] = useState(false);

  const handleCredFormSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
    } else if (form.checkValidity()) {
      event.preventDefault();
      setValidated(false);
      setIsCredForm(false);
      if (passwordValidation) {
        setUpdatedPassword();
      } else {
        event.stopPropagation();
        setValidated(true);
        setAlertMsg("Could not update password, please try again later");
        setAlertVariant("danger");
        setShowAlert(true);
      }
    }
  };

  const updateDatabaseOtp = (otpCode) => {
    let apiBody = {
      table: profile,
      attribute: profile.includes("customers")
        ? "customer_username"
        : "shopper_username",
      value: username,
      operator: "=",
      operation: "resetPassword",
      setValues: {},
    };
    if (profile.includes("customers")) {
      apiBody.setValues.customer_otp = otpCode;
    } else {
      apiBody.setValues.shopper_otp = otpCode;
    }
    axios
      .post("update", apiBody)
      .then((response) => {})
      .catch((error) => {});
  };

  const matchOTP = async () => {
    if (username) {
      let apiBody = {
        table: profile,
        attribute: profile.includes("customers")
          ? "customer_username"
          : "shopper_username",
        value: username,
        operator: "=",
        operation: "verifyOTP",
        otp,
      };
      const response = await axios.post("fetch", apiBody);
      if (response?.data) {
        return true;
      } else {
        return false;
      }
    }
  };

  const setUpdatedPassword = () => {
    let apiBody = {
      table: profile,
      attribute: profile.includes("customers")
        ? "customer_username"
        : "shopper_username",
      value: username,
      operator: "=",
      operation: "resetPassword",
      setValues: {},
    };
    if (profile.includes("customers")) {
      apiBody.setValues.customer_password = confirmPswrd;
    } else {
      apiBody.setValues.shopper_password = confirmPswrd;
    }

    axios
      .post("update", apiBody)
      .then((response) => {
        if (response?.data?.res?.changedRows) {
          removeOTPFromDatabase();
          setIsSuccessScreen(true);
        } else {
          setAlertMsg("Could not reset your password, please try again later");
          setAlertVariant("danger");
          setShowAlert(true);
        }
      })
      .catch((error) => {});
  };

  const removeOTPFromDatabase = () => {
    let apiBody = {
      table: profile,
      attribute: profile.includes("customers")
        ? "customer_username"
        : "shopper_username",
      value: username,
      operator: "=",
      operation: "resetPassword",
      setValues: {},
    };

    if (profile.includes("customers")) {
      apiBody.setValues.customer_otp = "";
    } else {
      apiBody.setValues.shopper_otp = "";
    }

    axios
      .post("update", apiBody)
      .then((response) => {
        if (otp) {
          setIsSuccessScreen(true);
        }
      })
      .catch((error) => {});
  };

  return (
    <>
      {showAlert && <DisplayAlerts variant={alertVariant} message={alertMsg} />}
      <motion.div
        className="flex-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex-child centered" style={{ marginTop: "5%" }}>
          {showModal && (
            <div>
              <ModalComponent
                header="Select profile"
                body="Are you a customer or a shopper?"
                clickHandler={signUpHandle}
              />
            </div>
          )}

          {!showModal && isInfoForm && (
            <div className="username-email-form">
              <div style={{ margin: "40px", padding: "15px" }}>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleInfoFormSubmit}
                >
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a username.
                  </Form.Control.Feedback>
                  <Form.Label style={{ marginTop: "2%" }}>
                    Email address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter an email address.
                  </Form.Control.Feedback>
                  <Button style={{ marginTop: "5%" }} type="submit">
                    Reset password
                  </Button>
                </Form>
              </div>
            </div>
          )}

          {!showModal && isOTPForm && (
            <div className="user-otp-form">
              <div style={{ margin: "40px", padding: "15px" }}>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleOTPFormSubmit}
                >
                  <Form.Label>Enter one time verification code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter code"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter the code.
                  </Form.Control.Feedback>
                  <div
                    style={{
                      marginTop: "1%",
                      fontSize: "13px",
                      fontStyle: "italic",
                      color: "grey",
                    }}
                  >
                    {otpExpMsg && <span>{otpExpMsg}</span>}
                    {!otpExpMsg && (
                      <span>
                        {/* (Code expires in: {minutes}:{seconds}) */}
                      </span>
                    )}
                  </div>
                  <Button style={{ marginTop: "5%" }} type="submit">
                    Submit code
                  </Button>
                </Form>
              </div>
            </div>
          )}

          {!showModal && isCredForm && (
            <div className="user-cred-form">
              <div style={{ margin: "40px", padding: "15px" }}>
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={handleCredFormSubmit}
                >
                  <Form.Label>Enter password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a new password.
                  </Form.Control.Feedback>
                  <Form.Label style={{ marginTop: "2%" }}>
                    Confirm password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPswrd}
                    onChange={(e) => {
                      setConfirmPswrd(e.target.value);
                    }}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter an email address.
                  </Form.Control.Feedback>
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
                    valueAgain={confirmPswrd}
                    onChange={(isValid) => {
                      if (isValid) {
                        setPasswordValidation(isValid);
                      }
                    }}
                  />
                  <Button style={{ marginTop: "5%" }} type="submit">
                    Reset password
                  </Button>
                </Form>
              </div>
            </div>
          )}

          {!showModal && isSuccessScreen && (
            <div style={{ marginLeft: "40px", padding: "15px" }}>
              <h2>Password updated successfully</h2>
              <a href="/login">Login</a>
            </div>
          )}
        </div>
        <div className="flex-child centered" style={{ marginTop: "5%" }}>
          <Image src={logo} fluid></Image>
        </div>
      </motion.div>
    </>
  );
};

export default ForgotPassword;

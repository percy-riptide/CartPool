require("dotenv").config();
const DataObj = require("../models/entities.model.js");
const sgMail = require("@sendgrid/mail");
const jwt = require("jsonwebtoken");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

exports.createJWT = () => {
  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "1hr",
  };
  const payload = {
    key: process.env.JWT_KEY,
  };
  return jwt.sign(payload, secret, options);
};

const checkOperationType = (data, res, result) => {
  if (data.operation === "verifyOTP") {
    verifyOTPoperation(data, res, result);
  } else if (data.operation === "login") {
    loginOperation(data, res, result);
  } else if (data.sendEmail) {
    sendEmail(data, res, result);
  } else {
    result(null, res);
    return;
  }
};

const verifyOTPoperation = (data, res, result) => {
  if (data.table === "customers") {
    result(null, data.otp === res[0].customer_otp);
    return;
  } else {
    result(null, data.otp === res[0].shopper_otp);
    return;
  }
};

const generateJWT = (result) => {
  result(null, {
    isAuthSuccess: true,
    accessToken: exports.createJWT(),
  });
  return;
};

const checkCustLogin = (data, res, result) => {
  if (
    res[0].hasOwnProperty([data["attribute"]]) &&
    res[0][data["attribute"]] === data["value"] &&
    res[0]["customer_password"] === data["pass"]
  ) {
    console.log("Authentication Successful");
    generateJWT(result);
  } else {
    console.log("Password Wrong");
    result(null, { isAuthSuccess: false });
    return;
  }
};

const checkShopLogin = (data, res, result) => {
  if (
    res[0].hasOwnProperty([data["attribute"]]) &&
    res[0][data["attribute"]] === data["value"] &&
    res[0]["shopper_password"] === data["pass"]
  ) {
    console.log("Authentication Successful");
    generateJWT(result);
    return;
  } else {
    console.log("Password Wrong");
    result(null, { isAuthSuccess: false });
    return;
  }
};

const loginOperation = (data, res, result) => {
  if (res[0].hasOwnProperty("customer_password")) {
    checkCustLogin(data, res, result);
  } else {
    checkShopLogin(data, res, result);
  }
};

const sendEmail = (data, res, result) => {
  if (
    (data.table === "customers" && res[0].customer_email === data.email) ||
    (data.table === "shoppers" && res[0].shopper_email === data.email)
  ) {
    sgMail.setApiKey(
      `your api keys go here`
    );
    const msg = {
      to:
        data.table === "customers"
          ? res[0].customer_email
          : res[0].shopper_email,
      from: "teamCartPool@gmail.com",
      subject: data.emailSubject,
      html: data.emailBody,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent");
        result(null, true);
        return;
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    result({ kind: "not_found" }, null);
    return;
  }
};

exports.createService = (data, result) => {
  DataObj.createNewRow(data, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else result(null, res);
    return;
  });
};

exports.fetchService = (data, fetchAllRows, result) => {
  if (fetchAllRows) {
    DataObj.findAllRows(data, (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else result(null, res);
      return;
    });
  } else {
    DataObj.findSingleRow(data, (err, res) => {
      if (err) {
        result(err, null);
        return;
      } else {
        checkOperationType(data, res, result);
      }
    });
  }
};

exports.updateService = (data, result) => {
  DataObj.updateRows(data, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else result(null, res);
    return;
  });
};

exports.deleteService = (data, result) => {
  DataObj.deleteRows(data, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else result(null, res);
    return;
  });
};

exports.payment = async (data, result) => {
  try {
    await stripe.paymentIntents.create({
      amount: data.amount,
      currency: "USD",
      description: "Order delivery fee",
      payment_method: data.id,
      confirm: true,
    });
    const res = {
      message: "Payment successful",
      success: true,
    };
    result(null, res);
  } catch (error) {
    console.log("Error", error);
    const err = {
      message: "Payment failed",
      success: false,
    };
    result(err, null);
  }
};

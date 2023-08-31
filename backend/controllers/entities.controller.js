const ServiceObj = require("../services/entities.services");
const jwt = require("jsonwebtoken");

global.verifyJWT = (req) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  let isJWTVerified;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      isJWTVerified = false;
    } else {
      isJWTVerified = true;
    }
  });
  return isJWTVerified;
};

global.verifyAndSendResponse = (data, res, err, msg404, msg500) => {
  if (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: msg404,
      });
    } else {
      res.status(500).send({
        message: msg500,
      });
    }
  } else res.send(data);
};

exports.createNewRow = (req, res) => {
  let isRequestVerified;
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (req.body.operation === "signup" || req.body.operation === "support") {
    isRequestVerified = true;
  } else {
    isRequestVerified = verifyJWT(req);
  }
  if (isRequestVerified) {
    ServiceObj.createService(req.body, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while creating the row.",
        });
      else res.send(data);
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};

exports.fetchRows = (req, res) => {
  let isRequestVerified;
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  if (
    req.body.operation === "login" ||
    req.body.operation === "resetPassword" ||
    req.body.operation === "verifyOTP"
  ) {
    isRequestVerified = true;
  } else {
    isRequestVerified = verifyJWT(req);
  }
  if (isRequestVerified) {
    ServiceObj.fetchService(req.body, req.body.allRows, (err, data) => {
      verifyAndSendResponse(
        data,
        res,
        err,
        `Not found row with ${req.body.attribute} ${req.body.value}.`,
        `Error retrieving row with ${req.body.attribute} ${req.body.value}`
      );
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};

exports.updateRows = (req, res) => {
  let isRequestVerified;

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  if (
    req.body.operation === "login" ||
    req.body.operation === "resetPassword" ||
    req.body.operation === "verifyOTP"
  ) {
    isRequestVerified = true;
  } else {
    isRequestVerified = verifyJWT(req);
  }
  if (isRequestVerified) {
    ServiceObj.updateService(req.body, (err, data) => {
      verifyAndSendResponse(
        data,
        res,
        err,
        `Not found row with ${req.body.attribute} ${req.body.value}.`,
        `Error updating row with ${req.body.attribute} ${req.body.value}`
      );
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};

exports.deleteRows = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  if (verifyJWT(req)) {
    ServiceObj.deleteService(req.body, (err, data) => {
      verifyAndSendResponse(
        data,
        res,
        err,
        `Not found row with ${req.params.attribute} ${req.params.value}.`,
        `Could not delete row with ${req.params.attribute} ${req.params.value}`
      );
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};

exports.payment = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  if (verifyJWT(req)) {
    ServiceObj.payment(req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Could not find payment gateway.`,
          });
        } else {
          res.status(500).send({
            message: `Internal server error.`,
          });
        }
      } else res.send({ message: `Payment done!` });
    });
  } else {
    res.status(401).send({
      message: "Unauthorized",
    });
  }
};
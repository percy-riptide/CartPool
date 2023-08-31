const dataBaseConfig = require("../config/db.config");

module.exports = (app) => {
  const ControllerObj = require("../controllers/entities.controller.js");

  //to create a new record (row)
  app.post(`/${dataBaseConfig.DB}/create`, ControllerObj.createNewRow);

  //to retrieve single or multiple row
  app.post(`/${dataBaseConfig.DB}/fetch`, ControllerObj.fetchRows);

  //to update single row
  app.post(`/${dataBaseConfig.DB}/update`, ControllerObj.updateRows);

  //to delete single row
  app.post(`/${dataBaseConfig.DB}/delete`, ControllerObj.deleteRows);

  //to make a payment
  app.post(`/${dataBaseConfig.DB}/pay`, ControllerObj.payment);
};

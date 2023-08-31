const dataBaseConfig = require("../config/db.config");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("Routes", () => {
  const ControllerObj = require("../controllers/entities.controller.js");
  const app = {
    post: jest.fn(),
  };
  beforeAll(() => {
    ControllerObj.createNewRow = jest.fn();
    ControllerObj.fetchRows = jest.fn();
    ControllerObj.updateRows = jest.fn();
    ControllerObj.deleteRows = jest.fn();
    ControllerObj.payment = jest.fn();

    require("../routes/entities.routes.js")(app);
  });

  afterEach(async () => {
    await sleep(200);
  });

  test(`POST /${dataBaseConfig.DB}/create should call createNewRow method`, () => {
    expect(app.post).toHaveBeenCalledWith(
      `/${dataBaseConfig.DB}/create`,
      ControllerObj.createNewRow
    );
  });

  test(`POST /${dataBaseConfig.DB}/fetch should call fetchRows method`, () => {
    expect(app.post).toHaveBeenCalledWith(
      `/${dataBaseConfig.DB}/fetch`,
      ControllerObj.fetchRows
    );
  });

  test(`POST /${dataBaseConfig.DB}/update should call updateRows method`, () => {
    expect(app.post).toHaveBeenCalledWith(
      `/${dataBaseConfig.DB}/update`,
      ControllerObj.updateRows
    );
  });

  test(`POST /${dataBaseConfig.DB}/delete should call deleteRows method`, () => {
    expect(app.post).toHaveBeenCalledWith(
      `/${dataBaseConfig.DB}/delete`,
      ControllerObj.deleteRows
    );
  });

  test(`POST /${dataBaseConfig.DB}/pay should call payment method`, () => {
    expect(app.post).toHaveBeenCalledWith(
      `/${dataBaseConfig.DB}/pay`,
      ControllerObj.payment
    );
  });
});
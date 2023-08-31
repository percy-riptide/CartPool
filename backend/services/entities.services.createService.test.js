const DataObj = require("../models/entities.model.js");
const { createService } = require("../services/entities.services.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

jest.mock("../models/entities.model.js");

describe("createService", () => {
    afterEach(async () => {
        await sleep(200);
      });
  test("should create a new row with valid data and return the result", () => {
    const validData = { /* valid data object */ };
    const expectedResult = { id: 1, ...validData };
    DataObj.createNewRow.mockImplementation((data, callback) => {
      callback(null, expectedResult);
    });
    const callback = jest.fn();
    createService(validData, callback);
    expect(DataObj.createNewRow).toHaveBeenCalledWith(validData, expect.any(Function));
    expect(callback).toHaveBeenCalledWith(null, expectedResult);
  });

  test("should return an error if DataObj.createNewRow returns an error", () => {
    const invalidData = { /* invalid data object */ };
    const expectedError = new Error("Test error");
    DataObj.createNewRow.mockImplementation((data, callback) => {
      callback(expectedError, null);
    });
    const callback = jest.fn();
    createService(invalidData, callback);
    expect(DataObj.createNewRow).toHaveBeenCalledWith(invalidData, expect.any(Function));
    expect(callback).toHaveBeenCalledWith(expectedError, null);
  });
});
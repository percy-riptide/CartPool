const DataObj = require("../models/entities.model.js");
const { updateService } = require("../services/entities.services.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("updateService", () => {
    afterEach(async () => {
        await sleep(200);
      });
  // Test case 1
  test("should update rows and return the result", () => {
    const data = { id: 1, name: "New Name" };
    const expectedResult = { affectedRows: 1 };
    const mockUpdateRows = jest.fn((data, callback) => {
      callback(null, expectedResult);
    });
    DataObj.updateRows = mockUpdateRows;

    updateService(data, (err, res) => {
      expect(err).toBeNull();
      expect(res).toEqual(expectedResult);
    });

    expect(mockUpdateRows).toHaveBeenCalledTimes(1);
    expect(mockUpdateRows).toHaveBeenCalledWith(data, expect.any(Function));
  });

  // Test case 2
  test("should return an error if updateRows returns an error", () => {
    const data = { id: 1, name: "New Name" };
    const expectedError = { message: "Error" };
    const mockUpdateRows = jest.fn((data, callback) => {
      callback(expectedError, null);
    });
    DataObj.updateRows = mockUpdateRows;

    updateService(data, (err, res) => {
      expect(err).toEqual(expectedError);
      expect(res).toBeNull();
    });

    expect(mockUpdateRows).toHaveBeenCalledTimes(1);
    expect(mockUpdateRows).toHaveBeenCalledWith(data, expect.any(Function));
  });
});
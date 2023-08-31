const DataObj = require("../models/entities.model.js");
const { fetchService } = require("../services/entities.services.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

jest.mock("../models/entities.model.js");

describe("fetchService", () => {
    afterEach(async () => {
        await sleep(200);
      });
  describe("when fetchAllRows is true", () => {
    test("should fetch all rows with valid data and return the result", () => {
      const validData = { /* valid data object */ };
      const expectedResult = [/* array of rows */];
      DataObj.findAllRows.mockImplementation((data, callback) => {
        callback(null, expectedResult);
      });
      const callback = jest.fn();
      fetchService(validData, true, callback);
      expect(DataObj.findAllRows).toHaveBeenCalledWith(validData, expect.any(Function));
      expect(callback).toHaveBeenCalledWith(null, expectedResult);
    });

    test("should return an error if DataObj.findAllRows returns an error", () => {
      const invalidData = { /* invalid data object */ };
      const expectedError = new Error("Test error");
      DataObj.findAllRows.mockImplementation((data, callback) => {
        callback(expectedError, null);
      });
      const callback = jest.fn();
      fetchService(invalidData, true, callback);
      expect(DataObj.findAllRows).toHaveBeenCalledWith(invalidData, expect.any(Function));
      expect(callback).toHaveBeenCalledWith(expectedError, null);
    });
  });

  describe("when fetchAllRows is false", () => {
    test("should fetch a single row and return the result", () => {
      const validData = { /* valid data object */ };
      const expectedResult = [/* array with a single row */];
      DataObj.findSingleRow.mockImplementation((data, callback) => {
        callback(null, expectedResult);
      });
      const callback = jest.fn();
      fetchService(validData, false, callback);
      expect(DataObj.findSingleRow).toHaveBeenCalledWith(validData, expect.any(Function));
      expect(callback).toHaveBeenCalledWith(null, expectedResult);
    });

    test("should return an error if DataObj.findSingleRow returns an error", () => {
      const invalidData = { /* invalid data object */ };
      const expectedError = new Error("Test error");
      DataObj.findSingleRow.mockImplementation((data, callback) => {
        callback(expectedError, null);
      });
      const callback = jest.fn();
      fetchService(invalidData, false, callback);
      expect(DataObj.findSingleRow).toHaveBeenCalledWith(invalidData, expect.any(Function));
      expect(callback).toHaveBeenCalledWith(expectedError, null);
    });

    test("should verify the OTP and return true if it matches for customers", () => {
      const data = {
        operation: "verifyOTP",
        table: "customers",
        otp: "123456",
      };
      const expectedResult = true;
      DataObj.findSingleRow.mockImplementation((data, callback) => {
        callback(null, [{ customer_otp: "123456" }]);
      });
      const callback = jest.fn();
      fetchService(data, false, callback);
      expect(callback).toHaveBeenCalledWith(null, expectedResult);
    });

    test("should verify the OTP and return true if it matches for shoppers", () => {
      const data = {
        operation: "verifyOTP",
        table: "shoppers",
        otp: "123456",
      };
      const expectedResult = true;
      DataObj.findSingleRow.mockImplementation((data, callback) => {
        callback(null, [{ shopper_otp: "123456" }]);
      });
      const callback = jest.fn();
      fetchService(data, false, callback);
      expect(callback).toHaveBeenCalledWith(null, expectedResult);
    });

    test("should return isAuthSuccess false for invalid login credentials", (done) => {
        const data = {
          operation: "login",
          table: "customers",
          attribute: "customer_email",
          value: "test@test.com",
          pass: "wrongpassword",
        };
        const expectedResult = { isAuthSuccess: false };
        const fetchAllRows = false;
    
        fetchService(data, fetchAllRows, (err, res) => {
          expect(err).toBeNull();
          expect(res).toEqual(expectedResult);
          done();
        });
      });

      test("should send an email for valid data", (done) => {
        const data = {
          operation: "sendEmail",
          table: "customers",
          email: "test@test.com",
          emailSubject: "Test Email Subject",
          emailBody: "Test Email Body",
        };
        const expectedResult = [{"shopper_otp": "123456"}];
        const fetchAllRows = false;
    
        fetchService(data, fetchAllRows, (err, res) => {
          expect(err).toBeNull();
          expect(res).toEqual(expectedResult);
          done();
        });
      });
  })})
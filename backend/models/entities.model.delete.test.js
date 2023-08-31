const Obj = require("./entities.model.js");
const sql = require("./db.js");
jest.mock("./db.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("deleteRows", () => {
const tables = [ "contact","customers", "orders", "shoppers"];
afterEach(async () => {
    await sleep(200);
  });
  //for customers table
  for(const table of tables){
    it("should delete rows successfully", () => {
      const mockData = {
        table: table,
        attribute: "id",
        operator: "=",
        value: 1,
      };
      const mockRes = { affectedRows: 1 };

      jest.spyOn(sql, "query").mockImplementation((query, values, callback) => {
        expect(query).toBe(
          `DELETE FROM ${mockData.table} WHERE ${mockData.attribute} ${mockData.operator}?`
        );
        expect(values).toEqual(mockData.value);

        callback(null, mockRes);
      });

      const mockResultCallback = jest.fn();
      Obj.deleteRows(mockData, mockResultCallback);

      expect(mockResultCallback).toHaveBeenCalledWith(null, mockRes);
    });

    test("should return not_found error if no rows were deleted", () => {
      const mockData = {
        table: table,
        attribute: "id",
        operator: "=",
        value: 1,
      };
      const mockRes = { affectedRows: 0 };

      jest.spyOn(sql, "query").mockImplementation((query, values, callback) => {
        expect(query).toBe(
          `DELETE FROM ${mockData.table} WHERE ${mockData.attribute} ${mockData.operator}?`
        );
        expect(values).toEqual(mockData.value);

        callback(null, mockRes);
      });

      const mockResultCallback = jest.fn();
      Obj.deleteRows(mockData, mockResultCallback);

      expect(mockResultCallback).toHaveBeenCalledWith(
        { kind: "not_found" },
        null
      );
    });

    test("should return error if there is a database error", () => {
      const mockData = {
        table: table,
        attribute: "id",
        operator: "=",
        value: 1,
      };
      const mockError = new Error("Database error");

      jest.spyOn(sql, "query").mockImplementation((query, values, callback) => {
        expect(query).toBe(
          `DELETE FROM ${mockData.table} WHERE ${mockData.attribute} ${mockData.operator}?`
        );
        expect(values).toEqual(mockData.value);

        callback(mockError, null);
      });

      const mockResultCallback = jest.fn();
      Obj.deleteRows(mockData, mockResultCallback);

      expect(mockResultCallback).toHaveBeenCalledWith(null, mockError);
      });
    }
    });
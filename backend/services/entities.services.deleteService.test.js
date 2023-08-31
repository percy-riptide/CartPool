const { deleteService } = require("../services/entities.services.js");
const DataObj = require("../models/entities.model.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Mock DataObj.deleteRows method
DataObj.deleteRows = jest.fn();

describe('deleteService', () => {
    
    afterEach(async () => {
        await sleep(200);
      });
  test('should call DataObj.deleteRows with the correct data', () => {
    const data = { id: 1, table: 'customers' };
    const expectedResult = { success: true };
    
    // Mock the DataObj.deleteRows method to return the expected result
    DataObj.deleteRows.mockImplementationOnce((data, callback) => {
      callback(null, expectedResult);
    });
    
    deleteService(data, (err, res) => {
      expect(DataObj.deleteRows).toHaveBeenCalledWith(data, expect.any(Function));
      expect(res).toEqual(expectedResult);
      expect(err).toBeNull();
    });
  });

  test('should return an error if DataObj.deleteRows returns an error', () => {
    const data = { id: 1, table: 'customers' };
    const expectedError = new Error('Delete failed');
    
    // Mock the DataObj.deleteRows method to return the expected error
    DataObj.deleteRows.mockImplementationOnce((data, callback) => {
      callback(expectedError, null);
    });
    
    deleteService(data, (err, res) => {
      expect(DataObj.deleteRows).toHaveBeenCalledWith(data, expect.any(Function));
      expect(res).toBeNull();
      expect(err).toEqual(expectedError);
    });
  });
});

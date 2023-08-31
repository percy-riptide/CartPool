const Obj = require("./entities.model.js");
const connection = require('./db.js');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('findAllRows', () => {
afterEach(async () => {
    await sleep(200);
  });
  test('should return all entities when found', () => {
    const mockData = {
      table: 'contact',
    };
    const mockResult = jest.fn();
    connection.query = jest.fn((query, callback) => {
      callback(null, [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
    });
    Obj.findAllRows(mockData, mockResult);
    expect(connection.query).toHaveBeenCalled();
    expect(mockResult).toHaveBeenCalledWith(null, [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]);
  });

  test('should return not_found error when no entities found', () => {
    const mockData = {
      table: 'contact',
    };
    const mockResult = jest.fn();
    connection.query = jest.fn((query, callback) => {
      callback(null, []);
    });
    Obj.findAllRows(mockData, mockResult);
    expect(connection.query).toHaveBeenCalled();
    expect(mockResult).toHaveBeenCalledWith({ kind: 'not_found' }, null);
  });

  test('should return error when there is a database error', () => {
    const mockData = {
      table: 'contact',
    };
    const mockResult = jest.fn();
    connection.query = jest.fn((query, callback) => {
      callback(new Error('database error'), null);
    });
   Obj.findAllRows(mockData, mockResult);
    expect(connection.query).toHaveBeenCalled();
    expect(mockResult).toHaveBeenCalledWith(new Error('database error'), null);
  });
});
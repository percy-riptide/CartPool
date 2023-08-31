const Obj = require("./entities.model.js");
const connection = require('./db.js');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('findSingleRow', () => {
afterEach(async () => {
    await sleep(200);
  });
  test('should return the entity when found', () => {
    const mockData = {
      table: 'contact',
      attribute: 'id',
      operator: '=',
      value: 1,
    };

    const mockResult = jest.fn();

    connection.query = jest.fn((query, value, callback) => {
      callback(null, [{ id: 1, name: 'John' }]);
    });
    Obj.findSingleRow(mockData, mockResult);
    expect(connection.query).toHaveBeenCalled();
    expect(mockResult).toHaveBeenCalledWith(null, [{ id: 1, name: 'John' }]);
});
test('should return error when query fails', () => {
    const mockData = {
      table: 'contact',
      attribute: 'id',
      operator: '=',
      value: 1,
    };

    const mockResult = jest.fn();

    connection.query = jest.fn((query, value, callback) => {
      callback(new Error('Database error'), null);
    });

    Obj.findSingleRow(mockData, mockResult);

    expect(connection.query).toHaveBeenCalled();
    expect(mockResult).toHaveBeenCalledWith(new Error('Database error'), null);
});
test('should return not_found error when entity not found', () => {
    const mockData = {
      table: 'contact',
      attribute: 'id',
      operator: '=',
      value: 1,
    };

    const mockResult = jest.fn();

    connection.query = jest.fn((query, value, callback) => {
      callback(null, []);
    });

    Obj.findSingleRow(mockData, mockResult);

    expect(connection.query).toHaveBeenCalled();
    expect(mockResult).toHaveBeenCalledWith({ kind: 'not_found' }, null);
});
});
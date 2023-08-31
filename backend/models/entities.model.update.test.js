const Obj = require("./entities.model.js");
const connection = require('./db.js');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('updateRows', () => {

afterEach(async () => {
    await sleep(200);
  });
test('should update rows when found', () => {

  const mockData = {
    table: 'customers',
    attribute: 'id',
    operator: '=',
    value: 1,
    setValues: {
      name: 'John Doe',
      age: 30
    }
  };

  const mockResult = jest.fn();

  connection.query = jest.fn((query, values, callback) => {
    callback(null, { affectedRows: 1 });
  });

  Obj.updateRows(mockData, mockResult);

  expect(connection.query).toHaveBeenCalled();
  expect(mockResult).toHaveBeenCalledWith(null, { res: { affectedRows: 1 } });
});

test('should return not_found error when rows not found', () => {
  const mockData = {
    table: 'customers',
    attribute: 'id',
    operator: '=',
    value: 1,
    setValues: {
      name: 'John Doe',
      age: 30
    }
  };

  const mockResult = jest.fn();

  connection.query = jest.fn((query, values, callback) => {
    callback(null, { affectedRows: 0 });
  });

  Obj.updateRows(mockData, mockResult);

  expect(connection.query).toHaveBeenCalled();
  expect(mockResult).toHaveBeenCalledWith({ kind: 'not_found' }, null);
});

test('should return error when database error occurs', () => {
  const mockData = {
    table: 'customers',
    attribute: 'id',
    operator: '=',
    value: 1,
    setValues: {
      name: 'John Doe',
      age: 30
    }
  };

  const mockError = new Error('Database error');
  const mockResult = jest.fn();

  connection.query = jest.fn((query, values, callback) => {
    callback(mockError, null);
  });

  Obj.updateRows(mockData, mockResult);

  expect(connection.query).toHaveBeenCalled();
  expect(mockResult).toHaveBeenCalledWith(null, mockError);
});
});
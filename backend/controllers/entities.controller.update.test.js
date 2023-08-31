// Import the required modules and functions
const { updateRows } = require('./entities.controller');
const ServiceObj = require('../services/entities.services');

// Mock the ServiceObj.updateService method
jest.mock('../services/entities.services', () => ({
  updateService: jest.fn(),
}));

describe('updateRows function', () => {
  let req;
  let res;
  

  beforeEach(() => {
    // Create mock request and response objects
    req = {
      body: {
        operation: 'update',
        attribute: 'name',
        value: 'Nisarg',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

//   test('should send 400 status code if the request body is empty', () => {
//     global.verifyJWT = jest.fn(() => true);
//     req.body.operation = null;  
//     updateRows(req, res);
//     expect(res.status).toHaveBeenCalledWith(400);
//     expect(res.send).toHaveBeenCalledWith({
//       message: 'Content can not be empty!',
//     });
//   });

  test('should call ServiceObj.updateService method if the request is authorized', () => {
    global.verifyJWT = jest.fn(() => true);
    updateRows(req, res);
    expect(ServiceObj.updateService).toHaveBeenCalledWith(
      req.body,
      expect.any(Function)
    );
  });

  test('should send 401 status code if the request is not authorized', () => {
    global.verifyJWT = jest.fn(() => false);
    updateRows(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Unauthorized',
    });
  });

  test('should send 404 status code if the requested row is not found', () => {
    global.verifyJWT = jest.fn(() => true);
    ServiceObj.updateService.mockImplementationOnce((_, callback) => {
      callback({ kind: 'not_found' });
    });
    updateRows(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Not found row with name Nisarg.',
    });
  });

  test('should send 500 status code if there is an error while updating the row', () => {
    global.verifyJWT = jest.fn(() => true);
    ServiceObj.updateService.mockImplementationOnce((_, callback) => {
      callback(new Error('Update failed'));
    });
    updateRows(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Error updating row with name Nisarg',
    });
  });

  test('should send the updated row if it is successfully updated', () => {
    global.verifyJWT = jest.fn(() => true);
    ServiceObj.updateService.mockImplementationOnce((_, callback) => {
      callback(null, { name: 'Nisarg', age: 23 });
    });
    updateRows(req, res);
    expect(res.send).toHaveBeenCalledWith({ name: 'Nisarg', age: 23 });
  });
});
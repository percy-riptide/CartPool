const Obj = require('./entities.controller');
const ServiceObj = require("../services/entities.services");
const jwt = require('jsonwebtoken');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
jest.mock('jsonwebtoken');

jest.mock('../services/entities.services');

describe('createNewRow function', () => {
  let req, res;

afterEach(async () => {
    await sleep(200);
  });

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should create a new row if the request is verified', () => {
    req.body.operation = 'signup';
    jwt.verify.mockReturnValueOnce({ userId: '123' });
    const mockServiceResponse = { id: 'mock-id' };
    ServiceObj.createService.mockImplementationOnce((body, cb) => {
      cb(null, mockServiceResponse);
    });
    Obj.createNewRow(req, res);
    expect(res.send).toHaveBeenCalledWith(mockServiceResponse);
  });

  test('should handle errors from the Service object', () => {
    req.body.operation = 'signup';
    jwt.verify.mockReturnValueOnce({ userId: '123' });
    const mockServiceError = new Error('mock error');
    ServiceObj.createService.mockImplementationOnce((body, cb) => {
      cb(mockServiceError);
    });
    Obj.createNewRow(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({
      message: "mock error",
    });
  });
});
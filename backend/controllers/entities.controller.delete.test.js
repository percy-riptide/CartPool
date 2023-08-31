const Obj = require('./entities.controller');
const ServiceObj = require("../services/entities.services");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('deleteRows', () => {
afterEach(async () => {
    await sleep(200);
  });
  test('should respond with 400 if no request body is provided', () => {
    const req = {
      headers: {},
    };
    const res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
    Obj.deleteRows(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: 'Content can not be empty!',
    });
  });
});
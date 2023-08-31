const Obj = require('./entities.controller');
const ServiceObj = require("../services/entities.services");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('fetchRows', () => {
afterEach(async () => {
    await sleep(200);
  });
  const req = {
    body: {},
    headers: {},
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };

  const verifyJWT = jest.fn();

  test('should return a 401 error if the request is not verified', () => {
    req.body.operation = 'not-login';
    verifyJWT.mockReturnValueOnce(false);

    Obj.fetchRows(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
  });
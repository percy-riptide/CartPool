const Obj = require('./entities.controller');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Obj.payment function', () => {
afterEach(async () => {
    await sleep(200);
  });
  let req, res;

  beforeEach(() => {
    req = {
      headers: { authorization: 'Bearer some-valid-token' },
      body: { amount: 100 },
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(),
    };
  });
  test('should respond with 400 if request body is empty', () => {
    req.body = null;

    Obj.payment(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({ message: 'Content can not be empty!' });
  });
});
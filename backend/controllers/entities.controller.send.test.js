// Import the verifyAndSendResponse function
const  Obj  = require("./entities.controller");
const jwt = require("jsonwebtoken");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Mock the response object
const res = {
  status: jest.fn().mockReturnThis(),
  send: jest.fn(),
};

describe('verifyAndSendResponse', () => {
afterEach(async () => {
    await sleep(200);
  });
  test('should send the data if there is no error', () => {
    const data = { name: 'sindhu' };
    verifyAndSendResponse(data, res, null, 'Not Found', 'Internal Server Error');
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(data);
  });

  test('should send a 404 error if the error kind is not_found', () => {
    const err = { kind: 'not_found' };
    verifyAndSendResponse(null, res, err, 'Not Found', 'Internal Server Error');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'Not Found' });
  });

  test('should send a 500 error for any other error', () => {
    const err = new Error('Something went wrong');
    verifyAndSendResponse(null, res, err, 'Not Found', 'Internal Server Error');
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: 'Internal Server Error' });
  });
});
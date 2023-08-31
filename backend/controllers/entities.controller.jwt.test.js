const  Obj  = require("./entities.controller");
const jwt = require("jsonwebtoken");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("verifyJWT", () => {
afterEach(async () => {
    await sleep(200);
  });
  const validToken = jwt.sign({ user: "testUser" }, process.env.JWT_SECRET);
  const invalidToken = "invalidToken";

  test("should return false when authorization header is missing", () => {
    const req = { headers: {} };
    expect(verifyJWT(req)).toBe(false);
  });

  test("should return false when authorization header is not in the expected format", () => {
    const req = { headers: { authorization: "Bearer" } };
    expect(verifyJWT(req)).toBe(false);
  });

  test("should return false when token is invalid", () => {
    const req = { headers: { authorization: `Bearer ${invalidToken}` } };
    expect(verifyJWT(req)).toBe(false);
  });

  test("should return true when token is valid", () => {
    const req = { headers: { authorization: `Bearer ${validToken}` } };
    expect(verifyJWT(req)).toBe(true);
  });
});
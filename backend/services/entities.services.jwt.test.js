const Obj = require("./entities.services");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe("services", () => {
  describe("createJWT", () => {
  afterEach(async () => {
      await sleep(200);
    });
  // Test that the function creates a valid JWT
  test('should create a valid JWT', () => {
    const token = Obj.createJWT();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  // Test that the function loads environment variables correctly
  test('should load environment variables', () => {
    process.env.JWT_SECRET = 'myjwtsecret';
    process.env.JWT_KEY = 'myjwtkey';
    const token = Obj.createJWT();
    expect(token).toBeDefined();
  });

  // Test that the function handles missing environment variables correctly
  test('should throw an error when JWT_SECRET is missing', () => {
    delete process.env.JWT_SECRET;
    expect(() => Obj.createJWT()).toThrow('secretOrPrivateKey must have a value');
  });
});
  });
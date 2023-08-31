const request = require('supertest');
const app = require('./server');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const entitiesRoutes = require('./routes/entities.routes');
const PORT = 3000;
jest.mock('./routes/entities.routes', () => jest.fn());


describe('Test the root path', () => {
afterEach(async () => {
    await sleep(200);
  });
  test('It should respond with a 200 status code', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });
   test(`It should be listening on port ${PORT}`, () => {
      const server = app.listen(PORT, () => {
        request(app)
          .get('/')
          .then(res => {
            expect(res.statusCode).toEqual(200);
          })
          .catch(err => done(err));
      });
    });
});

describe('Server', () => {
afterEach(async () => {
    await sleep(200);
  });
  test('should call entities routes with app parameter', () => {
    expect(entitiesRoutes).toHaveBeenCalledWith(app);
  });
});
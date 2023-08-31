const Obj = require("./entities.model.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('Obj.formQuery', () => {
afterEach(async () => {
    await sleep(200);
  });
  test('should return empty string when input is empty', () => {
    const result = formQuery({});
    expect(result).toEqual('');
  });

  test('should form query string for string values', () => {
    const input = { name: 'John Doe', email: 'john.doe@example.com' };
    const result = formQuery(input);
    expect(result).toEqual('name = "John Doe",email = "john.doe@example.com"');
  });

  test('should form query string for null values', () => {
    const input = { name: null, email: 'john.doe@example.com' };
    const result = formQuery(input);
    expect(result).toEqual('name = null,email = "john.doe@example.com"');
  });

  test('should form query string for number values', () => {
    const input = { age: 30, salary: 50000 };
    const result = formQuery(input);
    expect(result).toEqual('age = 30,salary = 50000');
  });

  test('should ignore "id" key', () => {
    const input = { id: 1, name: 'sindhu' };
    const result = formQuery(input);
    expect(result).toEqual('name = "sindhu"');
  });
});
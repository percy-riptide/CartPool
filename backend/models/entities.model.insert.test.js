const Obj = require("./entities.model.js");
const sql = require("./db.js");
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Mock the sql library so we can test the function without actually connecting to a database
jest.mock("./db.js");

//Test to create new row
describe("Obj.createNewRow", () => {
 // Give time to any async operation to complete after each test
  afterEach(async () => {
    await sleep(200);
  });
  //for contacts table
  test("insert a new row into contact database", () => {
    const mockData = {
      table: "contact",
      setValues: {  email: "mymail@gmail.com",phone: 4257392993,issue: "Not able to create orders" },
    };
    const mockResult = jest.fn();

    // Call the method being tested
    Obj.createNewRow(mockData, mockResult);

    // Verify that the SQL query was executed with the correct arguments
    expect(sql.query).toHaveBeenCalledWith(
      "INSERT INTO contact SET ?",
      { email: "mymail@gmail.com", phone: 4257392993,issue: "Not able to create orders" },
      expect.any(Function)
    );

    // Simulate a successful database insertion
    const mockInsertResult = { insertId: 1 };
    //first arg is query string, second is parameters to be used in the query and third is a callback function
    sql.query.mock.calls[0][2](null, mockInsertResult);
    // Verify that the callback was called with the correct result
    expect(mockResult).toHaveBeenCalledWith(null, {
      id: 1,
      table: "contact",
      setValues: { email: "mymail@gmail.com", phone: 4257392993,issue: "Not able to create orders"},
    });
  });

  test("handles errors when inserting a new row into the contact table", () => {
        const mockData = {
              table: "contact",
              setValues: {email: "mymail@gmail.com",phone: 4257392993,issue: "Not able to create orders" },
            };
        const mockResult = jest.fn();

        // Call the method being tested
        Obj.createNewRow(mockData, mockResult);

        // Simulate an error in the database query
        const mockError = "Database error";
        sql.query.mock.calls[1][2](mockError, null);

        // Verify that the callback was called with the correct error message
        expect(mockResult).toHaveBeenCalledWith(mockError, null);
      });

  //for customers table
  test("insert a new row into the customers database", () => {
        const mockData = {
          table: "customers",
          setValues: {customer_id: 10,customer_username:"sindhu",customer_street:"south park street", customer_phone: 4257392993,customer_password:"thisisme",customer_email:"thisismymail@gmail.com"},
        };
        const mockResult = jest.fn();

        // Call the method being tested
        Obj.createNewRow(mockData, mockResult);

        // Verify that the SQL query was executed with the correct arguments
        expect(sql.query).toHaveBeenCalledWith(
          "INSERT INTO customers SET ?",
          {customer_id: 10,customer_username:"sindhu",customer_street:"south park street", customer_phone: 4257392993,customer_password:"thisisme",customer_email:"thisismymail@gmail.com"},
          expect.any(Function)
        );

        // Simulate a successful database insertion
        const mockInsertResult = { insertId: 2 };
        //first arg is query string, second is parameters to be used in the query and third is a callback function
        sql.query.mock.calls[2][2](null, mockInsertResult);
        // Verify that the callback was called with the correct result
        expect(mockResult).toHaveBeenCalledWith(null, {
          id: 2,
          table: "customers",
          setValues: {customer_id: 10,customer_username:"sindhu",customer_street:"south park street", customer_phone: 4257392993,customer_password:"thisisme",customer_email:"thisismymail@gmail.com"},
        });
      });

  test("handles errors when inserting a new row into the customers table", () => {
         const mockData = {
                  table: "customers",
                  setValues: {customer_id: 10,customer_username:"sindhu",customer_street:"south park street", customer_phone: 4257392993,customer_password:"thisisme",customer_email:"thisismymail@gmail.com"},
                };
        const mockResult = jest.fn();

        // Call the method being tested
        Obj.createNewRow(mockData, mockResult);

        // Simulate an error in the database query
        const mockError = "Database error";
        sql.query.mock.calls[3][2](mockError, null);

        // Verify that the callback was called with the correct error message
        expect(mockResult).toHaveBeenCalledWith(mockError, null);
      });

  //for orders table
  test("insert a new row into the orders database", () => {
        const mockData = {
          table: "orders",
          setValues: {order_id: 10,customer_username:"sindhu",delivery_address:"south park street", delivery_fee: 1},
        };
        const mockResult = jest.fn();

        // Call the method being tested
        Obj.createNewRow(mockData, mockResult);

        // Verify that the SQL query was executed with the correct arguments
        expect(sql.query).toHaveBeenCalledWith(
          "INSERT INTO orders SET ?",
          {order_id: 10,customer_username:"sindhu",delivery_address:"south park street", delivery_fee: 1},
          expect.any(Function)
        );

        // Simulate a successful database insertion
        const mockInsertResult = { insertId: 3 };
        //first arg is query string, second is parameters to be used in the query and third is a callback function
        sql.query.mock.calls[4][2](null, mockInsertResult);
        // Verify that the callback was called with the correct result
        expect(mockResult).toHaveBeenCalledWith(null, {
          id: 3,
          table: "orders",
          setValues: {order_id: 10,customer_username:"sindhu",delivery_address:"south park street", delivery_fee: 1},
        });
      });
      it("handles errors when inserting a new row into the orders table", () => {
               const mockData = {
                         table: "orders",
                         setValues: {order_id: 10,customer_username:"sindhu",delivery_address:"south park street", delivery_fee: 1},
                       };
              const mockResult = jest.fn();

              // Call the method being tested
              Obj.createNewRow(mockData, mockResult);

              // Simulate an error in the database query
              const mockError = "Database error";
              sql.query.mock.calls[5][2](mockError, null);

              // Verify that the callback was called with the correct error message
              expect(mockResult).toHaveBeenCalledWith(mockError, null);
            });

  //for shoppers table
  test("insert a new row into the shoppers database", () => {
        const mockData = {
          table: "shoppers",
          setValues: {shopper_id: 10,shopper_username:"sindhu",shopper_street:"south park street", shopper_phone: 4257392993,shopper_email:"thisismymail@gmail.com"},
        };
        const mockResult = jest.fn();

        // Call the method being tested
        Obj.createNewRow(mockData, mockResult);

        // Verify that the SQL query was executed with the correct arguments
        expect(sql.query).toHaveBeenCalledWith(
          "INSERT INTO shoppers SET ?",
          {shopper_id: 10,shopper_username:"sindhu",shopper_street:"south park street", shopper_phone: 4257392993,shopper_email:"thisismymail@gmail.com"},
          expect.any(Function)
        );

        // Simulate a successful database insertion
        const mockInsertResult = { insertId: 4 };
        //first arg is query string, second is parameters to be used in the query and third is a callback function
        sql.query.mock.calls[6][2](null, mockInsertResult);
        // Verify that the callback was called with the correct result
        expect(mockResult).toHaveBeenCalledWith(null, {
          id: 4,
          table: "shoppers",
          setValues: {shopper_id: 10,shopper_username:"sindhu",shopper_street:"south park street", shopper_phone: 4257392993,shopper_email:"thisismymail@gmail.com"},
        });
      });

 test("handles errors when inserting a new row into the shoppers table", () => {
               const mockData = {
                        table: "shoppers",
                        setValues: {shopper_id: 10,shopper_username:"sindhu",shopper_street:"south park street", shopper_phone: 4257392993,shopper_email:"thisismymail@gmail.com"},
                      };
              const mockResult = jest.fn();

              // Call the method being tested
              Obj.createNewRow(mockData, mockResult);

              // Simulate an error in the database query
              const mockError = "Database error";
              sql.query.mock.calls[7][2](mockError, null);

              // Verify that the callback was called with the correct error message
              expect(mockResult).toHaveBeenCalledWith(mockError, null);
            });
             });
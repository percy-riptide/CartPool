const services = require('./entities.services');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

describe('entities.services', () => {
  describe('payment', () => {
    afterEach(async () => {
        await sleep(200);
      });
    // test('should return success message for valid payment', async () => {
    //   const data = {
    //     amount: 500,
    //     id: 'pm_1Mv2a7KWIvRUd9MoINI5A9LD'
    //   };
    //   const expectedResult = {
    //     message: 'Payment successful',
    //     success: true
    //   };
    //   const result = await new Promise((resolve, reject) => {
    //     services.payment(data, (err, res) => {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(res);
    //       }
    //     });
    //   });
    //   expect(result).toEqual(expectedResult);
    // });

    test('should return error message for invalid payment', async () => {
      const data = {
        amount: 1000,
        id: 'invalid-payment-method-id'
      };
      const expectedResult = {
        message: 'Payment failed',
        success: false
      };
      const result = await new Promise((resolve, reject) => {
        services.payment(data, (err, res) => {
          if (err) {
            resolve(err);
          } else {
            reject(new Error('Expected an error to be thrown'));
          }
        });
      });
      expect(result).toEqual(expectedResult);
    });
  });
});
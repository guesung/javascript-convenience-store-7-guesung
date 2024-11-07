import { mockQuestions } from '../lib/test/utils';
import Customer from './Customer';
import Worker from './Worker';

describe('Customer', () => {
  describe('order', () => {
    test('사용자가 입력한 주문에 맞게 값을 반환한다.', async () => {
      mockQuestions(['[콜라-1]']);

      const store = new Worker();
      store.prepareProducts();
      const orderHistory = await Customer.order();

      expect(orderHistory.getQuantity('콜라')).toBe(1);
      expect(orderHistory.getQuantity('맥주')).toBe(0);
    });
  });
});

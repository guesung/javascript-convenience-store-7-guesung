import { mockQuestions } from '../lib/test/utils';
import OrderHistoryModel from './OrderHistoryModel';
import ProductModel from './ProductModel';

describe('OrderHistoryModel', () => {
  let orderHistoryModel;
  beforeEach(async () => {
    const productModel = new ProductModel();
    orderHistoryModel = new OrderHistoryModel();
    mockQuestions(['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10],[닭가슴살-9]']);

    await orderHistoryModel.generateOrderHistoryModel(productModel);
  });

  describe('getQuantity', () => {
    test('구매 내역에서 item의 개수를 반환한다.', () => {
      expect(orderHistoryModel.getQuantity('콜라')).toBe(8);
      expect(orderHistoryModel.getQuantity('에너지바')).toBe(5);
      expect(orderHistoryModel.getQuantity('감자칩')).toBe(10);
      expect(orderHistoryModel.getQuantity('컵라면')).toBe(10);
      expect(orderHistoryModel.getQuantity('닭가슴살')).toBe(9);
    });
    test('구매 내역에 없는 item일 경우 0을 반환한다.', () => {
      expect(orderHistoryModel.getQuantity('핫식스')).toBe(0);
      expect(orderHistoryModel.getQuantity('몬스터')).toBe(0);
      expect(orderHistoryModel.getQuantity('치킨')).toBe(0);
    });
  });

  describe('addQuantity', () => {
    test('quantity에 해당하는 만큼 item의 구매 개수를 추가한다.', () => {
      expect(orderHistoryModel.addQuantity('콜라', 10));
      expect(orderHistoryModel.getQuantity('콜라')).toBe(18);
    });
    test('quantity가 없을 경우 item의 구매 개수를 1개만 추가한다.', () => {
      expect(orderHistoryModel.addQuantity('콜라'));
      expect(orderHistoryModel.getQuantity('콜라')).toBe(9);
    });
    test('구매 내역에 없는 item일 경우 0에서 해당하는 개수를 추가한다.', () => {
      expect(orderHistoryModel.addQuantity('핫식스', 10));
      expect(orderHistoryModel.getQuantity('핫식스')).toBe(10);

      expect(orderHistoryModel.addQuantity('치킨'));
      expect(orderHistoryModel.getQuantity('치킨')).toBe(1);
    });
  });

  describe('reduceQuantity', () => {
    test('quantity에 해당하는 만큼 item의 구매 개수를 뺀다.', () => {
      expect(orderHistoryModel.reduceQuantity('콜라', 8));
      expect(orderHistoryModel.getQuantity('콜라')).toBe(0);
    });
    test('quantity가 없을 경우 item의 구매 개수를 1개만 뺀다.', () => {
      expect(orderHistoryModel.reduceQuantity('콜라'));
      expect(orderHistoryModel.getQuantity('콜라')).toBe(7);
    });
    test('quantity보다 보유한 item 개수가 적을 경우 0으로 만든다.', () => {
      expect(orderHistoryModel.reduceQuantity('콜라', 18));
      expect(orderHistoryModel.getQuantity('콜라')).toBe(0);
    });
    test('구매 내역에 없는 item일 경우 여전히 0개이다.', () => {
      expect(orderHistoryModel.reduceQuantity('핫식스', 10));
      expect(orderHistoryModel.getQuantity('핫식스')).toBe(0);

      expect(orderHistoryModel.reduceQuantity('치킨'));
      expect(orderHistoryModel.getQuantity('치킨')).toBe(0);
    });
  });
});

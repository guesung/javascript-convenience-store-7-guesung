import { ReceiptModel } from './index.js';

describe('ReceiptModel', () => {
  let receiptModel;
  beforeEach(() => {
    receiptModel = new ReceiptModel();
    receiptModel.addItem({
      name: '콜라',
      price: 1000,
      quantity: 9,
      promotionFreeQuantity: 3,
      promotionEnableQuantity: 9,
    });
    receiptModel.addItem({
      name: '사이다',
      price: 1200,
      quantity: 8,
      promotionFreeQuantity: 2,
      promotionEnableQuantity: 6,
    });
    receiptModel.addItem({
      name: '감자칩',
      price: 1500,
      quantity: 10,
      promotionFreeQuantity: 3,
      promotionEnableQuantity: 9,
    });
    receiptModel.addItem({
      name: '컵라면',
      price: 3000,
      quantity: 7,
      promotionFreeQuantity: 3,
      promotionEnableQuantity: 6,
    });
  });

  describe('getTotalQuantity', () => {
    test('전체 수량을 계산한다.', () => {
      expect(receiptModel.getTotalQuantity()).toBe(34);
    });
  });

  describe('getTotalPrice', () => {
    test('전체 합산 금액을 계산한다.', () => {
      expect(receiptModel.getTotalPrice()).toBe(54_600);
    });
  });

  describe('getProductPromotionDiscount', () => {
    test('전체 프로모션 금액을 계산한다.', () => {
      expect(receiptModel.getProductPromotionDiscount()).toBe(18_900);
    });
  });

  describe('getMembershipDiscount', () => {
    test('멤버십 할인을 적용하지 않으면, 0을 반환한다.', () => {
      expect(receiptModel.getMembershipDiscount()).toBe(0);
    });
    test('멤버십 할인을 적용한다면, 멤버십 할인 금액을 계산한다.', () => {
      receiptModel.setMembershipDiscount();
      expect(receiptModel.getMembershipDiscount()).toBe(2_070);
    });
    test('멤버십 할인의 최대 금액은 8000원이다', () => {
      receiptModel.setMembershipDiscount();
      receiptModel.addItem({
        name: '콜라',
        price: 1000,
        quantity: 100,
        promotionFreeQuantity: 3,
        promotionEnableQuantity: 9,
      });
      expect(receiptModel.getMembershipDiscount()).toBe(8_000);
    });
  });
});

import ReceiptModel from './ReceiptModel.js';

describe('ReceiptModel', () => {
  let receiptModel;
  beforeEach(() => {
    receiptModel = new ReceiptModel();
    receiptModel.addItem({
      name: '콜라',
      price: 1000,
      quantity: 9,
      promotionQuantity: 3,
      promotionAdjustQuantity: 9,
    });
    receiptModel.addItem({
      name: '사이다',
      price: 1200,
      quantity: 8,
      promotionQuantity: 2,
      promotionAdjustQuantity: 6,
    });
    receiptModel.addItem({
      name: '감자칩',
      price: 1500,
      quantity: 10,
      promotionQuantity: 3,
      promotionAdjustQuantity: 9,
    });
    receiptModel.addItem({
      name: '컵라면',
      price: 3000,
      quantity: 7,
      promotionQuantity: 3,
      promotionAdjustQuantity: 6,
    });
  });

  describe('getTotalQuantity', () => {
    test('전체 수량을 계산한다.', () => {
      // 9 + 8 + 10 + 7 = 34
      expect(receiptModel.getTotalQuantity()).toBe(34);
    });
  });

  describe('getTotalPrice', () => {
    test('전체 합산 금액을 계산한다.', () => {
      // 9,000 + 9,600 + 15,000 + 21,000 = 54,600
      expect(receiptModel.getTotalPrice()).toBe(54_600);
    });
  });

  describe('getTotalPromotionPrice', () => {
    test('전체 프로모션 금액을 계산한다.', () => {
      // 3000 + 2400 + 4500 + 9000 = 18,900
      expect(receiptModel.getTotalPromotionPrice()).toBe(18_900);
    });
  });

  describe('getMembershipDiscount', () => {
    test('멤버십 할인을 적용하지 않으면, 0을 반환한다.', () => {
      expect(receiptModel.getMembershipDiscount()).toBe(0);
    });
    test('멤버십 할인을 적용한다면, 멤버십 할인 금액을 계산한다.', () => {
      receiptModel.setMembershipDiscount();
      // 멤버십 할인 금액 = 프로모션 미적용 금액 * 30 / 100
      // 프로모션 미적용 금액 = 0 + 2,400 + 1,500 + 3,000 = 6,900
      // 멤버십 할인 금액 = 6,900 * 30 / 100 = 2,070
      expect(receiptModel.getMembershipDiscount()).toBe(2_070);
    });
  });
});

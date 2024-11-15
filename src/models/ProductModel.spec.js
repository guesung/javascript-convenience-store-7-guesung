import { FileView } from '../views/index.js';
import { ProductModel } from './index.js';

describe('ProductModel', () => {
  let productModel;
  beforeEach(() => {
    const products = FileView.readProducts();
    const promotions = FileView.readPromotions();
    productModel = new ProductModel(products, promotions);
  });

  describe('findPromotion', () => {
    test('날짜가 지난 프로모션 정보를 반환하지 않는다.', () => {
      expect(productModel.findPromotion('닭가슴살')).toBeUndefined();
    });
    test('아이템의 프로모션의 정보를 반환한다.', () => {
      expect(productModel.findPromotion('콜라')).toHaveProperty('name', '탄산2+1');
      expect(productModel.findPromotion('콜라')).toHaveProperty('buy', 2);
      expect(productModel.findPromotion('콜라')).toHaveProperty('get', 1);
      expect(productModel.findPromotion('콜라')).toHaveProperty('startDate', new Date('2024-01-01'));
      expect(productModel.findPromotion('콜라')).toHaveProperty('endDate', new Date('2024-12-31'));
    });
  });

  describe('getPromotionUnit', () => {
    test('날짜가 지난 프로모션 단위를 반환하지 않는다.', () => {
      expect(productModel.getPromotionUnit('닭가슴살')).toBeNull();
    });
    test('아이템의 프로모션의 단위를 반환한다.', () => {
      expect(productModel.getPromotionUnit('콜라')).toBe(3);
      expect(productModel.getPromotionUnit('사이다')).toBe(3);
      expect(productModel.getPromotionUnit('탄산수')).toBe(3);
      expect(productModel.getPromotionUnit('오렌지주스')).toBe(2);
      expect(productModel.getPromotionUnit('감자칩')).toBe(2);
      expect(productModel.getPromotionUnit('컵라면')).toBe(2);
      expect(productModel.getPromotionUnit('초코바')).toBe(2);
      expect(productModel.getPromotionUnit('물')).toBeNull();
    });
  });

  describe('getPromotionEnableQuantity', () => {
    test('프로모션 적용이 가능한 상품의 개수를 반환한다', () => {
      expect(productModel.getPromotionEnableQuantity('콜라')).toBe(9);
      expect(productModel.getPromotionEnableQuantity('사이다')).toBe(6);
      expect(productModel.getPromotionEnableQuantity('오렌지주스')).toBe(8);
      expect(productModel.getPromotionEnableQuantity('탄산수')).toBe(3);
      expect(productModel.getPromotionEnableQuantity('감자칩')).toBe(4);
      expect(productModel.getPromotionEnableQuantity('물')).toBe(0);
    });
  });

  describe('getItemQuantity', () => {
    test('제품 개수를 반환한다.', () => {
      expect(productModel.getItemQuantity('콜라')).toBe(20);
      expect(productModel.getItemQuantity('사이다')).toBe(15);
      expect(productModel.getItemQuantity('오렌지주스')).toBe(9);
      expect(productModel.getItemQuantity('탄산수')).toBe(5);
      expect(productModel.getItemQuantity('물')).toBe(10);
    });
  });

  describe('getPromotionProductQuantity', () => {
    test('제품 중 프로모션 중인 개수를 반환한다.', () => {
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(10);
      expect(productModel.getPromotionProductQuantity('사이다')).toBe(8);
      expect(productModel.getPromotionProductQuantity('오렌지주스')).toBe(9);
      expect(productModel.getPromotionProductQuantity('탄산수')).toBe(5);
      expect(productModel.getPromotionProductQuantity('물')).toBe(0);
    });
  });

  describe('getPrice', () => {
    test('제품의 가격을 반환한다.', () => {
      expect(productModel.getPrice('콜라')).toBe(1000);
      expect(productModel.getPrice('사이다')).toBe(1000);
      expect(productModel.getPrice('오렌지주스')).toBe(1800);
      expect(productModel.getPrice('탄산수')).toBe(1200);
      expect(productModel.getPrice('물')).toBe(500);
    });
  });

  describe('decreaseQuantity', () => {
    test('제품 개수를 감소시킨다.', () => {
      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getItemQuantity('콜라')).toBe(15);

      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getItemQuantity('콜라')).toBe(10);

      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getItemQuantity('콜라')).toBe(5);

      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getItemQuantity('콜라')).toBe(0);

      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getItemQuantity('콜라')).toBe(0);
    });

    test('프로모션 제품의 개수를 먼저 감소시킨다.', () => {
      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(5);

      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(0);

      productModel.decreaseQuantity('콜라', 5);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(0);
    });

    test('프로모션 제품의 개수를 초과하면 0개가 된다.', () => {
      productModel.decreaseQuantity('콜라', 25);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(0);
    });
  });
});

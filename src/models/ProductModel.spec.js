import { FileView } from '../views/index.js';
import { ProductModel } from './index.js';

describe('ProductModel', () => {
  let productModel;
  beforeEach(() => {
    const products = FileView.getProducts();
    const promotions = FileView.findProductPromotions();
    productModel = new ProductModel(products, promotions);
  });

  describe('findProductPromotion', () => {
    test('날짜가 지난 프로모션 정보를 반환하지 않는다.', () => {
      expect(productModel.findProductPromotion('닭가슴살')).toBeUndefined();
    });
    test('아이템의 프로모션의 정보를 반환한다.', () => {
      expect(productModel.findProductPromotion('콜라')).toHaveProperty('name', '탄산2+1');
      expect(productModel.findProductPromotion('콜라')).toHaveProperty('buy', 2);
      expect(productModel.findProductPromotion('콜라')).toHaveProperty('get', 1);
      expect(productModel.findProductPromotion('콜라')).toHaveProperty('startDate', new Date('2024-01-01'));
      expect(productModel.findProductPromotion('콜라')).toHaveProperty('endDate', new Date('2024-12-31'));
    });
  });

  describe('findProductPromotionUnit', () => {
    test('날짜가 지난 프로모션 단위를 반환하지 않는다.', () => {
      expect(productModel.findProductPromotionUnit('닭가슴살')).toBeNull();
    });
    test('아이템의 프로모션의 단위를 반환한다.', () => {
      expect(productModel.findProductPromotionUnit('콜라')).toBe(3);
      expect(productModel.findProductPromotionUnit('사이다')).toBe(3);
      expect(productModel.findProductPromotionUnit('탄산수')).toBe(3);
      expect(productModel.findProductPromotionUnit('오렌지주스')).toBe(2);
      expect(productModel.findProductPromotionUnit('감자칩')).toBe(2);
      expect(productModel.findProductPromotionUnit('컵라면')).toBe(2);
      expect(productModel.findProductPromotionUnit('초코바')).toBe(2);
      expect(productModel.findProductPromotionUnit('물')).toBeNull();
    });
  });

  describe('findProductPromotionEnableQuantity', () => {
    test('프로모션 적용이 가능한 상품의 개수를 반환한다', () => {
      expect(productModel.findProductPromotionEnableQuantity('콜라')).toBe(9);
      expect(productModel.findProductPromotionEnableQuantity('사이다')).toBe(6);
      expect(productModel.findProductPromotionEnableQuantity('오렌지주스')).toBe(8);
      expect(productModel.findProductPromotionEnableQuantity('탄산수')).toBe(3);
      expect(productModel.findProductPromotionEnableQuantity('감자칩')).toBe(4);
      expect(productModel.findProductPromotionEnableQuantity('물')).toBe(0);
    });
  });

  describe('getQuantity', () => {
    test('제품 개수를 반환한다.', () => {
      expect(productModel.getQuantity('콜라')).toBe(20);
      expect(productModel.getQuantity('사이다')).toBe(15);
      expect(productModel.getQuantity('오렌지주스')).toBe(9);
      expect(productModel.getQuantity('탄산수')).toBe(5);
      expect(productModel.getQuantity('물')).toBe(10);
    });
  });

  describe('findProductPromotionProductQuantity', () => {
    test('제품 중 프로모션 중인 개수를 반환한다.', () => {
      expect(productModel.findProductPromotionProductQuantity('콜라')).toBe(10);
      expect(productModel.findProductPromotionProductQuantity('사이다')).toBe(8);
      expect(productModel.findProductPromotionProductQuantity('오렌지주스')).toBe(9);
      expect(productModel.findProductPromotionProductQuantity('탄산수')).toBe(5);
      expect(productModel.findProductPromotionProductQuantity('물')).toBe(0);
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

  describe('decreaseProductQuantity', () => {
    test('제품 개수를 감소시킨다.', () => {
      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.getQuantity('콜라')).toBe(15);

      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.getQuantity('콜라')).toBe(10);

      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.getQuantity('콜라')).toBe(5);

      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.getQuantity('콜라')).toBe(0);

      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.getQuantity('콜라')).toBe(0);
    });

    test('프로모션 제품의 개수를 먼저 감소시킨다.', () => {
      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.findProductPromotionProductQuantity('콜라')).toBe(5);

      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.findProductPromotionProductQuantity('콜라')).toBe(0);

      productModel.decreaseProductQuantity('콜라', 5);
      expect(productModel.findProductPromotionProductQuantity('콜라')).toBe(0);
    });

    test('프로모션 제품의 개수를 초과하면 0개가 된다.', () => {
      productModel.decreaseProductQuantity('콜라', 25);
      expect(productModel.findProductPromotionProductQuantity('콜라')).toBe(0);
    });
  });
});

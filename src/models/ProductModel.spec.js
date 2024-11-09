import FileView from '../views/FileView';
import ProductModel from './ProductModel';

describe('ProductModel', () => {
  let productModel;
  beforeEach(() => {
    const products = FileView.getProducts();
    const promotions = FileView.getPromotions();
    productModel = new ProductModel(products, promotions);
  });

  describe('getPromotionInfo', () => {
    test('날짜가 지난 프로모션 정보를 반환하지 않는다.', () => {
      expect(productModel.getPromotionInfo('닭가슴살')).toBeUndefined();
    });
    test('아이템의 프로모션의 정보를 반환한다.', () => {
      expect(productModel.getPromotionInfo('콜라')).toHaveProperty('name', '탄산2+1');
      expect(productModel.getPromotionInfo('콜라')).toHaveProperty('buy', 2);
      expect(productModel.getPromotionInfo('콜라')).toHaveProperty('get', 1);
      expect(productModel.getPromotionInfo('콜라')).toHaveProperty('startDate', new Date('2024-01-01'));
      expect(productModel.getPromotionInfo('콜라')).toHaveProperty('endDate', new Date('2024-12-31'));
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

  describe('getPromotionPossibleQuantity', () => {
    test('프로모션 적용이 가능한 상품의 개수를 반환한다', () => {
      expect(productModel.getPromotionPossibleQuantity('콜라')).toBe(9);
      expect(productModel.getPromotionPossibleQuantity('사이다')).toBe(6);
      expect(productModel.getPromotionPossibleQuantity('오렌지주스')).toBe(8);
      expect(productModel.getPromotionPossibleQuantity('탄산수')).toBe(3);
      expect(productModel.getPromotionPossibleQuantity('감자칩')).toBe(4);
      expect(productModel.getPromotionPossibleQuantity('물')).toBe(0);
    });
  });

  describe('getProductQuantity', () => {
    test('제품 개수를 반환한다.', () => {
      expect(productModel.getProductQuantity('콜라')).toBe(20);
      expect(productModel.getProductQuantity('사이다')).toBe(15);
      expect(productModel.getProductQuantity('오렌지주스')).toBe(9);
      expect(productModel.getProductQuantity('탄산수')).toBe(5);
      expect(productModel.getProductQuantity('물')).toBe(10);
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

  describe('reduceProduct', () => {
    test('제품 개수를 감소시킨다.', () => {
      productModel.reduceProduct('콜라', 5);
      expect(productModel.getProductQuantity('콜라')).toBe(15);

      productModel.reduceProduct('콜라', 5);
      expect(productModel.getProductQuantity('콜라')).toBe(10);

      productModel.reduceProduct('콜라', 5);
      expect(productModel.getProductQuantity('콜라')).toBe(5);

      productModel.reduceProduct('콜라', 5);
      expect(productModel.getProductQuantity('콜라')).toBe(0);

      productModel.reduceProduct('콜라', 5);
      expect(productModel.getProductQuantity('콜라')).toBe(0);
    });

    test('프로모션 제품의 개수를 먼저 감소시킨다.', () => {
      productModel.reduceProduct('콜라', 5);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(5);

      productModel.reduceProduct('콜라', 5);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(0);

      productModel.reduceProduct('콜라', 5);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(0);
    });

    test('프로모션 제품의 개수를 초과하면 0개가 된다.', () => {
      productModel.reduceProduct('콜라', 25);
      expect(productModel.getPromotionProductQuantity('콜라')).toBe(0);
    });
  });
});

import FileController from '../views/FileView.js';
import OutputView from '../views/OutputView.js';

class StoreModel {
  #products;
  #promotions;

  constructor() {
    this.#products = FileController.getProducts();
    this.#promotions = FileController.getPromotions();

    OutputView.printHello();
    OutputView.printProducts(this.#products);
  }

  getPromotionUnit(item) {
    const promotionInfo = this.getPromotionInfo(item);

    if (!promotionInfo) return null;
    const promotionUnit = promotionInfo.buy + promotionInfo.get;
    return promotionUnit;
  }

  getPromotionPossibleQuantity(item) {
    const promotionProductQuantity = this.getPromotionProductQuantity(item);
    const promotionUnit = this.getPromotionUnit(item);
    const promotionPossibleQuantity =
      Math.floor(promotionProductQuantity / promotionUnit) * promotionUnit;

    return promotionPossibleQuantity;
  }

  getPromotionInfo(item) {
    const productInfo = this.#getPromotionProductInfo(item);
    const promotionInfo = this.#promotions.find(
      (promotion) => promotion.name === productInfo?.promotion,
    );

    return promotionInfo;
  }

  getProductQuantity(item) {
    return this.#getProducts(item).reduce((prev, cur) => prev + cur.quantity, 0);
  }

  getPromotionProductQuantity(item) {
    return this.#getPromotionProductInfo(item)?.quantity;
  }

  #getPromotionProductInfo(item) {
    return this.#getProducts(item).find((product) => product.promotion !== 'null');
  }

  getIsProductLeft(item, quantity) {
    return this.getProductQuantity(item) >= quantity;
  }

  reduceProduct(item, quantity = 1) {
    const products = this.#getProducts(item);

    // [ ] 불변성
    let leftQuantity = quantity;

    products.forEach((product) => {
      if (product.quantity > 0) {
        const reducedQuantity = Math.min(product.quantity, leftQuantity);
        product.quantity -= reducedQuantity;
        leftQuantity -= reducedQuantity;
      }
    });
  }

  getPrice(item) {
    const products = this.#getProducts(item);
    const product = products[0];

    return product.price;
  }

  #getProducts(item) {
    return this.#products.filter((product) => product.name === item);
  }
}

export default StoreModel;

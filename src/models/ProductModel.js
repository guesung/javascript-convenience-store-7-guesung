import FileController from '../views/FileView.js';
import OutputView from '../views/OutputView.js';

class ProductModel {
  #products;
  #promotions;

  constructor() {
    this.#products = FileController.getProducts();
    this.#promotions = FileController.getPromotions();

    OutputView.printHello();
    OutputView.printProducts(this.#products);
  }

  getPromotionInfo(item) {
    const productInfo = this.#getPromotionProductInfo(item);
    return this.#promotions.find((promotion) => promotion.name === productInfo?.promotion);
  }

  getPromotionUnit(item) {
    const promotionInfo = this.getPromotionInfo(item);

    if (!promotionInfo) return null;
    return promotionInfo.buy + promotionInfo.get;
  }

  getPromotionPossibleQuantity(item) {
    const promotionProductQuantity = this.getPromotionProductQuantity(item);
    const promotionUnit = this.getPromotionUnit(item);
    if (!promotionUnit) return 0;

    return Math.floor(promotionProductQuantity / promotionUnit) * promotionUnit;
  }

  getProductQuantity(item) {
    return this.#getProducts(item).reduce((prev, cur) => prev + cur.quantity, 0);
  }

  getPromotionProductQuantity(item) {
    return this.#getPromotionProductInfo(item)?.quantity ?? 0;
  }

  #getPromotionProductInfo(item) {
    return this.#getProducts(item).find((product) => product.promotion !== 'null');
  }

  reduceProduct(item, quantity = 1) {
    const products = this.#getProducts(item);
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

export default ProductModel;

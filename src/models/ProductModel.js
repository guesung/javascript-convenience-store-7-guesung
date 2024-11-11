class ProductModel {
  #products;
  #promotions;

  constructor(products, promotions) {
    this.#products = products;
    this.#promotions = promotions;
  }

  [Symbol.iterator]() {
    return this.#products[Symbol.iterator]();
  }

  findPromotion(item) {
    const product = this.#findPromotionEnableProduct(item);

    return this.#promotions.find((promotion) => promotion.name === product?.promotion);
  }

  getPromotionUnit(item) {
    const promotion = this.findPromotion(item);

    if (!promotion) return null;
    return promotion.buy + promotion.get;
  }

  getPromotionEnableQuantity(item, quantity = Infinity) {
    const promotionUnit = this.getPromotionUnit(item);
    const promotionProductQuantity = this.getPromotionProductQuantity(item);
    if (!promotionUnit) return 0;

    return Math.floor(Math.min(promotionProductQuantity, quantity) / promotionUnit) * promotionUnit;
  }

  getTotalQuantity(item) {
    return this.#findProductsByName(item).reduce((accumulatedQuantity, product) => accumulatedQuantity + product.quantity, 0);
  }

  getPromotionProductQuantity(item) {
    return this.#findPromotionEnableProduct(item)?.quantity ?? 0;
  }

  getPrice(item) {
    const products = this.#findProductsByName(item);
    const product = products[0];

    return product.price;
  }

  getCanFreeProduct(item, quantity) {
    const promotionUnit = this.getPromotionUnit(item);
    const promotionEnableQuantity = this.getPromotionEnableQuantity(item);

    return (quantity + 1) % promotionUnit === 0 && promotionEnableQuantity >= quantity + 1;
  }

  getPromotionFreeQuantity(item, quantity) {
    return this.getPromotionEnableQuantity(item, quantity) / this.getPromotionUnit(item);
  }

  decreaseQuantity(item, quantity = 1) {
    const products = this.#findProductsByName(item);
    let leftQuantity = quantity;

    products.forEach((product) => {
      if (product.quantity === 0) return;

      const reducedQuantity = Math.min(product.quantity, leftQuantity);
      product.quantity -= reducedQuantity;
      leftQuantity -= reducedQuantity;
    });
  }

  #findProductsByName(item) {
    return this.#products.filter((product) => product.name === item);
  }

  #findPromotionEnableProduct(item) {
    return this.#findProductsByName(item).find((product) => product.promotion !== 'null');
  }
}

export default ProductModel;

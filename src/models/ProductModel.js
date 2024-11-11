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

  /** item 제품의 프로모션을 반환한다. */
  findPromotion(item) {
    const product = this.#findPromotionEnableProduct(item);

    return this.#promotions.find((promotion) => promotion.name === product?.promotion);
  }

  /** 프로모션 단위 개수을 반환한다. */
  getPromotionUnit(item) {
    const promotion = this.findPromotion(item);

    if (!promotion) return null;
    return promotion.buy + promotion.get;
  }

  /**
   * 프로모션 적용이 가능한 제품의 전체 개수를 반환한다.
   * quantity를 넘기지 않을 경우, 남아있는 재고에서 개수를 확인한다.
   * quantity를 넘길 경우, 주문한 개수와 남아있는 재고 중 더 작은 값으로 계산한다.
   */
  getPromotionEnableQuantity(item, quantity = Infinity) {
    const promotionUnit = this.getPromotionUnit(item);
    const promotionProductQuantity = this.getPromotionProductQuantity(item);
    if (!promotionUnit) return 0;

    return Math.floor(Math.min(promotionProductQuantity, quantity) / promotionUnit) * promotionUnit;
  }

  /** item 제품의 전체 개수을 반환한다. */
  getTotalQuantity(item) {
    return this.#findProductsByName(item).reduce((accumulatedQuantity, product) => accumulatedQuantity + product.quantity, 0);
  }

  /** item 프로모션 제품의 개수을 반환한다. */
  getPromotionProductQuantity(item) {
    return this.#findPromotionEnableProduct(item)?.quantity ?? 0;
  }

  /** item의 가격을 반환한다. */
  getPrice(item) {
    const products = this.#findProductsByName(item);
    const product = products[0];

    return product.price;
  }

  /** item을 quantity개 가져왔을 때 무료로 얻을 수 있는지을 반환한다. */
  getCanFreeProduct(item, quantity) {
    const promotionUnit = this.getPromotionUnit(item);
    const promotionEnableQuantity = this.getPromotionEnableQuantity(item);

    return (quantity + 1) % promotionUnit === 0 && promotionEnableQuantity >= quantity + 1;
  }

  /** 프로모션으로 얻은 제품의 개수를 반환한다. */
  getPromotionFreeQuantity(item, quantity) {
    return this.getPromotionEnableQuantity(item, quantity) / this.getPromotionUnit(item);
  }

  /**
   * item의 개수를 감소한다.
   * quantity를 넘기지 않을 경우 1개 감소
   * quantity를 넘길 경우 quantity개만큼 감소
   */
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

  /** item 제품 정보을 반환한다. */
  #findProductsByName(item) {
    return this.#products.filter((product) => product.name === item);
  }

  /** item 제품의 프로모션 정보을 반환한다. */
  #findPromotionEnableProduct(item) {
    return this.#findProductsByName(item).find((product) => product.promotion !== 'null');
  }
}

export default ProductModel;

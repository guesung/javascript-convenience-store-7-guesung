class ProductModel {
  #products;
  #promotions;

  constructor(products, promotions) {
    this.#products = products;
    this.#promotions = promotions;
  }

  /** item 제품의 프로모션을 반환한다. */
  getPromotion(item) {
    const product = this.#getPromotionProduct(item);
    return this.#promotions.find((promotion) => promotion.name === product?.promotion);
  }

  /** 프로모션 단위 개수을 반환한다. */
  getPromotionUnit(item) {
    const promotion = this.getPromotion(item);

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
  getQuantity(item) {
    return this.#getProducts(item).reduce((prev, cur) => prev + cur.quantity, 0);
  }

  /** item 프로모션 제품의 개수을 반환한다. */
  getPromotionProductQuantity(item) {
    return this.#getPromotionProduct(item)?.quantity ?? 0;
  }

  /** item 제품의 프로모션 정보을 반환한다. */
  #getPromotionProduct(item) {
    return this.#getProducts(item).find((product) => product.promotion !== 'null');
  }

  /** item의 가격을 반환한다. */
  getPrice(item) {
    const products = this.#getProducts(item);
    const product = products[0];

    return product.price;
  }

  /** item 제품 정보을 반환한다. */
  #getProducts(item) {
    return this.#products.filter((product) => product.name === item);
  }

  /** item을 quantity개 가져왔을 때 무료로 얻을 수 있는지을 반환한다. */
  getCanFreeProduct(item, quantity) {
    const promotionUnit = this.getPromotionUnit(item);
    const promotionPossibleQuantity = this.getPromotionEnableQuantity(item);

    return (quantity + 1) % promotionUnit === 0 && promotionPossibleQuantity >= quantity + 1;
  }

  /**
   * item의 개수를 감소한다.
   * quantity를 넘기지 않을 경우 1개 감소
   * quantity를 넘길 경우 quantity개만큼 감소
   */
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
}

export default ProductModel;

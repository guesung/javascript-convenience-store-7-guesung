class ProductModel {
  #products;
  #promotions;

  constructor(products, promotions) {
    this.#products = products;
    this.#promotions = promotions;
  }

  /** 프로모션 정보 */
  getPromotionInfo(item) {
    const productInfo = this.#getPromotionProductInfo(item);
    return this.#promotions.find((promotion) => promotion.name === productInfo?.promotion);
  }

  /** 프로모션 단위 개수 */
  getPromotionUnit(item) {
    const promotionInfo = this.getPromotionInfo(item);

    if (!promotionInfo) return null;
    return promotionInfo.buy + promotionInfo.get;
  }

  /** 프로모션 적용이 가능한 제품의 전체 개수 */
  getPromotionEnableQuantity(item, quantity = Infinity) {
    const promotionUnit = this.getPromotionUnit(item);
    const promotionProductQuantity = this.getPromotionProductQuantity(item);
    if (!promotionUnit) return 0;

    return Math.floor(Math.min(promotionProductQuantity, quantity) / promotionUnit) * promotionUnit;
  }

  getQuantity(item) {
    return this.#getProducts(item).reduce((prev, cur) => prev + cur.quantity, 0);
  }

  getPromotionProductQuantity(item) {
    return this.#getPromotionProductInfo(item)?.quantity ?? 0;
  }

  #getPromotionProductInfo(item) {
    return this.#getProducts(item).find((product) => product.promotion !== 'null');
  }

  getPrice(item) {
    const products = this.#getProducts(item);
    const product = products[0];

    return product.price;
  }

  #getProducts(item) {
    return this.#products.filter((product) => product.name === item);
  }

  getCanFreeProduct(item, quantity) {
    const promotionUnit = this.getPromotionUnit(item);
    const promotionPossibleQuantity = this.getPromotionEnableQuantity(item);

    return (quantity + 1) % promotionUnit === 0 && promotionPossibleQuantity >= quantity + 1;
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
}

export default ProductModel;

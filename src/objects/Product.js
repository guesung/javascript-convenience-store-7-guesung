class Product {
  #products;
  #promotions;

  constructor(products, promotions) {
    this.#products = products;
    this.#promotions = promotions;
  }

  get products() {
    return this.#products;
  }

  getPromotionInfo(item) {
    const productInfo = this.#getPromotionProductInfo(item);
    const promotionInfo = this.#promotions.find(
      (promotion) => promotion.name === productInfo.promotion,
    );

    return promotionInfo;
  }

  getProductQuantity(item) {
    return this.#getProducts(item).reduce((prev, cur) => prev + cur.quantity, 0);
  }

  #getPromotionProducts(item) {
    return this.#getProducts(item).filter((product) => product.promotion !== '');
  }

  getPromotionProductQuantity(item) {
    return this.#getPromotionProducts(item).reduce((prev, cur) => prev + cur.quantity, 0);
  }

  #getPromotionProductInfo(item) {
    return this.#getProducts(item).find((product) => product.promotion !== 'null');
  }

  getIsProductLeft(item, quantity) {
    return this.getProductQuantity(item) >= quantity;
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

export default Product;

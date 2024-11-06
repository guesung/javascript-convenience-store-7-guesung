import {
  FileController,
  InputController,
  OutputController,
} from '../controllers/index.js';
import Customer from './Customer.js';
import Product from './Product.js';
import Promotion from './Promotion.js';

class Store {
  #products;
  #promotions;

  prepareProducts() {
    const products = FileController.getProducts();
    const promotions = FileController.getPromotions();

    this.#products = new Product(products);
    this.#promotions = new Promotion(promotions);

    OutputController.printHello();
    OutputController.printProducts(this.#products.products);
  }

  async checkPromotion(orderHistory) {
    for await (const [item, quantity] of orderHistory) {
      const currentProduct = this.#products.getPromotionProduct(item);
      const currentPromotion = this.#promotions.getPromotion(
        currentProduct.promotion,
      );

      const isProductLeft = this.#products.getIsProductLeft(item, quantity + 1);
      if (!isProductLeft) continue;

      if (quantity === currentPromotion.buy) {
        const answer = await InputController.askOneMoreFree(item);
        if (answer === 'Y') {
          orderHistory.set(item, quantity + 1);
          continue;
        }
      }
      if (quantity < currentPromotion.buy) {
        const answer = await InputController.askMoreForPromotion(
          item,
          quantity,
        );
        if (answer === 'Y') {
          orderHistory.set(item, quantity + 1);
          continue;
        }
      }
    }
  }
}

export default Store;

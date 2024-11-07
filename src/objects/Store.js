import { FileController, OutputController } from '../controllers/index.js';
import { ERROR_MESSAGE } from '../lib/constants.js';
import Product from './Product.js';

class Store {
  product;

  prepareProducts() {
    const products = FileController.getProducts();
    const promotions = FileController.getPromotions();

    OutputController.printHello();
    OutputController.printProducts(products);

    this.product = new Product(products, promotions);
  }

  validateItemsQuantity(items) {
    items.forEach(([name, quantity]) => {
      const productQuantity = this.product.getProductQuantity(name);
      if (productQuantity === 0) throw new Error(ERROR_MESSAGE.noItem);
      if (productQuantity < quantity)
        throw new Error(ERROR_MESSAGE.overQuantity);
    });
  }
}

export default Store;

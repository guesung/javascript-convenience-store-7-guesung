import { FileController, OutputController } from '../controllers/index.js';
import Product from './Product.js';

class Store {
  #products;

  prepareProducts() {
    const products = FileController.getProducts();
    const promotions = FileController.getPromotions();

    OutputController.printHello();
    OutputController.printProducts(products);

    this.#products = new Product(products, promotions);
  }
}

export default Store;

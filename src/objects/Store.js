import { FileController, OutputController } from '../controllers/index.js';
import Product from './Product.js';

class Store {
  #product;

  get product() {
    return this.#product;
  }

  prepareProducts() {
    const products = FileController.getProducts();
    const promotions = FileController.getPromotions();

    this.#product = new Product(products, promotions);

    OutputController.printHello();
    OutputController.printProducts(this.#product.products);
  }
}

export default Store;

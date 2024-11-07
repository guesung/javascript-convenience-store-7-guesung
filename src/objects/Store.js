import { FileController, OutputController } from '../controllers/index.js';
import Product from './Product.js';

class Store {
  static prepareProducts() {
    const products = FileController.getProducts();
    const promotions = FileController.getPromotions();

    OutputController.printHello();
    OutputController.printProducts(products);

    const product = new Product(products, promotions);
    return product;
  }
}

export default Store;

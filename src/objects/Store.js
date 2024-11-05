import * as fs from 'fs';
import { OutputController } from '../controllers/index.js';

class Store {
  #products;
  #productEventList;

  prepareProducts() {
    const rawProducts = fs.readFileSync('public/products.md', 'utf8');
    const rawProductEvents = fs.readFileSync('public/promotions.md', 'utf8');

    this.#products = Store.#parseProducts(rawProducts);
    this.#productEventList = Store.#parseProductEventList(rawProductEvents);

    OutputController.printHello();
    OutputController.printProducts(this.#products);
  }

  static #parseProducts(rawProducts) {
    const tempProducts = rawProducts.trim().split('\n');
    tempProducts.shift();
    return tempProducts.map((productInformation) => {
      const [name, price, quantity, promotion] = productInformation.split(',');
      return { name, price, quantity, promotion };
    });
  }

  static #parseProductEventList(rawProductEvents) {
    const tempProductEvents = rawProductEvents.trim().split('\n');
    tempProductEvents.shift();
    return tempProductEvents.map((tempProductEvent) => {
      const [name, buy, get, startDate, endDate] = tempProductEvent.split(',');
      return { name, buy, get, startDate, endDate };
    });
  }
}

export default Store;

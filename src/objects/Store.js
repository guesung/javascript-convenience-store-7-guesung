import * as fs from 'fs';

class Store {
  #productsInformation;

  constructor() {
    this.#productsInformation = [];
  }

  async prepareProducts() {
    const rawProducts = fs.readFileSync('public/products.md', 'utf8');
    this.#productsInformation = this.#parseProducts(rawProducts);
  }

  #parseProducts(rawProducts) {
    const productInformationArray = rawProducts.trim().split('\n');
    productInformationArray.shift();
    productInformationArray.forEach((productInformation) => {
      const [name, price, quantity, promotion] = productInformation.split(',');
      this.#productsInformation.push({ name, price, quantity, promotion });
    });
  }
}

export default Store;

import InputController from './controllers/InputController.js';
import { Customer, Store } from './objects/index.js';

class App {
  #store;
  #customer;

  constructor() {
    this.#store = new Store();
    this.#customer = new Customer();
  }

  async run() {
    this.#store.prepareProducts();

    await this.#customer.order(this.#store.product);

    await this.#customer.checkPromotion(this.#store.product);

    this.#customer.calculateOrder(this.#store.product);

    const isMembershipDiscount =
      await InputController.getIsMembershipDiscount();

    this.#customer.calculateAll(isMembershipDiscount);
  }
}

export default App;

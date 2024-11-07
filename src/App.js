import InputController from './controllers/InputController.js';
import { Customer, Store, Worker } from './objects/index.js';

class App {
  #store;
  #customer;
  #worker;

  constructor() {
    this.#store = new Store();
    this.#customer = new Customer();
    this.#worker = new Worker();
  }

  async run() {
    this.#store.prepareProducts();

    await this.#customer.order();

    await this.#customer.checkPromotion(this.#store.product);

    this.#customer.calculateOrder(this.#store.product);

    const isMembershipDiscount =
      await InputController.getIsMembershipDiscount();

    this.#customer.calculateAll(isMembershipDiscount);
  }
}

export default App;

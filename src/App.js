import InputController from './controllers/InputController.js';
import { Customer, Worker } from './objects/index.js';

class App {
  #worker;
  #customer;

  constructor() {
    this.#worker = new Worker();
    this.#customer = new Customer();
  }

  async run() {
    this.#worker.prepareProducts();

    await this.#customer.order(this.#worker.product);

    await this.#customer.checkPromotion(this.#worker.product);

    this.#customer.calculateOrder(this.#worker.product);

    const isMembershipDiscount =
      await InputController.getIsMembershipDiscount();

    this.#customer.calculateAll(isMembershipDiscount);
  }
}

export default App;

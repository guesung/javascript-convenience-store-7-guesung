import InputController from './controllers/InputController.js';
import Customer from './objects/Customer.js';
import Store from './objects/Store.js';

class App {
  #store;

  constructor() {
    this.#store = new Store();
  }

  async run() {
    await InputController.retryWhileOrderFinish(async () => {
      const customer = new Customer();

      await customer.order(this.#store);

      await customer.checkItemsPromotion(this.#store);

      customer.calculateOrder(this.#store);

      await customer.checkMembershipDiscount();

      customer.calculateAll();
    });
  }
}

export default App;

import InputController from './controllers/InputController.js';
import Customer from './objects/Customer.js';
import Store from './objects/Store.js';

class App {
  #store;

  constructor() {
    this.#store = new Store();
  }

  async run() {
    this.#store.prepareProducts();

    await InputController.retryWhileOrderFinish(async () => {
      const customer = new Customer();

      await customer.order(this.#store);

      await customer.checkItemsPromotion(this.#store.product);

      customer.calculateOrder(this.#store.product);

      const isMembershipDiscount = await InputController.readtIsMembershipDiscount();

      customer.calculateAll(isMembershipDiscount);
    });
  }
}

export default App;

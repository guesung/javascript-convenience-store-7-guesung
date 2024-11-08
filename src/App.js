import InputView from './views/InputView.js';
import CustomerModel from './models/CustomerModel.js';
import StoreModel from './models/StoreModel.js';

class App {
  #store;

  constructor() {
    this.#store = new StoreModel();
  }

  async run() {
    await InputView.retryWhileOrderFinish(async () => {
      const customer = new CustomerModel();
      await customer.order(this.#store);

      await customer.checkItemsPromotion(this.#store);
      await customer.checkMembershipDiscount();

      customer.showRecipt(this.#store);
    });
  }
}

export default App;

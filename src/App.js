import StoreController from './controllers/StoreController.js';

class App {
  #storeController;

  constructor() {
    this.#storeController = new StoreController();
  }

  async run() {
    this.#storeController.openTheStore();

    await this.#storeController.startTakeOrder();
  }
}

export default App;

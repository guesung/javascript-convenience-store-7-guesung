import { StoreController } from './controllers/index.js';

class App {
  #storeController;

  constructor() {
    this.#storeController = new StoreController();
  }

  async run() {
    await this.#storeController.startTakeOrder();
  }
}

export default App;

import StoreController from './controllers/StoreController.js';

class App {
  async run() {
    const storeController = new StoreController();
    await storeController.openTheStore();
  }
}

export default App;

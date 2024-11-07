import { Worker } from './objects/index.js';
import Store from './objects/Store.js';

class App {
  #worker;

  async run() {
    const product = Store.prepareProducts();

    this.#worker = new Worker(product);

    await this.#worker.openStore(product);
  }
}

export default App;

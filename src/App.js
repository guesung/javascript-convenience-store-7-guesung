import { Worker } from './objects/index.js';

class App {
  #worker;

  constructor() {
    this.#worker = new Worker();
  }

  async run() {
    this.#worker.prepareProducts();

    await this.#worker.openStore();
  }
}

export default App;

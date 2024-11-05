import { Customer, Store, Worker } from './objects/index.js';

class App {
  #customer;
  #worker;
  #store;

  constructor() {
    this.#customer = new Customer();
    this.#worker = new Worker();
    this.#store = new Store();
  }

  async run() {
    this.#store.prepareProducts();
  }
}

export default App;

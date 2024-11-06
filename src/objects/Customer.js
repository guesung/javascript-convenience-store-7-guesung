import { InputController } from '../controllers/index.js';
import OrderHistory from './OrderHistory.js';

class Customer {
  #orderHistory;
  #receipt;

  static async order() {
    const items = await InputController.readItems();

    return new OrderHistory(items);
  }
}

export default Customer;

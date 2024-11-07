import { InputController, OutputController } from '../controllers/index.js';
import OrderHistory from './OrderHistory.js';

class Customer {
  #orderHistory;
  #receipt;

  constructor() {
    this.#receipt = [];
  }

  async order() {
    const items = await InputController.readItems();

    this.#orderHistory = new OrderHistory(items);
  }

  async checkPromotion(product) {
    for await (const [item, quantity] of this.#orderHistory.orderMap) {
      const promotionInfo = product.getPromotionInfo(item);
      const isProductLeft = product.getIsProductLeft(item, quantity + 1);

      if (!isProductLeft) continue;

      if (quantity === promotionInfo.buy) {
        const answer = await InputController.askOneMoreFree(item);
        if (answer === 'Y') this.#orderHistory.addQuantity(item);
      }
      if (quantity < promotionInfo.buy) {
        const answer = await InputController.askMoreForPromotion(
          item,
          quantity,
        );
        if (answer === 'Y') this.#orderHistory.addQuantity(item);
      }
    }
  }

  calculateOrder(product) {
    for (const [item, quantity] of this.#orderHistory.orderMap) {
      const promotionInfo = product.getPromotionInfo(item);
      const price = product.getPrice(item);

      const promotionQuantity = Math.floor(
        quantity / (promotionInfo.buy + promotionInfo.get),
      );

      this.#receipt.push({
        quantity,
        price,
        name: item,
        promotionQuantity,
      });

      product.reduceProduct(item, quantity);
    }
  }

  calculateAll(isMembershipDiscount) {
    OutputController.printReceipt(this.#receipt, isMembershipDiscount);
  }
}

export default Customer;

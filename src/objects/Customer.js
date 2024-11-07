import { InputController, OutputController } from '../controllers/index.js';
import OrderHistory from './OrderHistory.js';

class Customer {
  #orderHistory;
  #receipt;

  async order(store) {
    const items = await InputController.readItems(store);

    this.#orderHistory = new OrderHistory(items);
  }

  async checkItemsPromotion(product) {
    for await (const [item, quantity] of this.#orderHistory.orderMap) {
      await this.#checkItemPromotion(product, item, quantity);
    }
  }

  async #checkItemPromotion(product, item, quantity) {
    const promotionInfo = product.getPromotionInfo(item);
    if (!promotionInfo) return;

    const promotionUnit = promotionInfo.buy + promotionInfo.get;
    const isPromotionProductLessThanQuantity =
      product.getPromotionProductQuantity(item) < quantity;

    const currentPromotionQuantity =
      Math.floor(
        Math.min(quantity, product.getPromotionProductQuantity(item)) /
          promotionUnit,
      ) * promotionUnit;

    if (isPromotionProductLessThanQuantity) {
      await this.#askNoPromotion(item, quantity - currentPromotionQuantity);
      return;
    }

    if ((quantity + 1) % promotionUnit === 0) await this.#askOneMoreFree(item);
  }

  async #askNoPromotion(item, quantity) {
    const isMoreForPromotion = await InputController.readIsBuyWithoutPromotion(
      item,
      quantity,
    );
    if (isMoreForPromotion) this.#orderHistory.addQuantity(item);
  }

  async #askOneMoreFree(item) {
    const isOneMoreFree = await InputController.readIsGetFreePromotion(item);
    if (isOneMoreFree) this.#orderHistory.addQuantity(item);
  }

  calculateOrder(product) {
    this.#receipt = [];

    for (const [item, quantity] of this.#orderHistory.orderMap) {
      const promotionInfo = product.getPromotionInfo(item);
      const price = product.getPrice(item);

      let promotionQuantity = 0;
      let promotionAdjustQuantity = 0;

      if (promotionInfo) {
        promotionQuantity = Math.floor(
          quantity / (promotionInfo.buy + promotionInfo.get),
        );
        promotionAdjustQuantity =
          promotionQuantity * (promotionInfo.buy + promotionInfo.get);
      }

      this.#receipt.push({
        quantity,
        price,
        name: item,
        promotionQuantity,
        promotionAdjustQuantity,
      });

      product.reduceProduct(item, quantity);
    }
  }

  calculateAll(isMembershipDiscount) {
    OutputController.printReceipt(this.#receipt, isMembershipDiscount);
  }
}

export default Customer;

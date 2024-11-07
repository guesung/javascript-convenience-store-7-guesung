import {
  FileController,
  InputController,
  OutputController,
} from '../controllers/index.js';
import OrderHistory from './OrderHistory.js';
import Product from './Product.js';

class Worker {
  #product;
  #orderHistory;
  #receipt;

  constructor(product) {
    this.#product = product;
    this.#receipt = [];
  }

  async openStore() {
    await InputController.retryWhileOrderFinish(async () => {
      await this.#takeOrder();

      await this.#checkItemsPromotion();

      this.#calculateOrder();

      const isMembershipDiscount =
        await InputController.getIsMembershipDiscount();

      this.#calculateAll(isMembershipDiscount);
    });
  }

  async #takeOrder() {
    const items = await InputController.readItems(this.#product);

    this.#orderHistory = new OrderHistory(items);
  }

  async #checkItemsPromotion() {
    for await (const [item, quantity] of this.#orderHistory.orderMap) {
      await this.#checkItemPromotion(item, quantity);
    }
  }

  async #checkItemPromotion(item, quantity) {
    const promotionInfo = this.#product.getPromotionInfo(item);
    if (!promotionInfo) return;

    const promotionUnit = promotionInfo.buy + promotionInfo.get;
    const isPromotionProductLessThanQuantity =
      this.#product.getPromotionProductQuantity(item) < quantity;

    const currentPromotionQuantity =
      Math.floor(
        Math.min(quantity, this.#product.getPromotionProductQuantity(item)) /
          promotionUnit,
      ) * promotionUnit;

    if (isPromotionProductLessThanQuantity) {
      await this.#askNoPromotion(item, quantity - currentPromotionQuantity);
      return;
    }

    if ((quantity + 1) % promotionUnit === 0) await this.#askOneMoreFree(item);
  }

  async #askNoPromotion(item, quantity) {
    const isMoreForPromotion = await InputController.getIsNoPromotion(
      item,
      quantity,
    );
    if (isMoreForPromotion) this.#orderHistory.addQuantity(item);
  }

  async #askOneMoreFree(item) {
    const isOneMoreFree = await InputController.getIsOneMoreFree(item);
    if (isOneMoreFree) this.#orderHistory.addQuantity(item);
  }

  #calculateOrder() {
    for (const [item, quantity] of this.#orderHistory.orderMap) {
      const promotionInfo = this.#product.getPromotionInfo(item);
      const price = this.#product.getPrice(item);

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

      this.#product.reduceProduct(item, quantity);
    }
  }

  #calculateAll(isMembershipDiscount) {
    OutputController.printReceipt(this.#receipt, isMembershipDiscount);
  }
}

export default Worker;

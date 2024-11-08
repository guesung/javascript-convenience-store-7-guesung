import { InputController, OutputController } from '../controllers/index.js';
import OrderHistory from './OrderHistory.js';
import Receipt from './Receipt.js';

// TODO: Customer에 책임이 너무 많다.

class Customer {
  #orderHistory;
  #isMembershipDiscount;
  #receipt;

  async order(store) {
    const items = await InputController.readItems(store);

    this.#orderHistory = new OrderHistory(items);
  }

  async checkItemsPromotion(store) {
    for await (const [item, quantity] of this.#orderHistory.orderMap) {
      await this.#checkItemPromotion(store, item, quantity);
    }
  }

  async #checkItemPromotion(store, item, quantity) {
    const promotionUnit = store.getPromotionUnit(item);
    if (!promotionUnit) return;

    const canOneMoreFree = (quantity + 1) % promotionUnit === 0;
    if (canOneMoreFree) await this.#askOneMoreFree(item);

    const promotionPosibbleQuantity = store.getPromotionPossibleQuantity(item);
    const isPromotionProductLessThanQuantity = quantity > promotionPosibbleQuantity;

    if (isPromotionProductLessThanQuantity)
      await this.#askIsBuyWithoutPromotion(item, quantity - promotionPosibbleQuantity);
  }

  async #askOneMoreFree(item) {
    const isOneMoreFree = await InputController.readIsGetFreePromotion(item);
    if (isOneMoreFree) this.#orderHistory.addQuantity(item);
  }

  async #askIsBuyWithoutPromotion(item, quantity) {
    const isBuyWithoutPromotion = await InputController.readIsBuyWithoutPromotion(item, quantity);
    if (!isBuyWithoutPromotion) this.#orderHistory.reduceQuantity(item, quantity);
  }

  showRecipt(store) {
    this.#receipt = new Receipt();

    for (const [item, quantity] of this.#orderHistory.orderMap) {
      const promotionInfo = store.getPromotionInfo(item);
      const price = store.getPrice(item);
      const promotionProductQuantity = store.getPromotionProductQuantity(item);

      let promotionQuantity = 0;
      let promotionAdjustQuantity = 0;

      if (promotionInfo) {
        const promotionUnit = promotionInfo.buy + promotionInfo.get;
        promotionQuantity = Math.floor(
          Math.min(quantity, promotionProductQuantity) / promotionUnit,
        );
        promotionAdjustQuantity = promotionQuantity * promotionUnit;
      }

      this.#receipt.addItem({
        quantity,
        price,
        name: item,
        promotionQuantity,
        promotionAdjustQuantity,
      });

      store.reduceProduct(item, quantity);
    }

    OutputController.printReceipt(this.#receipt, this.#isMembershipDiscount);
  }

  async checkMembershipDiscount() {
    const isMembershipDiscount = await InputController.readtIsMembershipDiscount();

    this.#isMembershipDiscount = isMembershipDiscount;
  }
}

export default Customer;

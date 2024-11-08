import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';
import OrderHistoryModel from './OrderHistoryModel.js';
import ReceiptModel from './ReceiptModel.js';

// TODO: Customer에 책임이 너무 많다.

class CustomerModel {
  #orderHistory;
  #isMembershipDiscount;
  #receipt;

  async order(store) {
    const items = await InputView.readItems(store);

    this.#orderHistory = new OrderHistoryModel(items);
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
    const isOneMoreFree = await InputView.readIsGetFreePromotion(item);
    if (isOneMoreFree) this.#orderHistory.addQuantity(item);
  }

  async #askIsBuyWithoutPromotion(item, quantity) {
    const isBuyWithoutPromotion = await InputView.readIsBuyWithoutPromotion(item, quantity);
    if (!isBuyWithoutPromotion) this.#orderHistory.reduceQuantity(item, quantity);
  }

  showRecipt(store) {
    this.#receipt = new ReceiptModel();

    for (const order of this.#orderHistory.orderMap) {
      this.#calculateOrder(store, order);
    }

    OutputView.printReceipt(this.#receipt, this.#isMembershipDiscount);
  }

  #calculateOrder(store, [item, quantity]) {
    const promotionUnit = store.getPromotionUnit(item);
    const price = store.getPrice(item);
    const promotionProductQuantity = store.getPromotionProductQuantity(item);

    let promotionQuantity = 0;
    let promotionAdjustQuantity = 0;

    if (promotionUnit > 0) {
      promotionQuantity = Math.floor(Math.min(quantity, promotionProductQuantity) / promotionUnit);
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

  async checkMembershipDiscount() {
    const isMembershipDiscount = await InputView.readtIsMembershipDiscount();

    this.#isMembershipDiscount = isMembershipDiscount;
  }
}

export default CustomerModel;

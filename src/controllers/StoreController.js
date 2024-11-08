import OrderHistoryModel from '../models/OrderHistoryModel.js';
import ProductModel from '../models/ProductModel.js';
import ReceiptModel from '../models/ReceiptModel.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class StoreController {
  #productModel;
  #receiptModel;
  #isMembershipDiscount;
  #orderHistoryModel;

  constructor() {
    this.#productModel = new ProductModel();
  }

  async openTheStore() {
    await InputView.retryWhileOrderFinish(async () => {
      this.#orderHistoryModel = new OrderHistoryModel();
      await this.#orderHistoryModel.getOrder(this.#productModel);

      await this.#checkItemsPromotion();
      await this.#checkMembershipDiscount();

      this.#showRecipt();
    });
  }

  async #checkItemsPromotion() {
    for await (const [item, quantity] of this.#orderHistoryModel.orderMap) {
      await this.#checkItemPromotion(item, quantity);
    }
  }

  async #checkItemPromotion(item, quantity) {
    const promotionUnit = this.#productModel.getPromotionUnit(item);
    if (!promotionUnit) return;

    const canOneMoreFree = (quantity + 1) % promotionUnit === 0;
    if (canOneMoreFree) await this.#askOneMoreFree(item);

    const promotionPosibbleQuantity = this.#productModel.getPromotionPossibleQuantity(item);
    const isPromotionProductLessThanQuantity = quantity > promotionPosibbleQuantity;

    if (isPromotionProductLessThanQuantity)
      await this.#askIsBuyWithoutPromotion(item, quantity - promotionPosibbleQuantity);
  }

  async #askOneMoreFree(item) {
    const isOneMoreFree = await InputView.readIsGetFreePromotion(item);
    if (isOneMoreFree) this.#orderHistoryModel.addQuantity(item);
  }

  async #askIsBuyWithoutPromotion(item, quantity) {
    const isBuyWithoutPromotion = await InputView.readIsBuyWithoutPromotion(item, quantity);
    if (!isBuyWithoutPromotion) this.#orderHistoryModel.reduceQuantity(item, quantity);
  }

  #showRecipt() {
    this.#receiptModel = new ReceiptModel();

    for (const order of this.#orderHistoryModel.orderMap) {
      this.#calculateOrder(order);
    }

    OutputView.printReceipt(this.#receiptModel, this.#isMembershipDiscount);
  }

  #calculateOrder([item, quantity]) {
    const price = this.#productModel.getPrice(item);
    const { promotionQuantity, promotionAdjustQuantity } = this.#getPromotionQuantity(
      item,
      quantity,
    );

    this.#receiptModel.addItem({
      name: item,
      price,
      quantity,
      promotionQuantity,
      promotionAdjustQuantity,
    });

    this.#productModel.reduceProduct(item, quantity);
  }

  #getPromotionQuantity(item, quantity) {
    const promotionUnit = this.#productModel.getPromotionUnit(item);
    if (!promotionUnit)
      return {
        promotionQuantity: 0,
        promotionAdjustQuantity: 0,
      };

    const promotionProductQuantity = this.#productModel.getPromotionProductQuantity(item);
    const promotionQuantity = Math.floor(
      Math.min(quantity, promotionProductQuantity) / promotionUnit,
    );
    const promotionAdjustQuantity = promotionQuantity * promotionUnit;

    return {
      promotionQuantity,
      promotionAdjustQuantity,
    };
  }

  async #checkMembershipDiscount() {
    const isMembershipDiscount = await InputView.readtIsMembershipDiscount();

    this.#isMembershipDiscount = isMembershipDiscount;
  }
}

export default StoreController;

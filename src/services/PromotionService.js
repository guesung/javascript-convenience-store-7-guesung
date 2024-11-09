import { InputView } from '../views/index.js';

class PromotionService {
  #productModel;
  #orderHistoryModel;

  constructor(productModel, orderHistoryModel) {
    this.#productModel = productModel;
    this.#orderHistoryModel = orderHistoryModel;
  }

  async checkItemsPromotion() {
    for await (const [item, quantity] of this.#orderHistoryModel.orderMap) {
      await this.#checkItemPromotion(item, quantity);
    }
  }

  async #checkItemPromotion(item, quantity) {
    const promotionInfo = this.#productModel.getPromotionInfo(item);
    if (!promotionInfo) return;

    const canFreeProduct = this.#productModel.getCanFreeProduct(item, quantity);
    if (canFreeProduct) await this.#askFreeProduct(item);

    const gapQuantityAndPromotionProduct = this.#productModel.getGapQuantityAndPromotionProduct(item, quantity);
    if (gapQuantityAndPromotionProduct > 0) await this.#askBuyWithoutPromotion(item, gapQuantityAndPromotionProduct);
  }

  async #askFreeProduct(item) {
    const isFreeProduct = await InputView.readFreeProduct(item);
    if (isFreeProduct) this.#orderHistoryModel.addQuantity(item);
  }

  async #askBuyWithoutPromotion(item, quantity) {
    const isBuyWithoutPromotion = await InputView.readBuyWithoutPromotion(item, quantity);
    if (!isBuyWithoutPromotion) this.#orderHistoryModel.reduceQuantity(item, quantity);
  }
}

export default PromotionService;

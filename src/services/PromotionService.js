import { InputView } from '../views/index.js';

class PromotionService {
  #productModel;
  #orderHistoryModel;

  constructor(productModel, orderHistoryModel) {
    this.#productModel = productModel;
    this.#orderHistoryModel = orderHistoryModel;
  }

  async checkItemsPromotion() {
    for await (const [item, quantity] of this.#orderHistoryModel) {
      await this.#checkItemPromotion(item, quantity);
    }
  }

  async #checkItemPromotion(item, quantity) {
    const promotion = this.#productModel.findProductPromotion(item);
    if (!promotion) return;

    const canFreeProduct = this.#productModel.getCanFreeProduct(item, quantity);
    if (canFreeProduct) await this.#askFreeProduct(item);

    const gapQuantityAndPromotionProduct = quantity - this.#productModel.findProductPromotionEnableQuantity(item);
    const canBuyWithoutPromotion = gapQuantityAndPromotionProduct > 0;
    if (canBuyWithoutPromotion) await this.#askBuyWithoutPromotion(item, gapQuantityAndPromotionProduct);
  }

  async #askFreeProduct(item) {
    const isFreeProduct = await InputView.readIsFreeProduct(item);
    if (isFreeProduct) this.#orderHistoryModel.addQuantity(item);
  }

  async #askBuyWithoutPromotion(item, quantity) {
    const isBuyWithoutPromotion = await InputView.readIsBuyWithoutPromotion(item, quantity);
    if (!isBuyWithoutPromotion) this.#orderHistoryModel.reduceQuantity(item, quantity);
  }
}

export default PromotionService;

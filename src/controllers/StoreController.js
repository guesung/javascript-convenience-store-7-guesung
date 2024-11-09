import OrderHistoryModel from '../models/OrderHistoryModel.js';
import ProductModel from '../models/ProductModel.js';
import ReceiptModel from '../models/ReceiptModel.js';
import FileView from '../views/FileView.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class StoreController {
  #productModel;

  #orderHistoryModel;
  #receiptModel;

  openTheStore() {
    const products = FileView.getProducts();
    const promotions = FileView.getPromotions();

    this.#productModel = new ProductModel(products, promotions);

    OutputView.printHello();
    OutputView.printProducts(products);
  }

  async startTakeOrder() {
    await InputView.retryWhileOrderFinish(async () => {
      await this.#prepareTheOrder();

      await this.#checkItemsPromotion(); // Product, OrderHistory
      await this.#checkMembershipDiscount(); // Receipt

      this.#generateRecipt(); // OrderHistory, Receipt
      this.#printReceipt(); // Receipt
    });
  }

  async #prepareTheOrder() {
    const items = await InputView.readItems(this.#productModel);

    this.#orderHistoryModel = new OrderHistoryModel(items);
    this.#receiptModel = new ReceiptModel();
  }

  async #checkItemsPromotion() {
    for await (const [item, quantity] of this.#orderHistoryModel.orderMap) {
      await this.#checkItemPromotion(item, quantity);
    }
  }

  async #checkItemPromotion(item, quantity) {
    const promotionInfo = this.#productModel.getPromotionInfo(item);
    if (!promotionInfo) return;

    const canFreeProduct = this.#productModel.getCanFreeProduct(item, quantity);
    if (canFreeProduct) await this.#askOneMoreFree(item);

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

  async #checkMembershipDiscount() {
    const isMembershipDiscount = await InputView.readtIsMembershipDiscount();

    if (isMembershipDiscount) this.#receiptModel.setMembershipDiscount();
  }

  #generateRecipt() {
    for (const order of this.#orderHistoryModel.orderMap) {
      this.#calculateOrder(order);
    }
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

  #printReceipt() {
    OutputView.printReceipt(this.#receiptModel);
  }
}

export default StoreController;

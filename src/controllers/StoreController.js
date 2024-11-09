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

      await this.#checkItemsPromotion();
      await this.#checkMembershipDiscount();

      this.#generateRecipt();
      this.#printReceipt();
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
    const promotionUnit = this.#productModel.getPromotionUnit(item);
    const promotionQuantity = this.#productModel.getPromotionAdjustQuantity(item, quantity);
    const promotionAdjustQuantity = promotionQuantity * promotionUnit;

    this.#receiptModel.addItem({
      name: item,
      price: this.#productModel.getPrice(item),
      quantity,
      promotionQuantity,
      promotionAdjustQuantity,
    });

    this.#productModel.reduceProduct(item, quantity);
  }

  #printReceipt() {
    OutputView.printReceipt(this.#receiptModel);
  }
}

export default StoreController;

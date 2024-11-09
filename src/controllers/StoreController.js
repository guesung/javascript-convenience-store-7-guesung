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

  async #checkMembershipDiscount() {
    const isMembershipDiscount = await InputView.readtIsMembershipDiscount();

    if (isMembershipDiscount) this.#receiptModel.setMembershipDiscount();
  }

  #generateRecipt() {
    for (const [item, quantity] of this.#orderHistoryModel.orderMap) {
      this.#calculateOrder(item, quantity);
      this.#productModel.reduceProduct(item, quantity);
    }
  }

  #calculateOrder(item, quantity) {
    this.#receiptModel.addItem({
      name: item,
      price: this.#productModel.getPrice(item),
      quantity,
      promotionQuantity: this.#productModel.getPromotionAdjustQuantity(item, quantity),
      promotionAdjustTotalQuantity: this.#productModel.getPromotionAdjustTotalQuantity(item, quantity),
    });
  }

  #printReceipt() {
    OutputView.printReceipt(this.#receiptModel);
  }
}

export default StoreController;

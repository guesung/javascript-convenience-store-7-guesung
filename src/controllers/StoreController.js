import { ReceiptModel, ProductModel, OrderHistoryModel } from '../models/index.js';
import { PromotionService } from '../services/index.js';
import { FileView, InputView, OutputView } from '../views/index.js';

class StoreController {
  #productModel;

  #orderHistoryModel;
  #receiptModel;

  constructor() {
    const products = FileView.getProducts();
    const promotions = FileView.findProductPromotions();

    this.#productModel = new ProductModel(products, promotions);
  }

  async startTakeOrder() {
    await InputView.retryWhileOrderFinish(async () => {
      OutputView.printHello();
      OutputView.printProducts(this.#productModel);

      await this.#takeOrder();

      const promotionService = new PromotionService(this.#productModel, this.#orderHistoryModel);
      await promotionService.checkItemsPromotion();

      this.#generateRecipt();
      await this.#checkMembershipDiscount();
      this.#printReceipt();
    });
  }

  async #takeOrder() {
    const items = await InputView.readItems(this.#productModel);

    this.#orderHistoryModel = new OrderHistoryModel(items);
  }

  #generateRecipt() {
    this.#receiptModel = new ReceiptModel();

    for (const [item, quantity] of this.#orderHistoryModel) {
      this.#addItemOnReceipt(item, quantity);
      this.#productModel.decreaseProductQuantity(item, quantity);
    }
  }

  #addItemOnReceipt(item, quantity) {
    this.#receiptModel.addItem({
      name: item,
      price: this.#productModel.getPrice(item),
      quantity,
      promotionFreeQuantity: this.#productModel.findProductPromotionFreeQuantity(item, quantity),
      promotionEnableQuantity: this.#productModel.findProductPromotionEnableQuantity(item, quantity),
    });
  }

  async #checkMembershipDiscount() {
    const isMembershipDiscount = await InputView.readIsMembershipDiscount();

    if (isMembershipDiscount) this.#receiptModel.setMembershipDiscount();
  }

  #printReceipt() {
    OutputView.printReceipt(this.#receiptModel);
  }
}

export default StoreController;

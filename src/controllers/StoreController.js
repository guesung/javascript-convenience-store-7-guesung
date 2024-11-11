import { ReceiptModel, ProductModel, OrderHistoryModel } from '../models/index.js';
import { PromotionService } from '../services/index.js';
import { FileView, InputView, OutputView } from '../views/index.js';

class StoreController {
  #productModel;

  #orderHistoryModel;
  #receiptModel;

  constructor() {
    const products = FileView.readProducts();
    const promotions = FileView.readPromotions();

    this.#productModel = new ProductModel(products, promotions);
  }

  async startTakeOrder() {
    await InputView.retryWhileOrderFinish(async () => {
      this.#printProducts();
      await this.#takeOrder();

      await new PromotionService(this.#productModel, this.#orderHistoryModel).checkItemsPromotion();

      this.#createRecipt();
      await this.#checkMembershipDiscount();
      this.#printReceipt();
    });
  }

  #printProducts() {
    OutputView.printProducts(this.#productModel);
  }

  async #takeOrder() {
    const items = await InputView.readItems(this.#productModel);

    this.#orderHistoryModel = new OrderHistoryModel(items);
  }

  #createRecipt() {
    this.#receiptModel = new ReceiptModel();

    for (const [item, quantity] of this.#orderHistoryModel) {
      this.#addProductOnReceipt(item, quantity);
      this.#productModel.decreaseQuantity(item, quantity);
    }
  }

  #addProductOnReceipt(item, quantity) {
    this.#receiptModel.addProduct({
      name: item,
      price: this.#productModel.getPrice(item),
      quantity,
      promotionFreeQuantity: this.#productModel.getPromotionFreeQuantity(item, quantity),
      promotionEnableQuantity: this.#productModel.getPromotionEnableQuantity(item, quantity),
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

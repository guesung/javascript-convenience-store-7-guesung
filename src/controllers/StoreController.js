import { ReceiptModel, ProductModel, OrderHistoryModel } from '../models/index.js';
import { PromotionService } from '../services/index.js';
import { FileView, InputView, OutputView } from '../views/index.js';

class StoreController {
  #productModel;

  #orderHistoryModel;
  #receiptModel;

  constructor() {
    const products = FileView.getProducts();
    const promotions = FileView.getPromotions();

    this.#productModel = new ProductModel(products, promotions);

    OutputView.printHello();
    OutputView.printProducts(products);
  }

  async startTakeOrder() {
    await InputView.retryWhileOrderFinish(async () => {
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

  async #checkMembershipDiscount() {
    const isMembershipDiscount = await InputView.readtIsMembershipDiscount();

    if (isMembershipDiscount) this.#receiptModel.setMembershipDiscount();
  }

  #printReceipt() {
    OutputView.printReceipt(this.#receiptModel);
  }
}

export default StoreController;

import OrderHistoryModel from '../models/OrderHistoryModel.js';
import ProductModel from '../models/ProductModel.js';
import ReceiptModel from '../models/ReceiptModel.js';
import PromotionService from '../services/PromotionService.js';
import FileView from '../views/FileView.js';
import InputView from '../views/InputView.js';
import OutputView from '../views/OutputView.js';

class StoreController {
  #productModel;

  #orderHistoryModel;
  #receiptModel;

  #promotionService;

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

      await this.#promotionService.checkItemsPromotion();

      await this.#checkMembershipDiscount();

      this.#generateRecipt();
      this.#printReceipt();
    });
  }

  async #prepareTheOrder() {
    const items = await InputView.readItems(this.#productModel);

    this.#orderHistoryModel = new OrderHistoryModel(items);
    this.#receiptModel = new ReceiptModel();
    this.#promotionService = new PromotionService(this.#productModel, this.#orderHistoryModel);
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

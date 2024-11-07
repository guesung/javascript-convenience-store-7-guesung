import {
  FileController,
  InputController,
  OutputController,
} from '../controllers/index.js';
import OrderHistory from './OrderHistory.js';
import Product from './Product.js';

class Worker {
  #product;
  #orderHistory;
  #receipt;

  constructor() {
    this.#receipt = [];
  }

  get product() {
    return this.#product;
  }

  prepareProducts() {
    const products = FileController.getProducts();
    const promotions = FileController.getPromotions();

    this.#product = new Product(products, promotions);

    OutputController.printHello();
    OutputController.printProducts(this.#product.products);
  }

  async openStore() {
    // const a = true

    // while(a){
    // const customer = new Customer();

    await this.#takeOrder();

    await this.#checkPromotion();

    this.#calculateOrder();

    const isMembershipDiscount =
      await InputController.getIsMembershipDiscount();

    this.#calculateAll(isMembershipDiscount);

    // break;
    // }
  }

  async #takeOrder() {
    const items = await InputController.readItems(this.#product);

    this.#orderHistory = new OrderHistory(items);
  }

  async #checkPromotion() {
    for await (const [item, quantity] of this.#orderHistory.orderMap) {
      const promotionInfo = this.#product.getPromotionInfo(item);
      const isProductLeft = this.#product.getIsProductLeft(item, quantity + 1);

      if (!promotionInfo || !isProductLeft) continue;

      if (quantity === promotionInfo.buy) {
        const answer = await InputController.askOneMoreFree(item);
        if (answer === 'Y') this.#orderHistory.addQuantity(item);
      }
      if (quantity < promotionInfo.buy) {
        const answer = await InputController.askMoreForPromotion(
          item,
          quantity,
        );
        if (answer === 'Y') this.#orderHistory.addQuantity(item);
      }
    }
  }

  #calculateOrder() {
    for (const [item, quantity] of this.#orderHistory.orderMap) {
      const promotionInfo = this.#product.getPromotionInfo(item);
      const price = this.#product.getPrice(item);

      let promotionQuantity = 0;
      let promotionAdjustQuantity = 0;

      if (promotionInfo) {
        promotionQuantity = Math.floor(
          quantity / (promotionInfo.buy + promotionInfo.get),
        );
        promotionAdjustQuantity =
          promotionQuantity * (promotionInfo.buy + promotionInfo.get);
      }

      this.#receipt.push({
        quantity,
        price,
        name: item,
        promotionQuantity,
        promotionAdjustQuantity,
      });

      this.#product.reduceProduct(item, quantity);
    }
  }

  #calculateAll(isMembershipDiscount) {
    OutputController.printReceipt(this.#receipt, isMembershipDiscount);
  }
}

export default Worker;

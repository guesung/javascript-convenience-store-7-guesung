import { MEMBERSHIP_DISCOUNT_MAX, MEMBERSHIP_DISCOUNT_PERCENTAGE } from '../lib/constants.js';

class ReceiptModel {
  #receipt;
  #isMembershipDiscount;

  constructor() {
    this.#receipt = [];
    this.#isMembershipDiscount = false;
  }

  [Symbol.iterator]() {
    return this.#receipt[Symbol.iterator]();
  }

  getTotalQuantity() {
    return this.#receipt.reduce((accumulatedQuantity, product) => accumulatedQuantity + product.quantity, 0);
  }

  getTotalPrice() {
    return this.#receipt.reduce((accumulatedPrice, product) => accumulatedPrice + product.price * product.quantity, 0);
  }

  hasPromotionProduct() {
    return this.#receipt.some((item) => item.promotionFreeQuantity > 0);
  }

  getProductPromotionDiscount() {
    return this.#receipt.reduce((accumulatedPromotionDiscount, product) => {
      if (product.promotionFreeQuantity > 0) return product.promotionFreeQuantity * product.price + accumulatedPromotionDiscount;
      return accumulatedPromotionDiscount;
    }, 0);
  }

  getMembershipDiscount() {
    if (this.#isMembershipDiscount === false) return 0;

    const promotionDisabledPrice = this.#getPromotionDisabledPrice();

    return Math.min(promotionDisabledPrice * MEMBERSHIP_DISCOUNT_PERCENTAGE, MEMBERSHIP_DISCOUNT_MAX);
  }

  #getPromotionDisabledPrice() {
    return this.#receipt.reduce((accumulatedPromotionDisabledPrice, product) => accumulatedPromotionDisabledPrice + (product.quantity - product.promotionEnableQuantity) * product.price, 0);
  }

  addProduct(item) {
    this.#receipt.push(item);
  }

  setMembershipDiscount() {
    this.#isMembershipDiscount = true;
  }

  getFinalPrice() {
    return this.getTotalPrice() - this.getProductPromotionDiscount() - this.getMembershipDiscount();
  }
}

export default ReceiptModel;

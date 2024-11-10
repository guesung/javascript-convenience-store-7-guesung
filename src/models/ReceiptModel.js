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

  /** 멤버십 할인을 설정한다. */
  setMembershipDiscount() {
    this.#isMembershipDiscount = true;
  }

  /** 상품을 추가한다. */
  addItem(item) {
    this.#receipt.push(item);
  }

  /** 전체 상품 개수를 반환한다. */
  getTotalQuantity() {
    return this.#receipt.reduce((accumulatedQuantity, product) => accumulatedQuantity + product.quantity, 0);
  }

  /** 총구매액을 반환한다.  */
  getTotalPrice() {
    return this.#receipt.reduce((accumulatedPrice, product) => accumulatedPrice + product.price * product.quantity, 0);
  }

  /** 행사할인 금액을 반환한다. */
  getPromotionDiscount() {
    return this.#receipt.reduce((accumulatedPromotionDiscount, product) => {
      if (product.promotionQuantity > 0) return product.promotionQuantity * product.price + accumulatedPromotionDiscount;
      return accumulatedPromotionDiscount;
    }, 0);
  }

  /** 멤버십할인 금액을 반환한다.  */
  getMembershipDiscount() {
    if (!this.#isMembershipDiscount) return 0;
    const promotionDisabledPrice = this.#receipt.reduce((accumulatedPromotionDisabledPrice, product) => accumulatedPromotionDisabledPrice + (product.quantity - product.promotionAdjustTotalQuantity) * product.price, 0);

    return Math.min(promotionDisabledPrice * MEMBERSHIP_DISCOUNT_PERCENTAGE, MEMBERSHIP_DISCOUNT_MAX);
  }
}

export default ReceiptModel;

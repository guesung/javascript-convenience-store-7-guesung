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

  /** 전체 상품 개수를 반환한다. */
  getTotalQuantity() {
    return this.#receipt.reduce((accumulatedQuantity, product) => accumulatedQuantity + product.quantity, 0);
  }

  /** 총구매액을 반환한다.  */
  getTotalPrice() {
    return this.#receipt.reduce((accumulatedPrice, product) => accumulatedPrice + product.price * product.quantity, 0);
  }

  /** 프로모션 제품이 1개 이상 있는지 반환한다. */
  hasPromotionProduct() {
    return this.#receipt.some((item) => item.promotionFreeQuantity > 0);
  }

  /** 행사할인 금액을 반환한다. */
  getProductPromotionDiscount() {
    return this.#receipt.reduce((accumulatedPromotionDiscount, product) => {
      if (product.promotionFreeQuantity > 0) return product.promotionFreeQuantity * product.price + accumulatedPromotionDiscount;
      return accumulatedPromotionDiscount;
    }, 0);
  }

  /** 멤버십할인 금액을 반환한다.  */
  getMembershipDiscount() {
    if (this.#isMembershipDiscount === false) return 0;

    const promotionDisabledPrice = this.#getPromotionDisabledPrice();

    return Math.min(promotionDisabledPrice * MEMBERSHIP_DISCOUNT_PERCENTAGE, MEMBERSHIP_DISCOUNT_MAX);
  }

  #getPromotionDisabledPrice() {
    return this.#receipt.reduce((accumulatedPromotionDisabledPrice, product) => accumulatedPromotionDisabledPrice + (product.quantity - product.promotionEnableQuantity) * product.price, 0);
  }

  /** 상품을 추가한다. */
  addItem(item) {
    this.#receipt.push(item);
  }

  /** 멤버십 할인을 설정한다. */
  setMembershipDiscount() {
    this.#isMembershipDiscount = true;
  }

  getActualPrice() {
    return this.getTotalPrice() - this.getProductPromotionDiscount() - this.getMembershipDiscount();
  }
}

export default ReceiptModel;

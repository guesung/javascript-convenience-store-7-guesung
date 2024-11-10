import { MEMBERSHIP_DISCOUNT_MAX, MEMBERSHIP_DISCOUNT_PERCENTAGE } from '../lib/constants';

class ReceiptModel {
  #receipt;
  #isMembershipDiscount;

  constructor() {
    this.#receipt = [];
    this.#isMembershipDiscount = false;
  }

  *[Symbol.iterator]() {
    yield* this.#receipt;
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
    return this.#receipt.reduce((prev, cur) => prev + cur.quantity, 0);
  }

  /** 총구매액을 반환한다.  */
  getTotalPrice() {
    return this.#receipt.reduce((prev, cur) => prev + cur.price * cur.quantity, 0);
  }

  /** 행사할인을 반환한다. */
  getPromotionDiscount() {
    return this.#receipt.reduce((prev, cur) => {
      if (cur.promotionQuantity > 0) return cur.promotionQuantity * cur.price + prev;
      return prev;
    }, 0);
  }

  /** 멤버십할인을 반환한다.  */
  getMembershipDiscount() {
    if (!this.#isMembershipDiscount) return 0;
    const totalNoPromotionAdjustPrice = this.#receipt.reduce((prev, cur) => prev + (cur.quantity - cur.promotionAdjustTotalQuantity) * cur.price, 0);

    return Math.min(totalNoPromotionAdjustPrice * MEMBERSHIP_DISCOUNT_PERCENTAGE, MEMBERSHIP_DISCOUNT_MAX);
  }
}

export default ReceiptModel;

class ReceiptModel {
  #receipt;

  #isMembershipDiscount;

  constructor() {
    this.#receipt = [];
    this.#isMembershipDiscount = false;
  }

  get receipt() {
    return this.#receipt;
  }

  get isMembershipDiscount() {
    return this.#isMembershipDiscount;
  }

  setMembershipDiscount() {
    this.#isMembershipDiscount = true;
  }

  addItem(item) {
    this.#receipt.push(item);
  }

  getTotalQuantity() {
    return this.#receipt.reduce((prev, cur) => prev + cur.quantity, 0);
  }

  getTotalPrice() {
    return this.#receipt.reduce((prev, cur) => prev + cur.price * cur.quantity, 0);
  }

  getTotalPromotionPrice() {
    return this.#receipt.reduce((prev, cur) => {
      if (cur.promotionQuantity > 0) return cur.promotionQuantity * cur.price + prev;
      return prev;
    }, 0);
  }

  getMembershipDiscount(isMembershipDiscount) {
    if (!isMembershipDiscount) return 0;
    return (
      (this.#receipt.reduce(
        (prev, cur) => prev + (cur.quantity - cur.promotionAdjustQuantity) * cur.price,
        0,
      ) *
        3) /
      10
    );
  }
}

export default ReceiptModel;

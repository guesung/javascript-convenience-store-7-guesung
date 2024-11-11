class OrderHistoryModel {
  #orderHistory;

  constructor(items) {
    this.#orderHistory = new Map(items);
  }

  *[Symbol.iterator]() {
    yield* this.#orderHistory;
  }

  /** 주문 개수를 반환한다. */
  getQuantity(item) {
    return this.#orderHistory.get(item) ?? 0;
  }

  /**
   * 제품의 개수를 추가한다.
   * quantity를 넘기지 않을 경우, 1개의 제품을 추가한다.
   * quantity를 넘길 경우, quantity개의 제품을 추가한다.
   */
  addQuantity(item, quantity = 1) {
    this.#orderHistory.set(item, this.getQuantity(item) + quantity);
  }

  /**
   * 제품의 개수를 감소시킨다.
   * quantity를 넘기지 않을 경우, 1개의 제품을 감소시킨다.
   * quantity를 넘길 경우, quantity개의 제품을 감소시킨다.
   * 0보다 작을 경우, 0개까지만 감소시킨다.
   */
  reduceQuantity(item, quantity = 1) {
    this.#orderHistory.set(item, Math.max(this.getQuantity(item) - quantity, 0));
  }
}
export default OrderHistoryModel;

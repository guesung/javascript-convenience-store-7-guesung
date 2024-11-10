class OrderHistoryModel {
  #orderMap;

  constructor(items) {
    this.#orderMap = new Map(items);
  }

  [Symbol.iterator]() {
    return this.#orderMap.entries();
  }

  /** 주문 개수를 반환한다. */
  getQuantity(item) {
    return this.#orderMap.get(item) ?? 0;
  }

  /**
   * 제품의 개수를 추가한다.
   * quantity를 넘기지 않을 경우, 1개의 제품을 추가한다.
   * quantity를 넘길 경우, quantity개의 제품을 추가한다.
   */
  addQuantity(item, quantity = 1) {
    this.#orderMap.set(item, this.getQuantity(item) + quantity);
  }

  /**
   * 제품의 개수를 감소시킨다.
   * quantity를 넘기지 않을 경우, 1개의 제품을 감소시킨다.
   * quantity를 넘길 경우, quantity개의 제품을 감소시킨다.
   */
  reduceQuantity(item, quantity = 1) {
    this.#orderMap.set(item, Math.max(this.getQuantity(item) - quantity, 0));
  }
}
export default OrderHistoryModel;

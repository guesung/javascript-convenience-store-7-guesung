class OrderHistoryModel {
  #orderHistory;

  constructor(items) {
    this.#orderHistory = new Map(items);
  }

  *[Symbol.iterator]() {
    yield* this.#orderHistory;
  }

  getItemQuantity(item) {
    return this.#orderHistory.get(item) ?? 0;
  }

  increaseQuantity(item, quantity = 1) {
    this.#orderHistory.set(item, this.getItemQuantity(item) + quantity);
  }

  decreaseQuantity(item, quantity = 1) {
    this.#orderHistory.set(item, Math.max(this.getItemQuantity(item) - quantity, 0));
  }
}
export default OrderHistoryModel;

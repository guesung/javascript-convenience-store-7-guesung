class OrderHistoryModel {
  orderMap;

  constructor(items) {
    this.orderMap = new Map(items);
  }

  getQuantity(item) {
    return this.orderMap.get(item) ?? 0;
  }

  addQuantity(item, quantity = 1) {
    this.orderMap.set(item, this.getQuantity(item) + quantity);
  }

  reduceQuantity(item, quantity = 1) {
    this.orderMap.set(item, Math.max(this.getQuantity(item) - quantity, 0));
  }
}
export default OrderHistoryModel;

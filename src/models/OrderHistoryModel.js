class OrderHistoryModel {
  orderMap;

  constructor(items) {
    this.orderMap = new Map(items);
  }

  getQuantity(item) {
    return this.orderMap.get(item) ?? 0;
  }

  addQuantity(item, quantity = 1) {
    this.orderMap.set(item, this.orderMap.get(item) + quantity);
  }

  reduceQuantity(item, quantity = 1) {
    this.orderMap.set(item, this.orderMap.get(item) - quantity);
  }
}
export default OrderHistoryModel;

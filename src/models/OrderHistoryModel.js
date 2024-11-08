import InputView from '../views/InputView.js';

class OrderHistoryModel {
  orderMap;

  async generateOrderHistoryModel(productModel) {
    const items = await InputView.readItems(productModel);

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

import { MissionUtils } from '@woowacourse/mission-utils';
import { OUTPUT_MESSAGE } from '../lib/constants.js';

class OutputView {
  static printBlank() {
    this.#print('');
  }

  static printHello() {
    this.#print(OUTPUT_MESSAGE.hello);
  }

  static printProducts(products) {
    for (const { name, price, quantity, promotion } of products) {
      const quantityOutput = this.#getQuantityOutput(quantity);

      const productOutput = `- ${name} ${price.toLocaleString()}원 ${quantityOutput} ${this.#getPromotionOutput(promotion)}`;

      this.#print(productOutput);
    }
  }

  static #getQuantityOutput(quantity) {
    if (quantity > 0) return `${quantity}개`;

    return OUTPUT_MESSAGE.noProduct;
  }

  static #getPromotionOutput(promotion) {
    if (promotion === 'null') return '';

    return promotion;
  }

  static printReceipt(receipt) {
    this.#printTotalProducts(receipt);
    this.#printPromotionProducts(receipt);
    this.#printTotal(receipt);
  }

  static #printTotalProducts(receipt) {
    this.#print('===========W 편의점===========');
    this.#print('상품명   수량   금액');
    for (const item of receipt) {
      this.#print(`${item.name}   ${item.quantity}   ${item.price.toLocaleString()}`);
    }
  }

  static #printPromotionProducts(receipt) {
    this.#print('===========증	 정===========');
    for (const item of receipt) {
      if (item.promotionQuantity > 0) this.#print(`${item.name}   ${item.promotionQuantity}`);
    }
  }

  static #printTotal(receipt) {
    const { totalQuantity, totalPrice, promotionPrice, membershipDiscount, realPrice } = this.#calculateTotal(receipt);

    this.#print('==============================');
    this.#print(`총구매액 ${totalQuantity} ${totalPrice.toLocaleString()}`);
    this.#print(`행사할인 ${OUTPUT_MESSAGE.negative}${promotionPrice.toLocaleString()}`);
    this.#print(`멤버십할인 ${OUTPUT_MESSAGE.negative}${membershipDiscount.toLocaleString()}`);
    this.#print(`내실돈 ${realPrice.toLocaleString()}`);
  }

  static #calculateTotal(receipt) {
    return {
      totalQuantity: receipt.getTotalQuantity(),
      totalPrice: receipt.getTotalPrice(),
      promotionPrice: receipt.getPromotionDiscount(),
      membershipDiscount: receipt.getMembershipDiscount(),
      realPrice: receipt.getTotalPrice() - receipt.getPromotionDiscount() - receipt.getMembershipDiscount(),
    };
  }

  static #print(message) {
    return MissionUtils.Console.print(message);
  }
}

export default OutputView;

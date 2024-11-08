import { MissionUtils } from '@woowacourse/mission-utils';
import { OUTPUT_MESSAGE } from '../lib/constants.js';

class OutputView {
  static printHello() {
    MissionUtils.Console.print(OUTPUT_MESSAGE.hello);
  }

  static printProducts(products) {
    products.forEach(({ name, price, quantity, promotion }) => {
      const quantityOutput = this.#getQuantityOutput(quantity);

      const productOutput = `- ${name} ${price.toLocaleString()}원 ${quantityOutput} ${this.removePromotionIfNull(
        promotion,
      )}`;

      MissionUtils.Console.print(productOutput);
    });
  }

  static removePromotionIfNull(promotion) {
    if (promotion === 'null') return '';
    return promotion;
  }

  static #getQuantityOutput(quantity) {
    if (quantity > 0) return `${quantity}개`;
    return OUTPUT_MESSAGE.noQuantity;
  }

  static printReceipt(receipt) {
    this.#printTotalProducts(receipt);
    this.#printPromotionProducts(receipt);
    this.#printTotalCalculate(receipt);
  }

  static #printTotalProducts(receipt) {
    MissionUtils.Console.print('===========W 편의점===========');
    MissionUtils.Console.print('상품명   수량   금액');
    receipt.receipt.forEach((item) => {
      MissionUtils.Console.print(
        `${item.name}   ${item.quantity}   ${item.price.toLocaleString()}`,
      );
    });
  }

  static #printPromotionProducts(receipt) {
    MissionUtils.Console.print('===========증	 정===========');
    receipt.receipt.forEach((item) => {
      if (item.promotionQuantity > 0)
        MissionUtils.Console.print(`${item.name}   ${item.promotionQuantity}`);
    });
  }

  static #printTotalCalculate(receipt) {
    const { totalQuantity, totalPrice, promotionPrice, membershipDiscount, realPrice } =
      this.#calculate(receipt);

    MissionUtils.Console.print('==============================');
    MissionUtils.Console.print(`총구매액 ${totalQuantity} ${totalPrice.toLocaleString()}`);
    MissionUtils.Console.print(`행사할인 -${promotionPrice.toLocaleString()}`);
    MissionUtils.Console.print(`멤버십할인 -${membershipDiscount.toLocaleString()}`);
    MissionUtils.Console.print(`내실돈 ${realPrice.toLocaleString()}`);
  }

  static #calculate(receipt) {
    const totalQuantity = receipt.getTotalQuantity();
    const totalPrice = receipt.getTotalPrice();
    const promotionPrice = receipt.getTotalPromotionPrice();
    const membershipDiscount = receipt.getMembershipDiscount(receipt.isMembershipDiscount);
    const realPrice = totalPrice - promotionPrice - membershipDiscount;
    return {
      totalQuantity,
      totalPrice,
      promotionPrice,
      membershipDiscount,
      realPrice,
    };
  }
}

export default OutputView;

import { MissionUtils } from '@woowacourse/mission-utils';

class OutputController {
  static printHello() {
    MissionUtils.Console.print('안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n');
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
    return '재고 없음';
  }

  static printReceipt(receipt, isMembershipDiscount) {
    const totalQuantity = receipt.getTotalQuantity();
    const totalPrice = receipt.getTotalPrice();
    const promotionPrice = receipt.getTotalPromotionPrice();
    const membershipDiscount = receipt.getMembershipDiscount(isMembershipDiscount);
    const realPrice = totalPrice - promotionPrice - membershipDiscount;

    MissionUtils.Console.print('===========W 편의점===========');
    MissionUtils.Console.print('상품명   수량   금액');
    receipt.receipt.forEach((item) => {
      MissionUtils.Console.print(
        `${item.name}   ${item.quantity}   ${item.price.toLocaleString()}`,
      );
    });
    MissionUtils.Console.print('===========증	 정===========');
    receipt.receipt.forEach((item) => {
      if (item.promotionQuantity > 0)
        MissionUtils.Console.print(`${item.name}   ${item.promotionQuantity}`);
    });
    MissionUtils.Console.print('==============================');
    MissionUtils.Console.print(`총구매액 ${totalQuantity} ${totalPrice.toLocaleString()}`);
    MissionUtils.Console.print(`행사할인 -${promotionPrice.toLocaleString()}`);
    MissionUtils.Console.print(`멤버십할인 -${membershipDiscount.toLocaleString()}`);
    MissionUtils.Console.print(`내실돈 ${realPrice.toLocaleString()}`);
  }
}

export default OutputController;

import { MissionUtils } from '@woowacourse/mission-utils';

class OutputController {
  static printHello() {
    MissionUtils.Console.print(
      '안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n',
    );
  }

  static printProducts(products) {
    products.forEach(({ name, price, quantity, promotion }) => {
      const quantityOutput = this.#getQuantityOutput(quantity);

      const productOutput = `- ${name} ${price.toLocaleString()}원 ${quantityOutput} ${promotion}`;

      MissionUtils.Console.print(productOutput);
    });
  }

  static #getQuantityOutput(quantity) {
    if (quantity > 0) return `${quantity}개`;
    return '재고 없음';
  }

  static printReceipt(receipt, isMembershipDiscount) {
    MissionUtils.Console.print('===========W 편의점=============');
    MissionUtils.Console.print('상품명   수량   금액');

    receipt.forEach((product) => {
      MissionUtils.Console.print(
        `${product.name}   ${
          product.quantity
        }   ${product.price.toLocaleString()}`,
      );
    });

    MissionUtils.Console.print('===========증	정=============');
    receipt.forEach((product) => {
      if (product.promotionQuantity > 0)
        MissionUtils.Console.print(
          `${product.name}   ${product.promotionQuantity}`,
        );
    });

    MissionUtils.Console.print('==============================');
    const totalQuantity = receipt.reduce((prev, cur) => prev + cur.quantity, 0);
    const totalPrice = receipt.reduce(
      (prev, cur) => prev + cur.price * cur.quantity,
      0,
    );
    MissionUtils.Console.print(
      `총구매액  ${totalQuantity} ${totalPrice.toLocaleString()}`,
    );

    const promotionPrice = receipt.reduce((prev, cur) => {
      if (cur.promotionQuantity > 0)
        return cur.promotionQuantity * cur.price + prev;
      return prev;
    }, 0);
    MissionUtils.Console.print(`행사할인 -${promotionPrice.toLocaleString()}`);

    let membershipDiscount;

    if (isMembershipDiscount === 'N') membershipDiscount = 0;
    else
      membershipDiscount = receipt.reduce(
        (prev, cur) => prev + cur.promotionAdjustQuantity * cur.price,
        0,
      );

    MissionUtils.Console.print(
      `멤버십할인 -${membershipDiscount.toLocaleString()}`,
    );

    const realPrice = totalPrice - promotionPrice - membershipDiscount;
    MissionUtils.Console.print(`내실돈 ${realPrice.toLocaleString()}`);
  }
}

export default OutputController;

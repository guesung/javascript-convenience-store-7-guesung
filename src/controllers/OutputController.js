import { MissionUtils } from '@woowacourse/mission-utils';

class OutputController {
  static printHello() {
    MissionUtils.Console.print(
      '안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n',
    );
  }

  static printProducts(products) {
    if (!products) {
      MissionUtils.Console.print('재고 없음');
      return;
    }
    products.forEach(({ name, price, quantity, promotion }) => {
      const productOutput = `- ${name} ${price.toLocaleString(
        'ko',
      )}원 ${quantity}개 ${promotion}`;

      MissionUtils.Console.print(productOutput);
    });
  }
}

export default OutputController;

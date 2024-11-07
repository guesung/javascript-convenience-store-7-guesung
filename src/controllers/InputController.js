import { MissionUtils } from '@woowacourse/mission-utils';

class InputController {
  static async readItems() {
    const rawItems = await MissionUtils.Console.readLineAsync(
      '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
    );
    const items = this.#parseItems(rawItems);

    return items;
  }

  static #parseItems(rawItems) {
    const items = rawItems
      .split(',')
      .map((item) => item.slice(1, -1))
      .map((item) => item.split('-'))
      .map(([item, quantity]) => [item, Number(quantity)]);

    return items;
  }

  static async askOneMoreFree(item) {
    const answer = await MissionUtils.Console.readLineAsync(
      `현재 ${item}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
    );

    return answer;
  }

  static async askMoreForPromotion(item, quantity) {
    const answer = await MissionUtils.Console.readLineAsync(
      `현재 ${item} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
    );

    return answer;
  }

  static async getIsMembershipDiscount() {
    const answer = await MissionUtils.Console.readLineAsync(
      '멤버십 할인을 받으시겠습니까? (Y/N)',
    );

    return answer;
  }
}

export default InputController;

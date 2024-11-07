import { MissionUtils } from '@woowacourse/mission-utils';
import { ERROR_MESSAGE, INPUT_MEESAGE } from '../lib/constants.js';
import { retryWhileCatchedError } from '../lib/utils.js';

class InputController {
  static async readItems(product) {
    return retryWhileCatchedError(async () => {
      const rawItems = await MissionUtils.Console.readLineAsync(
        INPUT_MEESAGE.readItem,
      );
      this.#validateItemsFormat(rawItems);
      const items = this.#parseItems(rawItems);
      this.#validateItemsQuantity(product, items);

      return items;
    });
  }

  static #validateItemsQuantity(product, items) {
    items.forEach(([name, quantity]) => {
      if (product.getProductQuantity(name) === 0)
        throw new Error(ERROR_MESSAGE.noItem);
      if (product.quantity === 0) throw new Error(ERROR_MESSAGE.zeroQuantity);
      if (product.getProductQuantity(name) < quantity)
        throw new Error(ERROR_MESSAGE.overQuantity);
    });
  }

  static #validateItemsFormat(rawItems) {
    const items = rawItems.split(',');
    items.forEach((item) => {
      if (!/^\[[가-힣a-zA-Z]+-\d+\]$/.test(item))
        throw new Error(ERROR_MESSAGE.notFormat);
    });
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

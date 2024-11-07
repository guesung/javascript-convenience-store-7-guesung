import { MissionUtils } from '@woowacourse/mission-utils';
import { ERROR_MESSAGE, INPUT_MEESAGE } from '../lib/constants.js';

class InputController {
  static async readItems(store) {
    return this.#retryWhileCatchedError(async () => {
      const rawItems = await MissionUtils.Console.readLineAsync(
        INPUT_MEESAGE.readItem,
      );
      this.#validateItemsFormat(rawItems);
      const items = this.#parseItems(rawItems);
      store.validateItemsQuantity(items);

      return items;
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

  static async readIsGetFreePromotion(item) {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(
        `현재 ${item}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`,
      );

      this.#validateYesOrNo(answer);
      return answer === 'Y';
    });
  }

  static async readIsBuyWithoutPromotion(item, quantity) {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(
        `현재 ${item} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`,
      );

      this.#validateYesOrNo(answer);

      return answer === 'Y';
    });
  }

  static async readtIsMembershipDiscount() {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(
        '멤버십 할인을 받으시겠습니까? (Y/N)\n',
      );

      this.#validateYesOrNo(answer);

      return answer === 'Y';
    });
  }

  static async retryWhileOrderFinish(callbackFunction) {
    await callbackFunction();

    const isMoreOrder = await this.#readIsMoreOrder();

    if (isMoreOrder) await this.retryWhileOrderFinish(callbackFunction);
  }

  static async #readIsMoreOrder() {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(
        '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n',
      );

      this.#validateYesOrNo(answer);

      return answer === 'Y';
    });
  }

  static async #retryWhileCatchedError(callbackFunction) {
    try {
      return await callbackFunction();
    } catch (error) {
      MissionUtils.Console.print(error.message);

      const retried = await this.#retryWhileCatchedError(callbackFunction);
      return retried;
    }
  }

  static #validateYesOrNo(answer) {
    const ANSWERLIST = ['Y', 'N'];
    if (!ANSWERLIST.includes(answer)) throw new Error(ERROR_MESSAGE.notYesOrNo);
  }
}

export default InputController;

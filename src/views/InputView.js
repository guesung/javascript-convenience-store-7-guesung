import { MissionUtils } from '@woowacourse/mission-utils';
import { INPUT_MEESAGE, YES } from '../lib/constants.js';
import { InputValidator, InputParser } from '../helpers/index.js';
import { checkYesOrNo } from '../lib/utils.js';

class InputView {
  static async readItems(store) {
    return this.#retryWhileCatchedError(async () => {
      const rawItems = await MissionUtils.Console.readLineAsync(INPUT_MEESAGE.readItem);
      InputValidator.validateItemsFormat(rawItems);
      const items = InputParser.parseItems(rawItems);
      InputValidator.validateItemsQuantity(store, items);

      return items;
    });
  }

  static async readFreeProduct(item) {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(`현재 ${item}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async readBuyWithoutPromotion(item, quantity) {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(`현재 ${item} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async readtIsMembershipDiscount() {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(INPUT_MEESAGE.membershipDiscount);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async retryWhileOrderFinish(callbackFunction) {
    await callbackFunction();

    const isMoreOrder = await this.#readIsMoreOrder();

    if (isMoreOrder) await this.retryWhileOrderFinish(callbackFunction);
  }

  static async #readIsMoreOrder() {
    return this.#retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(INPUT_MEESAGE.tryMoreOrder);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async #retryWhileCatchedError(callbackFunction, tryCount = 0) {
    try {
      return await callbackFunction();
    } catch (error) {
      if (tryCount > 10) return null;

      MissionUtils.Console.print(error.message);

      return await this.#retryWhileCatchedError(callbackFunction, tryCount + 1);
    }
  }
}

export default InputView;

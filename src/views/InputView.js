import { MissionUtils } from '@woowacourse/mission-utils';
import { INPUT_MEESAGE, YES } from '../lib/constants.js';
import { InputValidator, InputParser } from '../helpers/index.js';
import { checkYesOrNo, retryWhileCatchedError } from '../lib/utils.js';

class InputView {
  static async readItems(productModel) {
    return retryWhileCatchedError(async () => {
      const rawItems = await MissionUtils.Console.readLineAsync(INPUT_MEESAGE.readItem);
      InputValidator.validateItemsFormat(rawItems);
      const items = InputParser.parseItems(rawItems);
      InputValidator.validateItemsQuantity(productModel, items);

      return items;
    });
  }

  static async readFreeProduct(item) {
    return retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(`현재 ${item}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async readBuyWithoutPromotion(item, quantity) {
    return retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(`현재 ${item} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async readtIsMembershipDiscount() {
    return retryWhileCatchedError(async () => {
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
    return retryWhileCatchedError(async () => {
      const answer = await MissionUtils.Console.readLineAsync(INPUT_MEESAGE.tryMoreOrder);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }
}

export default InputView;

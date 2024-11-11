import { MissionUtils } from '@woowacourse/mission-utils';
import { InputParser, InputValidator } from '../helpers/index.js';
import { INPUT_MEESAGE, NO, YES } from '../lib/constants.js';
import { checkYesOrNo, retryUntilSuccess } from '../lib/utils.js';

class InputView {
  static async readItems(productModel) {
    return retryUntilSuccess(async () => {
      const rawItems = await this.#readLineAsync(INPUT_MEESAGE.readItem);
      InputValidator.validateItemsFormat(rawItems);
      const items = InputParser.parseItems(rawItems);
      InputValidator.validateItemsQuantity(productModel, items);
      InputValidator.validateItemsUnique(items);

      return items;
    });
  }

  static async readIsFreeProduct(item) {
    return retryUntilSuccess(async () => {
      const answer = await this.#readLineAsync(`현재 ${item}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (${YES}/${NO})\n`);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async readIsBuyWithoutPromotion(item, quantity) {
    return retryUntilSuccess(async () => {
      const answer = await this.#readLineAsync(`현재 ${item} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (${YES}/${NO})\n`);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async readIsMembershipDiscount() {
    return retryUntilSuccess(async () => {
      const answer = await this.#readLineAsync(INPUT_MEESAGE.membershipDiscount);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static async retryWhileOrderFinish(orderFunction) {
    await orderFunction();

    const isMoreOrder = await this.#readIsMoreOrder();

    if (isMoreOrder) await this.retryWhileOrderFinish(orderFunction);
  }

  static async #readIsMoreOrder() {
    return retryUntilSuccess(async () => {
      const answer = await this.#readLineAsync(INPUT_MEESAGE.tryMoreOrder);

      InputValidator.validateYesOrNo(answer);

      return checkYesOrNo(answer);
    });
  }

  static #readLineAsync(message) {
    return MissionUtils.Console.readLineAsync(message);
  }
}

export default InputView;

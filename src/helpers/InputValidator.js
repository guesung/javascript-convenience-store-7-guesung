import { ERROR_MESSAGE, ITEMS_REGEXR, SEPARATOR } from '../lib/constants.js';
import { checkUnique } from '../lib/utils.js';

class OutputValidator {
  static validateItemsFormat(rawItems) {
    const items = rawItems.split(SEPARATOR);

    items.forEach((item) => {
      if (!ITEMS_REGEXR.test(item)) throw new Error(ERROR_MESSAGE.notItemsFormat);
    });
  }

  static validateItemsQuantity(productModel, items) {
    items.forEach(([name, quantity]) => {
      const totalQuantity = productModel.getItemQuantity(name);
      if (quantity === 0) throw new Error(ERROR_MESSAGE.inputItemsZero);
      if (totalQuantity === 0) throw new Error(ERROR_MESSAGE.itemsZero);
      if (totalQuantity < quantity) throw new Error(ERROR_MESSAGE.itemsOverQuantity);
    });
  }

  static validateItemsUnique(items) {
    const itemNames = items.map(([name]) => name);
    const isItemsUnique = checkUnique(itemNames);

    if (!isItemsUnique) throw new Error(ERROR_MESSAGE.itemsNotUnique);
  }

  static validateYesOrNo(answer) {
    const ANSWERLIST = ['Y', 'N'];

    if (!ANSWERLIST.includes(answer)) throw new Error(ERROR_MESSAGE.notYesOrNo);
  }
}

export default OutputValidator;

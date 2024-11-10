import { ERROR_MESSAGE, ITEMS_REGEXR, SEPARATOR } from '../lib/constants.js';

class InputValidator {
  static validateItemsFormat(rawItems) {
    const items = rawItems.split(SEPARATOR);
    items.forEach((item) => {
      if (!ITEMS_REGEXR.test(item)) throw new Error(ERROR_MESSAGE.notItemsFormat);
    });
  }

  static validateItemsQuantity(productModel, items) {
    items.forEach(([name, quantity]) => {
      const productQuantity = productModel.getQuantity(name);
      if (quantity === 0) throw new Error(ERROR_MESSAGE.inputItemsZero);
      if (productQuantity === 0) throw new Error(ERROR_MESSAGE.itemsZero);
      if (productQuantity < quantity) throw new Error(ERROR_MESSAGE.itemsOverQuantity);
    });
  }

  static validateItemsUnique(items) {
    const itemNames = items.map(([name]) => name);
    const isItemsUnique = itemNames.length === new Set(itemNames).size;

    if (!isItemsUnique) throw new Error(ERROR_MESSAGE.notUnique);
  }

  static validateYesOrNo(answer) {
    const ANSWERLIST = ['Y', 'N'];

    if (!ANSWERLIST.includes(answer)) throw new Error(ERROR_MESSAGE.notYesOrNo);
  }
}

export default InputValidator;

import { ERROR_MESSAGE, ITEMS_REGEXR, SEPARATOR } from '../lib/constants.js';

class InputValidator {
  static validateItemsFormat(rawItems) {
    const items = rawItems.split(SEPARATOR);
    items.forEach((item) => {
      if (!ITEMS_REGEXR.test(item)) throw new Error(ERROR_MESSAGE.notFormat);
    });
  }

  static validateItemsQuantity(store, items) {
    items.forEach(([name, quantity]) => {
      const productQuantity = store.getProductQuantity(name);
      if (productQuantity === 0) throw new Error(ERROR_MESSAGE.itemsZero);
      if (productQuantity < quantity) throw new Error(ERROR_MESSAGE.itemsOverQuantity);
    });
  }

  static validateYesOrNo(answer) {
    const ANSWERLIST = ['Y', 'N'];

    if (!ANSWERLIST.includes(answer)) throw new Error(ERROR_MESSAGE.notYesOrNo);
  }
}

export default InputValidator;

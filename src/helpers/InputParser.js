import { QUANTITY_SEPARATOR, SEPARATOR } from '../lib/constants.js';

class InputParser {
  static parseItems(rawItems) {
    return rawItems
      .split(SEPARATOR)
      .map((item) => item.slice(1, -1))
      .map((item) => item.split(QUANTITY_SEPARATOR))
      .map(([item, quantity]) => [item, Number(quantity)]);
  }
}

export default InputParser;

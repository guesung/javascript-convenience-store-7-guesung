import { SEPARATOR } from '../lib/constants.js';

class InputParser {
  static parseItems(rawItems) {
    const items = rawItems
      .split(SEPARATOR)
      .map((item) => item.slice(1, -1))
      .map((item) => item.split('-'))
      .map(([item, quantity]) => [item, Number(quantity)]);

    return items;
  }
}

export default InputParser;
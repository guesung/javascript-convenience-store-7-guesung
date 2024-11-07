import { DateTimes } from '@woowacourse/mission-utils';
import * as fs from 'fs';
import { getIsDateBetween } from '../lib/utils.js';

class FileController {
  static #LINE_BREAK = '\n';
  static #SEPARATOR = ',';

  static getProducts() {
    const rawProducts = fs.readFileSync('public/products.md', 'utf8');
    const products = this.#parseProducts(rawProducts);
    const sortedByPromotionProducts = this.#sortByPromotionProducts(products);

    return sortedByPromotionProducts;
  }

  static getPromotions() {
    const rawPromotions = fs.readFileSync('public/promotions.md', 'utf8');
    const promotions = this.#parseProductEventList(rawPromotions);
    const todayPromotions = this.#filterTodayPromotions(promotions);

    return todayPromotions;
  }

  static #parseProducts(rawProducts) {
    const tempProducts = rawProducts.trim().split(this.#LINE_BREAK);
    tempProducts.shift();
    return tempProducts.map((productInformation) => {
      const [name, price, quantity, promotion] = productInformation.split(this.#SEPARATOR);
      return {
        name,
        price: Number(price),
        quantity: Number(quantity),
        promotion,
      };
    });
  }

  static #sortByPromotionProducts(products) {
    const tempProducts = [...products];
    tempProducts.sort((a, b) => {
      if (a?.promotion !== undefined) return -1;
      return 1;
    });
    return tempProducts;
  }

  static #parseProductEventList(rawPromotions) {
    const tempProductEvents = rawPromotions.trim().split('\n');
    tempProductEvents.shift();

    return tempProductEvents.map((tempProductEvent) => {
      const [name, buy, get, startDate, endDate] = tempProductEvent.split(this.#SEPARATOR);
      return {
        name,
        buy: Number(buy),
        get: Number(get),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      };
    });
  }

  static #filterTodayPromotions(promotions) {
    return promotions.filter((promotion) =>
      getIsDateBetween(DateTimes.now(), promotion.startDate, promotion.endDate),
    );
  }
}

export default FileController;

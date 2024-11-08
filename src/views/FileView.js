import { DateTimes } from '@woowacourse/mission-utils';
import * as fs from 'fs';
import { getIsDateBetween } from '../lib/utils.js';
import { LINE_BREAK, SEPARATOR } from '../lib/constants.js';

class FileView {
  static getProducts() {
    const rawProducts = fs.readFileSync('public/products.md', 'utf8');
    const products = this.#parseProducts(rawProducts);
    this.#sortByPromotionProducts(products);

    return products;
  }

  static getPromotions() {
    const rawPromotions = fs.readFileSync('public/promotions.md', 'utf8');
    const promotions = this.#parsePromotions(rawPromotions);
    const todayPromotions = this.#filterTodayPromotions(promotions);

    return todayPromotions;
  }

  static #parseProducts(rawProducts) {
    const products = rawProducts.trim().split(LINE_BREAK);
    products.shift();

    return this.#productsMapping(products);
  }

  static #productsMapping(products) {
    return products.map((productInformation) => {
      const [name, price, quantity, promotion] = productInformation.split(SEPARATOR);
      return {
        name,
        price: Number(price),
        quantity: Number(quantity),
        promotion,
      };
    });
  }

  static #sortByPromotionProducts(products) {
    products.sort((a) => {
      if (a?.promotion !== 'null') return -1;
      return 1;
    });
  }

  static #parsePromotions(rawPromotions) {
    const promotions = rawPromotions.trim().split(LINE_BREAK);
    promotions.shift();

    return this.#promotionMapping(promotions);
  }

  static #promotionMapping(promotions) {
    return promotions.map((promotion) => {
      const [name, buy, get, startDate, endDate] = promotion.split(SEPARATOR);
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

export default FileView;

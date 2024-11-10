import { DateTimes } from '@woowacourse/mission-utils';
import { LINE_BREAK, SEPARATOR } from '../lib/constants.js';
import { getIsDateBetween } from '../lib/utils.js';

class InputParser {
  static parseProducts(rawProducts) {
    const products = rawProducts.trim().split(LINE_BREAK);
    products.shift();

    const newProducts = this.#productsMapping(products);
    this.#f(newProducts);
    this.#sortByPromotionProducts(newProducts);

    return newProducts;
  }

  static #f(products) {
    return products.forEach((product) => {
      if (product.promotion !== 'null') {
        const isNoNoPromotion = !!products.find((product) => product.promotion);
        if (isNoNoPromotion) {
          products.push({
            name: product.name,
            price: product.price,
            quantity: 0,
            promotion: 'null',
          });
        }
      }
    });
  }

  static #productsMapping(products) {
    return products.map((product) => {
      const [name, price, quantity, promotion] = product.split(SEPARATOR);
      return {
        name,
        price: Number(price),
        quantity: Number(quantity),
        promotion,
      };
    });
  }

  static #sortByPromotionProducts(products) {
    return products.sort((a) => {
      if (a.promotion === 'null') return 1;
      return -1;
    });
  }

  static parsePromotions(rawPromotions) {
    const promotions = rawPromotions.trim().split(LINE_BREAK);
    promotions.shift();

    return this.#filterTodayPromotions(this.#promotionMapping(promotions));
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
    return promotions.filter((promotion) => getIsDateBetween(DateTimes.now(), promotion.startDate, promotion.endDate));
  }
}

export default InputParser;

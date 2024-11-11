import { DateTimes } from '@woowacourse/mission-utils';
import { LINE_BREAK, SEPARATOR } from '../lib/constants.js';
import { getIsDateBetween } from '../lib/utils.js';

class InputParser {
  static parseProducts(rawProducts) {
    const products = rawProducts.trim().split(LINE_BREAK);
    products.shift();

    const mappedProducts = this.#productsMapping(products);
    const sortedProducts = this.#sortByPromotionProducts(mappedProducts);
    return this.#addProductIfDontHasNoPromotionProduct(sortedProducts);
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

  /** 프로모션이 없는 제품이 없다면, 0개인 제품을 추가한다. */
  static #addProductIfDontHasNoPromotionProduct(products) {
    return products.reduce(
      (acc, product) => {
        const hasPromotion = product.promotion !== 'null';
        const hasNoPromotionProduct = products.some((targetProduct) => targetProduct.name === product.name && targetProduct.promotion === 'null');

        if (hasPromotion && !hasNoPromotionProduct)
          return [
            ...acc,
            {
              ...product,
              quantity: 0,
              promotion: 'null',
            },
          ];
        return acc;
      },
      [...products],
    );
  }

  static #sortByPromotionProducts(products) {
    return [...products].sort((a, b) => {
      if (a.promotion === 'null' && b.promotion !== 'null') return 1;
      if (a.promotion !== 'null' && b.promotion === 'null') return -1;
      return 0;
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

import { DateTimes } from '@woowacourse/mission-utils';
import { LINE_BREAK, SEPARATOR } from '../lib/constants.js';
import { getIsDateBetween } from '../lib/utils.js';

class InputParser {
  static parseProducts(rawProducts) {
    const products = rawProducts.trim().split(LINE_BREAK).slice(1);

    const mappedAndSortedProducts = products.map(this.#mapProduct).sort(this.#sortByPromotion);
    return this.#createDefaultProduct(mappedAndSortedProducts);
  }

  static #mapProduct(product) {
    const [name, price, quantity, promotion] = product.split(SEPARATOR);
    return {
      name,
      price: Number(price),
      quantity: Number(quantity),
      promotion,
    };
  }

  static #createDefaultProduct(products) {
    const defaultProducts = products
      .filter((product) => {
        const hasPromotion = product.promotion !== 'null';
        const hasNoPromotionProduct = products.some((targetProduct) => targetProduct.name === product.name && targetProduct.promotion === 'null');
        return hasPromotion && !hasNoPromotionProduct;
      })
      .map((product) => ({
        ...product,
        quantity: 0,
        promotion: 'null',
      }));
    return products.concat(defaultProducts);
  }

  static #sortByPromotion() {
    return (a, b) => {
      if (a.promotion === 'null' && b.promotion !== 'null') return 1;
      if (a.promotion !== 'null' && b.promotion === 'null') return -1;
      return 0;
    };
  }

  static parsePromotions(rawPromotions) {
    const promotions = rawPromotions.trim().split(LINE_BREAK).slice(1);

    return promotions.map(this.#mapPromotion).filter(this.#filterTodayPromotion);
  }

  static #mapPromotion(promotion) {
    const [name, buy, get, startDate, endDate] = promotion.split(SEPARATOR);
    return {
      name,
      buy: Number(buy),
      get: Number(get),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
  }

  static #filterTodayPromotion(promotion) {
    return getIsDateBetween(DateTimes.now(), promotion.startDate, promotion.endDate);
  }
}

export default InputParser;

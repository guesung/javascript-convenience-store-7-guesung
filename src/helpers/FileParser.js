import { DateTimes } from '@woowacourse/mission-utils';
import { LINE_BREAK, SEPARATOR } from '../lib/constants.js';
import { checkDateBetween } from '../lib/utils.js';

class InputParser {
  static parseProducts(rawProducts) {
    const products = this.#preprocessFile(rawProducts);

    const mappedAndSortedProducts = products.map(this.#mapProduct).sort(this.#sortByPromotion);
    const defaultProducts = this.#createDefaultProduct(mappedAndSortedProducts);
    return [...mappedAndSortedProducts, ...defaultProducts];
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

  static #sortByPromotion() {
    return (a, b) => {
      if (a.promotion === 'null' && b.promotion !== 'null') return 1;
      if (a.promotion !== 'null' && b.promotion === 'null') return -1;
      return 0;
    };
  }

  static #createDefaultProduct(products) {
    return products
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
  }

  static parsePromotions(rawPromotions) {
    const promotions = this.#preprocessFile(rawPromotions);

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
    return checkDateBetween(DateTimes.now(), promotion.startDate, promotion.endDate);
  }

  static #preprocessFile(rawFile) {
    return rawFile.trim().split(LINE_BREAK).slice(1);
  }
}

export default InputParser;

import * as fs from 'fs';
import { FileParser } from '../helpers/index.js';
import { PRODUCT_FILE_PATH, PROMOTION_FILE_PATH } from '../lib/constants.js';

class FileView {
  static getProducts() {
    const rawProducts = this.#readFileSync(PRODUCT_FILE_PATH);

    return FileParser.parseProducts(rawProducts);
  }

  static getPromotions() {
    const rawPromotions = this.#readFileSync(PROMOTION_FILE_PATH);

    return FileParser.parsePromotions(rawPromotions);
  }

  static #readFileSync(path) {
    return fs.readFileSync(path, 'utf8');
  }
}

export default FileView;

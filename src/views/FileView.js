import * as fs from 'fs';
import { FileParser } from '../helpers/index.js';
import { FILE_PATH } from '../lib/constants.js';

class FileView {
  static getProducts() {
    const rawProducts = this.#readFileSync(FILE_PATH.product);

    return FileParser.parseProducts(rawProducts);
  }

  static getPromotions() {
    const rawPromotions = this.#readFileSync(FILE_PATH.promotion);

    return FileParser.parsePromotions(rawPromotions);
  }

  static #readFileSync(path) {
    return fs.readFileSync(path, 'utf8');
  }
}

export default FileView;

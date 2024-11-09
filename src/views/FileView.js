import * as fs from 'fs';
import { FileParser } from '../helpers/index.js';

class FileView {
  static getProducts() {
    const rawProducts = fs.readFileSync('public/products.md', 'utf8');

    return FileParser.parseProducts(rawProducts);
  }

  static getPromotions() {
    const rawPromotions = fs.readFileSync('public/promotions.md', 'utf8');

    return FileParser.parsePromotions(rawPromotions);
  }
}

export default FileView;

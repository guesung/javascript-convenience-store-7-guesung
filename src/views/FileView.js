import * as fs from 'fs';
import { FileParser } from '../helpers/index.js';

class FileView {
  static getProducts() {
    const rawProducts = fs.readFileSync('public/products.md', 'utf8');
    const products = FileParser.parseProducts(rawProducts);
    FileParser.sortByPromotionProducts(products);

    return products;
  }

  static getPromotions() {
    const rawPromotions = fs.readFileSync('public/promotions.md', 'utf8');
    const promotions = FileParser.parsePromotions(rawPromotions);
    const todayPromotions = FileParser.filterTodayPromotions(promotions);

    return todayPromotions;
  }
}

export default FileView;

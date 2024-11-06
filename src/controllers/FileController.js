import * as fs from 'fs';

class FileController {
  static getProducts() {
    return fs.readFileSync('public/products.md', 'utf8');
  }

  static getPromotions() {
    return fs.readFileSync('public/promotions.md', 'utf8');
  }
}

export default FileController;

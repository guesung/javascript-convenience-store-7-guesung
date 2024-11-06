import { expectLogContains, getLogSpy, getOutput } from '../lib/test/utils.js';
import { Store } from './index.js';
import OrderHistory from './OrderHistory.js';

describe('Store', () => {
  describe('prepareProducts', () => {
    test('상품을 준비한다.', () => {
      const store = new Store();
      store.prepareProducts();
      const logSpy = getLogSpy();

      store.prepareProducts();

      const output = getOutput(logSpy);
      const expected = [
        '- 콜라 1,000원 10개 탄산2+1',
        '- 콜라 1,000원 10개',
        '- 사이다 1,000원 8개 탄산2+1',
        '- 사이다 1,000원 7개',
        '- 오렌지주스 1,800원 9개 MD추천상품',
        '- 오렌지주스 1,800원 재고 없음',
        '- 탄산수 1,200원 5개 탄산2+1',
        '- 탄산수 1,200원 재고 없음',
        '- 물 500원 10개',
        '- 비타민워터 1,500원 6개',
        '- 감자칩 1,500원 5개 반짝할인',
        '- 감자칩 1,500원 5개',
        '- 초코바 1,200원 5개 MD추천상품',
        '- 초코바 1,200원 5개',
        '- 에너지바 2,000원 5개',
        '- 정식도시락 6,400원 8개',
        '- 컵라면 1,700원 1개 MD추천상품',
        '- 컵라면 1,700원 10개',
      ];
      expectLogContains(output, expected);
    });
  });
});

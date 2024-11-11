import { checkDateBetween } from './utils.js';

describe('utils', () => {
  describe('checkDateBetween', () => {
    test('날짜 사이에 있을 경우 true를 반환한다.', () => {
      expect(checkDateBetween(new Date('2024-06-01'), new Date('2024-05-01'), new Date('2024-07-01'))).toBeTruthy();
    });
    test('날짜 사이에 있지 않을 경우 false를 반환한다.', () => {
      expect(checkDateBetween(new Date('2024-06-01'), new Date('2024-04-01'), new Date('2024-05-01'))).toBeFalsy();
    });
  });
});

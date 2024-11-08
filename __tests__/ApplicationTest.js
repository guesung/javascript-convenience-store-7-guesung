import App from '../src/App.js';
import { ERROR_MESSAGE } from '../src/lib/constants.js';
import {
  expectLogContains,
  expectLogContainsWithoutSpacesAndEquals,
  getLogSpy,
  getOutput,
  mockNowDate,
  mockQuestions,
  runExceptions,
} from '../src/lib/test/utils.js';

const INPUTS_TO_TERMINATE = ['[비타민워터-1]', 'N', 'N'];

const run = async ({
  inputs = [],
  inputsToTerminate = [],
  expected = [],
  expectedIgnoringWhiteSpaces = [],
}) => {
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  const app = new App();
  await app.run();

  const output = getOutput(logSpy);

  if (expectedIgnoringWhiteSpaces.length > 0) {
    expectLogContainsWithoutSpacesAndEquals(output, expectedIgnoringWhiteSpaces);
  }
  if (expected.length > 0) {
    expectLogContains(output, expected);
  }
};

describe('편의점', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('정상적인 경우', () => {
    test('애플레케이션이 시작되면 인삿말을 출력한다,', async () => {
      await run({
        inputs: INPUTS_TO_TERMINATE,
        expected: ['안녕하세요. W편의점입니다.', '현재 보유하고 있는 상품입니다.'],
      });
    });

    test('파일에 있는 상품 목록을 출력한다.', async () => {
      await run({
        inputs: INPUTS_TO_TERMINATE,
        expected: [
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
        ],
      });
    });

    test('프로모션 해택 없이 구매할 것에 동의하지 않을 경우, 해당 제품을 제외한다.', async () => {
      await run({
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10]', 'Y', 'Y', 'N', 'Y', 'N'], // 상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매
        expectedIgnoringWhiteSpaces: [
          '총구매액2434,000', // 콜라 9 + 에너지바 5 + 감자칩 10  = 9000 + 10000 + 15000 = 34000
          '행사할인-6,000', // 콜라 3 + 감자칩 2 = 3000 + 3000 = 6000
          '멤버십할인-5,700', // ( 에너지바 5 + 감자칩 6 ) * 3 / 10 = ( 10000 + 9000 ) * 3 / 10 = 5700
          '내실돈22,300', // 34000 - 6000 - 5700
        ],
      });
    });

    test('프로모션 해택 없이 구매할 것에 동의할 경우, 해당 제품을 추가한다.', async () => {
      await run({
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10]', 'Y', 'Y', 'Y', 'Y', 'N'], // 상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매
        expectedIgnoringWhiteSpaces: [
          '총구매액3451,000', // 콜라 9 + 에너지바 5 + 감자칩 10 + 컵라면 10  = 9000 + 10000 + 15000 + 17000 = 51,000
          '행사할인-6,000', // 콜라 3 + 감자칩 2 = 3000 + 3000 = 6000
          '멤버십할인-10,800', // ( 에너지바 5 + 감자칩 6 + 컵라면 10 ) * 3 / 10 = ( 10000 + 9000 + 17000 ) * 3 / 10 = 10,800
          '내실돈34,200', // 51,000 - 6,000 - 10,800 = 34,200
        ],
      });
    });

    test('멤버십에 동의하지 않을 경우, 멤버십 할인을 제외한다.', async () => {
      await run({
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10]', 'Y', 'Y', 'Y', 'N', 'N'], // 상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매
        expectedIgnoringWhiteSpaces: [
          '총구매액3451,000', // 콜라 9 + 에너지바 5 + 감자칩 10 + 컵라면 10  = 9000 + 10000 + 15000 + 17000 = 51,000
          '행사할인-6,000', // 콜라 3 + 감자칩 2 = 3000 + 3000 = 6000
          '멤버십할인-0',
          '내실돈45,000', // 51,000 - 6,000 = 45,000
        ],
      });
    });

    test('현재 기간이 아닌 할인에 대해서는 적용하지 않는다. 또한, 프로모션 적용에 대해 묻지도 않는다.', async () => {
      await run({
        inputs: [
          '[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10],[닭가슴살-9]',
          'Y',
          'Y',
          'Y',
          'Y',
          'N',
        ], // 상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매
        expectedIgnoringWhiteSpaces: [
          '총구매액4378,000', // 콜라 9 + 에너지바 5 + 감자칩 10 + 컵라면 10 + 닭가슴살 9  = 9000 + 10000 + 15000 + 17000 + 27000 = 78,000
          '행사할인-6,000', // 콜라 3 + 감자칩 2 = 3000 + 3000 = 6000
          '멤버십할인-18,900', // ( 에너지바 5 + 감자칩 6 + 컵라면 10 + 닭가슴살 9 ) * 3 / 10 = ( 10000 + 9000 + 17000 + 27000 ) * 3 / 10 = 18,900
          '내실돈53,100', // 78,000 - 6,000 - 18,900 = 53,100
        ],
      });
    });

    test('기간에 해당하지 않는 프로모션은 적용하지 않는다.', async () => {
      mockNowDate('2024-02-01');
      await run({
        inputs: ['[감자칩-2]', 'N', 'N'],
        expectedIgnoringWhiteSpaces: ['내실돈3,000', '행사할인-0'],
      });
    });

    test('프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 묻고, 수락한다면 그대로 결제한다.', async () => {
      await run({
        inputs: ['[콜라-12]', 'N', 'N', 'N'], // [상품 개수, 정가 결제, 멤버십, 추가 구매]
        expectedIgnoringWhiteSpaces: [
          '행사할인-3,000',
          '멤버십할인-0',
          '총구매액99,000',
          '내실돈6,000',
        ],
      });
    });

    test('프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 묻고, 거절한다면 상품을 제거한다.', async () => {
      await run({
        inputs: ['[콜라-12]', 'N', 'N', 'N'],
        expectedIgnoringWhiteSpaces: [
          '행사할인-3,000',
          '멤버십할인-0',
          '총구매액99,000',
          '내실돈6,000',
        ],
      });
    });
  });

  describe('예외 케이스', () => {
    test('재고 수량을 초과하여 입력할 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[컵라면-12]', 'N', 'N'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsOverQuantity,
      });
    });

    test('형식에 올바르지 않게 작성할 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[컵라면-12-3]', 'N', 'N'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notFormat,
      });
      await runExceptions({
        inputs: ['[컵라면-12', 'N', 'N'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notFormat,
      });
    });

    test('없는 상품을 입력할 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[컵볶이-3]', 'N', 'N'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsZero,
      });
      await runExceptions({
        inputs: ['[에너지바-5]', 'N', 'Y', '[에너지바-1]', 'N'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsZero,
      });
    });
  });
});

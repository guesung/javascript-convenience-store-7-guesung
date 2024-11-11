import App from '../src/App.js';
import { ERROR_MESSAGE, NO, YES } from '../src/lib/constants.js';
import { expectLogContains, expectLogContainsWithoutSpacesAndEquals, getLogSpy, getOutput, mockNowDate, mockQuestions } from '../src/lib/test/utils.js';

const INPUTS_TO_TERMINATE = ['[비타민워터-1]', NO, NO, NO, NO];

const run = async ({ inputs = [], inputsToTerminate = [], expected = [], expectedIgnoringWhiteSpaces = [] }) => {
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

const runExceptions = async ({ inputs = [], inputsToTerminate = [], expectedErrorMessage = '' }) => {
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  const app = new App();
  await app.run();

  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(expectedErrorMessage));
};

describe('편의점', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('정상적인 경우', () => {
    test('주문을 시작하면 인삿말을 출력한다,', async () => {
      await run({
        inputs: INPUTS_TO_TERMINATE,
        expected: ['안녕하세요. W편의점입니다.', '현재 보유하고 있는 상품입니다.'],
      });
    });

    test('주문을 시작하면 파일에 있는 상품 목록을 출력한다.', async () => {
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

    test('과제 가이드에 있는 테스트 케이스', async () => {
      await run({
        inputs: ['[콜라-3],[에너지바-5]', YES, YES, '[콜라-10]', YES, NO, YES, '[오렌지주스-1]', YES, YES, NO],
        expectedIgnoringWhiteSpaces: [
          '콜라33,000',
          '에너지바510,000',
          '콜라1',
          '총구매액813,000',
          '행사할인-1,000',
          '내실돈9,000',
          '콜라1010,000',
          '콜라2',
          '총구매액1010,000',
          '행사할인-2,000',
          '멤버십할인-0',
          '내실돈8,000',
          '오렌지주스23,600',
          '오렌지주스1',
          '총구매액23,600',
          '행사할인-1,800',
          '멤버십할인-0',
          '내실돈1,800',
        ],
        expected: [
          '안녕하세요. W편의점입니다.',
          '현재 보유하고 있는 상품입니다.',
          '- 콜라 1,000원 재고 없음 탄산2+1',
          '- 콜라 1,000원 7개',
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
          '- 에너지바 2,000원 재고 없음',
          '- 정식도시락 6,400원 8개',
          '- 컵라면 1,700원 1개 MD추천상품',
          '- 컵라면 1,700원 10개',
        ],
      });
    });

    test('프로모션 해택 없이 구매할 것에 동의하지 않을 경우, 해당 제품을 제외한다.', async () => {
      await run({
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10]', YES, YES, NO, YES, NO], // 상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매
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
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10]', YES, YES, YES, YES, NO], // 상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매
        expectedIgnoringWhiteSpaces: [
          '총구매액3451,000', // 콜라 9 + 에너지바 5 + 감자칩 10 + 컵라면 10  = 9000 + 10000 + 15000 + 17000 = 51,000
          '행사할인-6,000', // 콜라 3 + 감자칩 2 = 3000 + 3000 = 6000
          '멤버십할인-8,000', // ( 에너지바 5 + 감자칩 6 + 컵라면 10 ) * 3 / 10 = ( 10000 + 9000 + 17000 ) * 3 / 10 = 10,800. 하지만 멤버십 할인은 최대 8,000원
          '내실돈37,000', // 51,000 - 6,000 - 8,000 = 37,000
        ],
      });
    });

    test('프로모션 가능한 제품이 없을 경우, 프로모션 없이 진행해야한다고 묻는다. 그리고 이에 수락을 할 경우 프로모션 없이 구매한다.', async () => {
      await run({
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10],[오렌지주스-9]', YES, YES, YES, YES, YES, NO], // 상품, 1개 공짜(콜라), 프로모션 없이(감자칩), 프로모션 없이(컵라면), 프로모션 없이(오렌지주스) 멤버십, 추가 구매
        expectedIgnoringWhiteSpaces: [
          '총구매액4367,200', // 콜라 9 + 에너지바 5 + 감자칩 10 + 컵라면 10 + 오렌지주스 9 = 9000 + 10000 + 15000 + 17000 + 16,200 = 67,200
          '행사할인-13,200', // 콜라 3 + 감자칩 2 + 오렌지주스 4 = 3000 + 3000 + 7200 = 13,200
          '멤버십할인-8,000', // ( 에너지바 5 + 감자칩 6 + 컵라면 10 + 오렌지주스 1 ) * 3 / 10 = ( 10000 + 9000 + 17000 + 1800 ) * 3 / 10 = 11,340. 하지만 멤버십 할인은 최대 8,000원
          '내실돈46,000', // 67,200 - 13,200 - 8,000 = 46,000
        ],
      });
    });

    test('멤버십에 동의하지 않을 경우, 멤버십 할인을 제외한다.', async () => {
      await run({
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10]', YES, YES, YES, NO, NO], // 상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매
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
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10],[닭가슴살-9]', YES, YES, YES, YES, NO], // [상품, 1개 공짜(콜라), 프로모션 없이(에너지바), 프로모션 없이(컵라면) 멤버십, 추가 구매]
        expectedIgnoringWhiteSpaces: [
          '총구매액4378,000', // 콜라 9 + 에너지바 5 + 감자칩 10 + 컵라면 10 + 닭가슴살 9  = 9000 + 10000 + 15000 + 17000 + 27000 = 78,000
          '행사할인-6,000', // 콜라 3 + 감자칩 2 = 3000 + 3000 = 6000
          '멤버십할인-8,000', // ( 에너지바 5 + 감자칩 6 + 컵라면 10 + 닭가슴살 9 ) * 3 / 10 = ( 10000 + 9000 + 17000 + 27000 ) * 3 / 10 = 18,900. 하지만 멤버십 할인은 최대 8,000원
          '내실돈64,000', // 78,000 - 6,000 - 8,000 = 64,000
        ],
      });
    });

    test('기간에 해당하지 않는 프로모션은 적용하지 않는다.', async () => {
      mockNowDate('2024-02-01');
      await run({
        inputs: ['[감자칩-2]', NO, NO],
        expectedIgnoringWhiteSpaces: ['내실돈3,000', '행사할인-0'],
      });
    });

    test('프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 묻고 수락한다면 그대로 결제한다.', async () => {
      await run({
        inputs: ['[콜라-12]', YES, NO, NO], // [상품 개수, 정가 결제, 멤버십, 추가 구매]
        expectedIgnoringWhiteSpaces: ['행사할인-3,000', '멤버십할인-0', '총구매액1212,000', '내실돈9,000'],
      });
    });

    test('프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 묻고 거절한다면 상품을 제거한다.', async () => {
      await run({
        inputs: ['[콜라-12]', NO, NO, NO], // [상품 개수, 정가 결제, 멤버십, 추가 구매]
        expectedIgnoringWhiteSpaces: ['행사할인-3,000', '멤버십할인-0', '총구매액99,000', '내실돈6,000'],
      });
    });

    test('상품 이름을 처음에는 잘못 입력하지만 이후 제대로 입력했을 때 정상 동작한다.', async () => {
      await run({
        inputs: ['콜라-12', '[콜라-12]', NO, NO, NO],
        expectedIgnoringWhiteSpaces: ['행사할인-3,000', '멤버십할인-0', '총구매액99,000', '내실돈6,000'],
      });
    });

    test('Y/N외의 값을 입력 후 제대로 입력했을 때 정상 동작한다.', async () => {
      await run({
        inputs: ['[콜라-12]', 'n', NO, '아니오', NO, 'no', 'yo', NO],
        expectedIgnoringWhiteSpaces: ['행사할인-3,000', '멤버십할인-0', '총구매액99,000', '내실돈6,000'],
      });
    });
  });

  describe('예외 케이스', () => {
    test('구매 수량이 재고 수량을 초과한 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[컵라면-20]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsOverQuantity,
      });
    });

    test('상품에 대한 형식을 올바르지 않게 작성할 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[콜라-8-3]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notItemsFormat,
      });
      await runExceptions({
        inputs: ['[콜라-8][사이다-2]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notItemsFormat,
      });
      await runExceptions({
        inputs: ['[콜라-8'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notItemsFormat,
      });
      await runExceptions({
        inputs: ['콜라-8'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notItemsFormat,
      });
      await runExceptions({
        inputs: ['[콜라8]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notItemsFormat,
      });
    });

    test('Y/N 질문에 대한 형식을 올바르지 않게 작성할 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[콜라-8]', 'y'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notYesOrNo,
      });
      await runExceptions({
        inputs: ['[콜라-8]', '예'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notYesOrNo,
      });
      await runExceptions({
        inputs: ['[콜라-8]', '[콜라-8]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notYesOrNo,
      });
      await runExceptions({
        inputs: ['[콜라-8]', '놉'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notYesOrNo,
      });
    });

    test('존재하지 않는 상품을 입력한 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[컵볶이-3]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsZero,
      });
      await runExceptions({
        inputs: ['[에너지바-5]', NO, YES, '[에너지바-1]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsZero,
      });
    });

    test('제품을 0개 입력한 제품이 있을 경우 예외 처리한다.', async () => {
      await runExceptions({
        inputs: ['[콜라-0]'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.inputItemsZero,
      });
    });
  });
});

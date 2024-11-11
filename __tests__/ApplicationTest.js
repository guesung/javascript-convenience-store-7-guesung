import App from '../src/App.js';
import { ERROR_MESSAGE, NO, YES } from '../src/lib/constants.js';
import { expectLogContains, expectLogContainsWithoutSpacesAndEquals, getLogSpy, getOutput, mockNowDate, mockQuestions } from '../src/lib/test/utils.js';

const INPUTS_TO_TERMINATE = ['[비타민워터-1]', NO, NO, NO, NO];

const run = async ({ inputs = [], inputsToTerminate = INPUTS_TO_TERMINATE, expected = [], expectedIgnoringWhiteSpaces = [] }) => {
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
    describe('주문 시작', () => {
      test('주문을 시작하면 인삿말을 출력한다,', async () => {
        await run({
          expected: ['안녕하세요. W편의점입니다.', '현재 보유하고 있는 상품입니다.'],
        });
      });

      test('주문을 시작하면 파일에 있는 상품 목록을 출력한다.', async () => {
        await run({
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
    });

    describe('재고 관리', () => {
      test('고객이 상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리한다. 이 때, 프로모션 제품이 먼저 차감된다.', async () => {
        await run({
          inputs: ['[콜라-1]', NO, YES],
          expected: ['- 콜라 1,000원 9개 탄산2+1'],
        });
      });
    });

    describe('프로모션 할인', () => {
      test('오늘 날짜가 프로모션 기간 내에 포함된 경우에만 할인을 적용한다.', async () => {
        mockNowDate('2020-02-14');
        await run({
          inputs: ['[콜라-2]'],
          expectedIgnoringWhiteSpaces: ['행사할인-0'],
        });
      });
      test('프로모션 제품을 무료로 받을 경우, 해당 제품을 1개 추가한다.', async () => {
        await run({
          inputs: ['[콜라-2]', YES],
          expectedIgnoringWhiteSpaces: ['행사할인-1,000', '콜라3'],
        });
      });
      test('프로모션 제품을 무료로 받지 않을 경우, 제품을 1개 추가하지 않는다.', async () => {
        await run({
          inputs: ['[콜라-2]', NO],
          expectedIgnoringWhiteSpaces: ['행사할인-0'],
        });
      });
      test('프로모션 제품 할인이 적용되지 않을 때, 동의할 경우 그대로 결제를 진행한다.', async () => {
        await run({
          inputs: ['[콜라-10]', YES],
          expectedIgnoringWhiteSpaces: ['콜라10'],
        });
      });
      test('프로모션 제품 할인이 적용되지 않을 때, 동의하지 않을 적용되지 않는 제품을 제거한다.', async () => {
        await run({
          inputs: ['[콜라-10]', NO],
          expectedIgnoringWhiteSpaces: ['콜라9'],
        });
      });
    });

    describe('멤버십 할인', () => {
      test('멤버십 할인을 적용할 경우, 프로모션 제품을 제외하고 계산한다.', async () => {
        await run({
          inputs: ['[콜라-3],[에너지바-5]', YES],
          expectedIgnoringWhiteSpaces: ['멤버십할인-3,000'],
        });
      });
      test('멤버십 할인을 적용하지 않을 경우, 멤버십 할인은 0원이다.', async () => {
        await run({
          inputs: ['[콜라-3],[에너지바-5]', NO],
          expectedIgnoringWhiteSpaces: ['멤버십할인-0'],
        });
      });
      test('멤버십 할인은 최대 8,000원까지만 적용된다.', async () => {
        await run({
          inputs: ['[정식도시락-8]', YES],
          expectedIgnoringWhiteSpaces: ['멤버십할인-8,000'],
        });
      });
    });

    describe('영수증 출력', () => {
      test('영수증에서는 구매 상품 내역, 증정 상품 내역, 총구매액, 행사할인, 멤버십할인, 내실돈을 출력한다.', async () => {
        await run({
          inputs: ['[콜라-3],[에너지바-1]', YES],
          expectedIgnoringWhiteSpaces: ['콜라33,000', '콜라1', '에너지바1', '총구매액45,000', '행사할인-1,000', '멤버십할인-600', '내실돈3,400'],
        });
      });
    });

    describe('잘못 입력한 후 다시 제대로 입력했을 때', () => {
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
  });

  describe('그 외 케이스', () => {
    test('복잡한 연산', async () => {
      await run({
        inputs: ['[콜라-8],[에너지바-5],[감자칩-10],[컵라면-10],[오렌지주스-9]', YES, YES, YES, YES, YES, NO],
        expectedIgnoringWhiteSpaces: ['총구매액4367,200', '행사할인-13,200', '멤버십할인-8,000', '내실돈46,000'],
      });
    });

    test('애플리케이션 처음부터 끝까지의 출력', async () => {
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
  });

  describe('예외 케이스', () => {
    test.each([[['[컵라면-20]'], ['[콜라-200]']]])('구매 수량이 재고 수량을 초과한 경우 예외를 처리한다.', async (inputs) => {
      await runExceptions({
        inputs,
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsOverQuantity,
      });
    });

    test.each([[['[콜라-8-3]'], ['[콜라-8][사이다-2]'], ['[콜라-8'], ['콜라-8'], ['[콜라8]']]])('상품에 대한 형식을 올바르지 않게 작성할 경우 예외를 처리한다.', async (inputs) => {
      await runExceptions({
        inputs,
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notItemsFormat,
      });
    });

    test.each([
      [
        ['[콜라-8]', 'y'],
        ['[콜라-8]', '예'],
        ['[콜라-8]', '[콜라-8]'],
        ['[콜라-8]', '놉'],
      ],
    ])('Y/N 질문에 대한 형식을 올바르지 않게 작성할 경우 예외를 처리한다.', async (inputs) => {
      await runExceptions({
        inputs,
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.notYesOrNo,
      });
    });

    test.each([[['[컵볶이-3]'], ['[에너지바-5]', NO, YES, '[에너지바-1]']]])('존재하지 않는 상품을 입력한 경우 예외를 처리한다.', async (inputs) => {
      await runExceptions({
        inputs,
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.itemsZero,
      });
    });

    test.each([[['[콜라-0]']]])('제품을 0개 입력한 제품이 있을 경우 예외 처리한다.', async (inputs) => {
      await runExceptions({
        inputs,
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.inputItemsZero,
      });
    });
  });
});

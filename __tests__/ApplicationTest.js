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
  // given
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  // when
  const app = new App();
  await app.run();

  const output = getOutput(logSpy);

  // then
  if (expectedIgnoringWhiteSpaces.length > 0) {
    expectLogContainsWithoutSpacesAndEquals(
      output,
      expectedIgnoringWhiteSpaces,
    );
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
    test('파일에 있는 상품 목록을 출력한다.', async () => {
      await run({
        inputs: ['[콜라-1]', 'N', 'N'],
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

    test('여러 개의 일반 상품 구매한다.', async () => {
      await run({
        inputs: ['[비타민워터-3],[물-2],[정식도시락-2]', 'N', 'N'],
        expectedIgnoringWhiteSpaces: ['내실돈18,300'],
      });
    });

    test('기간에 해당하지 않는 프로모션은 적용하지 않는다.', async () => {
      mockNowDate('2024-02-01');

      await run({
        inputs: ['[감자칩-2]', 'N', 'N'],
        expectedIgnoringWhiteSpaces: ['내실돈3,000'],
      });
    });
  });

  describe('예외 케이스', () => {
    test('재고 수량을 초과하여 입력할 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[컵라면-12]', 'N', 'N'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.overQuantity,
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
        expectedErrorMessage: ERROR_MESSAGE.noItem,
      });
    });

    test('0개의 상품을 입력할 경우 예외를 처리한다.', async () => {
      await runExceptions({
        inputs: ['[컵볶이-3]', 'N', 'N'],
        inputsToTerminate: INPUTS_TO_TERMINATE,
        expectedErrorMessage: ERROR_MESSAGE.zeroQuantity,
      });
    });
  });
});

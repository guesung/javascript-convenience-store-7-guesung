import { MissionUtils } from '@woowacourse/mission-utils';
import { SEPARATOR } from '../constants.js';
import App from '../../App.js';
import { INPUTS_TO_TERMINATE } from './constants.js';

export const mockQuestions = (inputs) => {
  const messages = [];

  MissionUtils.Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();

    if (input === undefined) {
      throw new Error('NO INPUT');
    }

    return Promise.resolve(input);
  });

  MissionUtils.Console.readLineAsync.messages = messages;
};

export const mockNowDate = (date = null) => {
  const mockDateTimes = jest.spyOn(MissionUtils.DateTimes, 'now');
  mockDateTimes.mockReturnValue(new Date(date));
  return mockDateTimes;
};

export const getLogSpy = () => {
  const logSpy = jest.spyOn(MissionUtils.Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

export const getOutput = (logSpy) => [...logSpy.mock.calls].join(SEPARATOR);

export const expectLogContains = (received, expects) => {
  expects.forEach((exp) => {
    expect(received).toContain(exp);
  });
};

export const expectLogContainsWithoutSpacesAndEquals = (received, expects) => {
  const processedReceived = received.replace(/[\s=]/g, '');
  expects.forEach((exp) => {
    expect(processedReceived).toContain(exp);
  });
};

export const run = async ({ inputs = [], inputsToTerminate = INPUTS_TO_TERMINATE, expected = [], expectedIgnoringWhiteSpaces = [] }) => {
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

export const runExceptions = async ({ inputs = [], inputsToTerminate = [], expectedErrorMessage = '' }) => {
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  const app = new App();
  await app.run();

  expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(expectedErrorMessage));
};

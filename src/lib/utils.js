import { MissionUtils } from '@woowacourse/mission-utils';
import { NO, YES } from './constants.js';

export const getIsDateBetween = (date, startDate, endDate) => date >= startDate && date <= endDate;

export const checkYesOrNo = (answer) => {
  if (answer === YES) return true;
  if (answer === NO) return false;

  return null;
};

export const retryWhileCatchedError = async (callbackFunction, tryCount = 0) => {
  try {
    return await callbackFunction();
  } catch (error) {
    if (tryCount > 10) return null;

    MissionUtils.Console.print(error.message);

    return await retryWhileCatchedError(callbackFunction, tryCount + 1);
  }
};

export const getIsUnique = (array) => array.length === new Set(array).size;

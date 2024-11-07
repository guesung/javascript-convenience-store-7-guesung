import { MissionUtils } from '@woowacourse/mission-utils';

export const getIsDateBetween = (date, startDate, endDAte) =>
  date >= startDate && startDate <= endDAte;

export const retryWhileCatchedError = async (callbackFunction) => {
  try {
    return await callbackFunction();
  } catch (error) {
    MissionUtils.Console.print(error.message);

    const retried = await retryWhileCatchedError(callbackFunction);
    return retried;
  }
};

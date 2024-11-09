import { NO, YES } from './constants.js';

export const getIsDateBetween = (date, startDate, endDate) => date >= startDate && date <= endDate;
export const checkYesOrNo = (answer) => {
  if (answer === YES) return true;
  if (answer === NO) return false;
};

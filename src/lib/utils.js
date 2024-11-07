import { MissionUtils } from '@woowacourse/mission-utils';

export const getIsDateBetween = (date, startDate, endDAte) =>
  date >= startDate && startDate <= endDAte;

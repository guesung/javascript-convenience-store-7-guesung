export const ERROR_MESSAGE_DEFAULT = '[ERROR]';
export const ERROR_MESSAGE = {
  overQuantity: `${ERROR_MESSAGE_DEFAULT} 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`,
  notFormat: `${ERROR_MESSAGE_DEFAULT} 형식에 맞지 않습니다. [사이다-2],[감자칩-1]와 같은 형식으로 작성해주세요.`,
  noItem: `${ERROR_MESSAGE_DEFAULT} 존재하지 않는 상품입니다.`,
  zeroQuantity: `${ERROR_MESSAGE_DEFAULT} 1개 이상의 상품을 입력해주세요.`,
  notYOrN: `${ERROR_MESSAGE_DEFAULT} Y 혹은 N을 입력해주세요.`,
};

export const INPUT_MEESAGE = {
  readItem:
    '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n',
};

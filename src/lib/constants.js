export const SEPARATOR = ',';
export const QUANTITY_SEPARATOR = '-';
export const ITEMS_REGEXR = /^\[[가-힣a-zA-Z]+-\d+\]$/;
export const LINE_BREAK = '\n';
export const YES = 'Y';
export const NO = 'N';
export const MEMBERSHIP_DISCOUNT_PERCENTAGE = 30 / 100;
export const MEMBERSHIP_DISCOUNT_MAX = 8_000;

export const FILE_PATH = {
  product: 'public/products.md',
  promotion: 'public/promotions.md',
};

export const EXAMPLE = {
  items: '[사이다-2],[감자칩-1]',
};

export const ERROR_MESSAGE_DEFAULT = '[ERROR]';
export const ERROR_MESSAGE = {
  itemsOverQuantity: `${ERROR_MESSAGE_DEFAULT} 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.`,
  notItemsFormat: `${ERROR_MESSAGE_DEFAULT} 형식에 맞지 않습니다. ${EXAMPLE.items}와 같은 형식으로 작성해주세요.`,
  itemsZero: `${ERROR_MESSAGE_DEFAULT} 존재하지 않는 상품입니다.`,
  inputItemsZero: `${ERROR_MESSAGE_DEFAULT} 0개 이상의 값을 입력해주세요.`,
  notYesOrNo: `${ERROR_MESSAGE_DEFAULT} ${YES} 혹은 ${NO}을 입력해주세요.`,
};

export const INPUT_MEESAGE = {
  readItem: `구매하실 상품명과 수량을 입력해 주세요. (예: ${EXAMPLE.items})\n`,
  membershipDiscount: `멤버십 할인을 받으시겠습니까? (${YES}/${NO})\n`,
  tryMoreOrder: `감사합니다. 구매하고 싶은 다른 상품이 있나요? (${YES}/${NO})\n`,
};

export const OUTPUT_MESSAGE = {
  hello: '안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n',
  noProduct: '재고 없음',
  negative: '-',
};

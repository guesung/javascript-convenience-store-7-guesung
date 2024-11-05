# javascript-convenience-store-precourse

# 과제 이름

## 🔨 기능 구현 목록

1. 구현에 필요한 상품 목록과 행사 목록을 파일 입출력을 통해 불러온다.

   - `public/products.md`와 `public/promotion.md`파일을 이용한다.

2. 환영 인사와 함께 상품명, 가격, 프로모션 이름, 재고를 안내한다. 만약 재고가 0개라면 `재고 없음`을 출력한다.

   1. 재고가 있는 경우

      ```
      안녕하세요. W편의점입니다.
      현재 보유하고 있는 상품입니다.

        - 콜라 1,000원 10개 탄산2+1
        - 콜라 1,000원 10개
        - 사이다 1,000원 8개 탄산2+1
        - 사이다 1,000원 7개
        - 오렌지주스 1,800원 9개 MD추천상품
        - 오렌지주스 1,800원 재고 없음
        - 탄산수 1,200원 5개 탄산2+1
        - 탄산수 1,200원 재고 없음
        - 물 500원 10개
        - 비타민워터 1,500원 6개
        - 감자칩 1,500원 5개 반짝할인
        - 감자칩 1,500원 5개
        - 초코바 1,200원 5개 MD추천상품
        - 초코바 1,200원 5개
        - 에너지바 2,000원 5개
        - 정식도시락 6,400원 8개
        - 컵라면 1,700원 1개 MD추천상품
        - 컵라면 1,700원 10개

        구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])

      ```

   2. 재고가 없는 경우

      ```
      재고 없음
      ```

3. 상품의 가격과 수량을 입력받는다.
   ```
   구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])
   ```
4. 입력받은 상품을 기반으로 프로모션 정보를 확인한다.

   1. 프로모션 적용이 가능한 상품에 대해 고객이 해당 수량만큼 가져오지 않았을 경우, 혜택에 대한 안내 메시지를 출력한다.
      ```
      현재 {상품명}은(는) 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)
      ```
   2. 프로모션 재고가 부족하여 일부 수량을 프로모션 혜택 없이 결제해야 하는 경우, 일부 수량에 대해 정가로 결제할지 여부에 대한 안내 메시지를 출력한다.
      ```
      현재 {상품명} {수량}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)
      ```

5. 멤버십 할인 적용 여부를 확인하기 위해 안내 문구를 출력한다.

   ```
   멤버십 할인을 받으시겠습니까? (Y/N)
   ```

6. 구매 상품 내역, 증정 상품 내역, 금액 정보를 출력한다.

   ```
   ===========W 편의점=============
   상품명		수량	금액
   콜라		3 	3,000
   에너지바 		5 	10,000
   ===========증	정=============
   콜라		1
   ==============================
   총구매액		8	13,000
   행사할인			-1,000
   멤버십할인			-3,000
   내실돈			 9,000

   ```

7. 추가 구매 여부를 입력 받는다.
   ```
   감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)
   ```

## 주의할 점

1. 사용자가 잘못된 값을 입력할 경우 에러 발생 후 다시 입력받는다.

## 🧑🏻‍💻 실행 방법

1.

## 📂 폴더 구조

-

## 📚 헷갈렸던 포인트

-

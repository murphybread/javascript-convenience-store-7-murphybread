import DateUtils from "../src/utils/DateUtils";
import StockSystem from "../src/inventory/StockSystem.js";
import PromotionSystem from "../src/discounts/PromotionSystem";
import path from "path";

describe("PromotionSystem 클래스", () => {
  test("입력받은 오늘이 반짝할인, MD추천상품, 탄산2+1 프로모션이 가능한날짜인지 확인", () => {
    const today = DateUtils.getKoreaNow();
    const currentKoreaFormattedDate = DateUtils.getKoreaNowFormatted(today);

    const promtionInfoList = StockSystem.parseFile("promotions.md");
    const activePromotions = new PromotionSystem().getActivePromotions();
    expect(activePromotions).toEqual(["탄산2+1", "MD추천상품", "반짝할인"]);
  });

  test("프로모션 되는 물품의 name, price, quantity promotion 반환", () => {
    const userInput = ["콜라", 3];
    const items = StockSystem.parseFile("products.md");
    const promotionItem = StockSystem.findPromotionItemByName(userInput[0], userInput[1]);

    const exampleItem = [{ name: "콜라", price: 1000, quantity: 9, promotion: "탄산2+1" }];
    expect(promotionItem).toEqual(exampleItem);
  });

  test("일반 재고 물품의 name, price, quantity promotion 반환", () => {
    const userInput = ["콜라", 3];
    const items = StockSystem.parseFile("products.md");
    const promotionItem = StockSystem.findNormalItemByName(userInput[0], userInput[1]);

    const exampleItem = [{ name: "콜라", price: 1000, quantity: 10, promotion: "null" }];
    expect(promotionItem).toEqual(exampleItem);
  });

  test.each([
    ["프로모션 재고가 충분한 경우 프로모션 재고 계산 결과 name, price, quantity, promotion 반환", ["콜라", 3]],
    ["프로모션 재고가 부족하여 일부상품에 대해 정가로 결제함을 알리는 경우", ["콜라", 10]]
  ])("%s케이스의 경우 name, price, quantity, promotion 반환", (caseDescription, userInput) => {
    const items = StockSystem.parseFile("products.md");
    const foundItem = items.filter((item) => item.name === userInput[0]);
    const promotionItem = items.filter((item) => item.name === userInput[0] && item.promotion !== "null");

    // 프로모션 타입이 2+1인경우
    if (promotionItem[0].promotion === "탄산2+1") {
      const promtSet = Math.floor(userInput[1] / 2);
      const promotionQuantity = promtSet * 3;
      // 프로모션 재고량이 충분한 경우 그대로 결제하며 프로모션 상품정보 반환
      if (promotionQuantity <= promotionItem[0].quantity) {
        const exampleItem = [{ name: "콜라", price: 1000, quantity: 1, promotion: "탄산2+1" }];
        const promptionGift = [{ ...promotionItem[0], quantity: promtSet }];
        expect(promptionGift).toEqual(exampleItem);
      } else {
        // 프로모션 재고량이 부족한 경우 일부 상품 정가안내
        const exampleItem = [{ name: "콜라", price: 1000, quantity: 10, promotion: "탄산2+1" }];
        const promoShortage = userInput[1] - Math.floor(userInput[1] / 3) * 3;
        const promptionGift = [{ ...promotionItem[0], quantity: userInput[1] }];
        expect(promptionGift).toEqual(exampleItem);
      }
    }
  });

  test("추가 구매를 통해 프로모션 상품 구입이 가능한 경우 안내", () => {
    const userInput = ["오렌지주스", 1];
    const items = StockSystem.parseFile("products.md");
    const foundItem = items.filter((item) => item.name === userInput[0]);
    const promotionItem = items.filter((item) => item.name === userInput[0] && item.promotion !== "null");
    //  프로모션 상품의 수량이 1개이상, 해당 프로모션 종류가 있는 경우
    if (promotionItem.length >= 1) {
      if (promotionItem[0].promotion === "MD추천상품" || promotionItem[0].promotion === "반짝할인") {
        const promtSet = Math.floor(userInput[1] / 2);
        const promotionQuantity = promtSet * 2;

        if (userInput[1] % 2 === 1) {
          const exampleItem = [{ name: "오렌지주스", price: 1800, quantity: 1, promotion: "MD추천상품" }];
          const promoShortage = 1;
          const promptionGift = [{ ...promotionItem[0], quantity: promoShortage }];
          expect(promptionGift).toEqual(exampleItem);
        }
      }
    }
  });
});

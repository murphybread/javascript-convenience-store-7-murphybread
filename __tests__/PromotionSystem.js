import DateUtils from "../src/utils/DateUtils";
import MarkdownToObjectReader from "../src/utils/MarkdownToObjectReader";
import path from "path";

class PromotionSystem {
  activePromotions() {
    const today = DateUtils.getKoreaNow();
    const currentKoreaFormattedDate = DateUtils.getKoreaNowFormatted(today);
    const promtionInfoList = MarkdownToObjectReader.parseFile("promotions.md");
    const activePromotions = [];
    promtionInfoList.forEach((promotion) => {
      if (promotion.start_date <= currentKoreaFormattedDate && promotion.end_date >= currentKoreaFormattedDate) {
        activePromotions.push(promotion.name);
      }
    });

    return activePromotions;
  }
}

describe("PromotionSystem 클래스", () => {
  test("입력받은 오늘이 반짝할인, MD추천상품, 탄산2+1 프로모션이 가능한날짜인지 확인", () => {
    const today = DateUtils.getKoreaNow();
    const currentKoreaFormattedDate = DateUtils.getKoreaNowFormatted(today);

    const promtionInfoList = MarkdownToObjectReader.parseFile("promotions.md");
    const activePromotions = new PromotionSystem().activePromotions();
    expect(activePromotions).toEqual(["탄산2+1", "MD추천상품", "반짝할인"]);
  });
});

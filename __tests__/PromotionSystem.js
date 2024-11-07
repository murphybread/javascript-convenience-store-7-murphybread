import DateUtils from "../src/utils/DateUtils";
import MarkdownToObjectReader from "../src/utils/MarkdownToObjectReader";
import path from "path";

describe("PromotionSystem 클래스", () => {
  test("입력받은 오늘이 반짝할인, MD추천상품, 탄산2+1 프로모션이 가능한날짜인지 확인", () => {
    const today = DateUtils.getKoreaNow();
    const currentKoreaFormattedDate = DateUtils.getKoreaNowFormatted(today);
    const directoryPath = path.join(__dirname, "../public/");

    const promtionInfoList = MarkdownToObjectReader.parseFile(directoryPath, "promotions.md");
    const activePromotions = [];
    promtionInfoList.forEach((promotion) => {
      if (promotion.start_date <= currentKoreaFormattedDate && promotion.end_date >= currentKoreaFormattedDate) {
        activePromotions.push(promotion.name);
      }
    });
    expect(activePromotions).toEqual(["탄산2+1", "MD추천상품", "반짝할인"]);
  });
});

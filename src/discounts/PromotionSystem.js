import DateUtils from "../utils/DateUtils.js";
import StockSystem from "../inventory/StockSystem.js";

class PromotionSystem {
  getActivePromotions() {
    const today = DateUtils.getKoreaNow();
    const currentKoreaFormattedDate = DateUtils.getKoreaNowFormatted(today);
    const promtionInfoList = StockSystem.parseFile("promotions.md");
    const activePromotions = [];
    promtionInfoList.forEach((promotion) => {
      if (promotion.start_date <= currentKoreaFormattedDate && promotion.end_date >= currentKoreaFormattedDate) {
        activePromotions.push(promotion.name);
      }
    });

    return activePromotions;
  }
}
export default PromotionSystem;

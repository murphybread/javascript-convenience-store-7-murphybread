import { MissionUtils } from "@woowacourse/mission-utils";
import MarkdownToObjectReader from "../utils/MarkdownToObjectReader.js";

class OutputView {
  printIntroduction() {
    MissionUtils.Console.print("안녕하세요. W편의점입니다.\n현재 보유하고 있는 상품입니다.\n");
  }
  getPromotion(promotion) {
    if (promotion !== "null") {
      return ` ${promotion}`;
    }
    return "";
  }

  getStockStatus(quantity) {
    if (quantity > 0) {
      return `${quantity}개`;
    }
    return "재고 없음";
  }

  printProducts() {
    const items = MarkdownToObjectReader.parseFile("products.md");
    items.forEach((item) => {
      const promotion = this.getPromotion(item.promotion);
      const stockStatus = this.getStockStatus(item.quantity);
      MissionUtils.Console.print(`- ${item.name} ${item.price.toLocaleString("ko-KR")}원 ${stockStatus}${promotion}`);
    });
    MissionUtils.Console.print("\n");
    // ...
  }
  // ...
}

export default OutputView;

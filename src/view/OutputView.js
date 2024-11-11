import { MissionUtils } from "@woowacourse/mission-utils";
import MarkdownToObjectReader from "../utils/MarkdownToObjectReader.js";
import { TEST_FILE } from "../config/constants.js";
import MembershipDiscount from "../discounts/MembershipDiscount.js";

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
    const items = MarkdownToObjectReader.parseFile(TEST_FILE);
    items.forEach((item) => {
      const promotion = this.getPromotion(item.promotion);
      const stockStatus = this.getStockStatus(item.quantity);
      MissionUtils.Console.print(`- ${item.name} ${item.price.toLocaleString("ko-KR")}원 ${stockStatus}${promotion}`);
    });
    MissionUtils.Console.print("\n");
    // ...
  }

  printReceipt(totalStockList, normalStockList, promotionStockList, promotionGiftList) {
    let totalPrice = 0;
    let totalQuantity = 0;
    let promotionPrice = 0;
    let promotionQuantity = 0;

    MissionUtils.Console.print(`===========W 편의점=============`);
    MissionUtils.Console.print(`상품명  수량 금액`);
    for (let stock of totalStockList) {
      MissionUtils.Console.print(`${stock.name}		${stock.quantity}	${stock.price * stock.quantity}`);
      totalPrice += stock.price * stock.quantity;
      totalQuantity += stock.quantity;
    }
    MissionUtils.Console.print(`===========증	정=============`);
    for (let stock of promotionGiftList) {
      if (stock.quantity >= 1) {
        MissionUtils.Console.print(`${stock.name}		${stock.quantity}`);
        promotionPrice += stock.price * stock.quantity;
        promotionQuantity += stock.quantity;
      }
    }
    MissionUtils.Console.print(`==============================`);
    MissionUtils.Console.print(`총구매액:  ${totalQuantity} ${totalPrice}`);
    MissionUtils.Console.print(`행사할인:   -${promotionPrice}`);
    MissionUtils.Console.print(`멤버십할인:   -${MembershipDiscount.calculateDiscount(normalStockList)}`);
    MissionUtils.Console.print(`내실돈:   ${totalPrice - promotionPrice - MembershipDiscount.calculateDiscount(normalStockList)}`);
  }
  // ...
}

export default OutputView;

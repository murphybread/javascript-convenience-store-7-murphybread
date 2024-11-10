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

  printReceipt(purcharsedStockList, promotionStockList, membershipPrice) {
    let totalPrice = 0;
    let totalQuantity = 0;
    let promotionPrice = 0;
    let promotionQuantity = 0;
    MissionUtils.Console.print(`===========W 편의점=============\n`);
    MissionUtils.Console.print(`상품명		수량	금액\n`);
    for (let stock of purcharsedStockList) {
      MissionUtils.Console.print(`${stock.name}		${stock.quantity}	${stock.price * stock.quantity}\n`);
      totalPrice += stock.price * stock.quantity;
      totalQuantity += stock.quantity;
    }
    MissionUtils.Console.print(`===========증	정=============\n`);
    for (let stock of promotionStockList) {
      MissionUtils.Console.print(`${stock.name}		${stock.price * stock.quantity}\n`);
      promotionPrice += stock.price * stock.quantity;
      promotionQuantity += stock.quantity;
    }
    MissionUtils.Console.print(`==============================`);
    MissionUtils.Console.print(`총구매액: ${totalQuantity} ${totalPrice}\n`);
    MissionUtils.Console.print(`행사할인: -${promotionPrice}\n`);
    MissionUtils.Console.print(`멤버십할인: -${membershipPrice}\n`);
    MissionUtils.Console.print(`내실돈: ${totalPrice - promotionPrice - membershipPrice}\n`);
  }
  // ...
}

export default OutputView;

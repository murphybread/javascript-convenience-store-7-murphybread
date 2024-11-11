import { MissionUtils } from "@woowacourse/mission-utils";
import MarkdownToObjectReader from "../utils/MarkdownToObjectReader.js";
import { TEST_FILE } from "../config/constants.js";
import MembershipDiscount from "../discounts/MembershipDiscount.js";

class OutputView {
  static lineLength = 36;

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

  static getDisplayWidth(name) {
    let width = 0;
    if (Number.isInteger(name)) {
      width += 1;
    } else {
      for (let char of name) {
        if (char.match(/[^\x00-\x7F]/)) {
          width += 2;
        } else {
          width += 1;
        }
      }
    }
    return width;
  }
  static centerText(text) {
    const padding = Math.floor((this.lineLength - text.length) / 2);
    const formattedText = "=".repeat(padding) + text + "=".repeat(this.lineLength - text.length - padding);
    MissionUtils.Console.print(formattedText);
  }

  static formatLine(name, quantity, price) {
    if (!name || quantity === undefined || isNaN(price)) {
      return;
    }
    const centerPosition = 18;
    const secondPosition = 10;

    const formattedName = name.padEnd(centerPosition - name.length, " ");
    const formattedQuantity = String(quantity).padEnd(secondPosition - this.getDisplayWidth(quantity), " ");

    const formattedPrice = price.toLocaleString("ko-KR");

    const formattedString = formattedName + formattedQuantity + formattedPrice;
    MissionUtils.Console.print(formattedString);
  }

  static printReceipt(totalStockList, normalStockList, promotionStockList, promotionGiftList, membershipDiscountPrice) {
    let totalPrice = 0;
    let totalQuantity = 0;
    let promotionPrice = 0;
    let promotionQuantity = 0;

    OutputView.centerText("W 편의점");
    OutputView.formatLine("상품", "수량", "금액");

    for (let stock of totalStockList) {
      OutputView.formatLine(stock.name, stock.quantity, stock.price * stock.quantity);
      totalPrice += stock.price * stock.quantity;
      totalQuantity += stock.quantity;
    }
    OutputView.centerText("증    정");
    for (let stock of promotionGiftList) {
      if (stock.quantity >= 1) {
        OutputView.formatLine(stock.name, stock.quantity, stock.price * stock.quantity);
        promotionPrice += stock.price * stock.quantity;
        promotionQuantity += stock.quantity;
      }
    }
    OutputView.centerText("=");
    OutputView.formatLine("총구매액", totalQuantity, totalPrice);
    OutputView.formatLine("행사할인", "", -promotionPrice);
    OutputView.formatLine("멤버십할인", "", -membershipDiscountPrice);
    OutputView.formatLine("내실돈", "", totalPrice - promotionPrice - membershipDiscountPrice);
  }
  // ...
}

export default OutputView;

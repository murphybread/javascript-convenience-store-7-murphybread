import { MissionUtils } from "@woowacourse/mission-utils";
import MembershipDiscount from "../discounts/MembershipDiscount.js";
import { MEMBERSHIP_STATUS } from "../config/constants.js";
import Validator from "../utils/Validator.js";
class InputView {
  static async readItem() {
    const input = await MissionUtils.Console.readLineAsync("구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n");
    return input;
  }

  async parseUserInput() {
    const input = await InputView.readItem();
    const items = input.split(",");
    if(!Validator.itemFormat(items)){
      return await this.parseUserInput();
    }
    const parsedItems = [];
    for (const item of items) {
      const cleanedItem = item.replace(/[\[\]\s]/g, "");
      const [name, quantityStr] = cleanedItem.split("-");
      const quantity = Number(quantityStr);
      if (!Validator.stockName(name)) {
        return await this.parseUserInput();
      }
      if (!Validator.number(quantity)) {
        return await this.parseUserInput();
      }
      parsedItems.push([name, quantity]);
    }
    return parsedItems;
    
  }

  static async requestMembershipDiscount(normalStockList) {
    const userMembershipAnswer = await MissionUtils.Console.readLineAsync("\n멤버십 할인을 받으시겠습니까? (Y/N)\n");
    const membership = new MembershipDiscount(MEMBERSHIP_STATUS[userMembershipAnswer]);

    if (membership.isActive()) {
      const discountAmount = MembershipDiscount.calculateDiscount(normalStockList);
      return discountAmount;
    } else {
      return 0;
    }
  }

  // ...
}

export default InputView;

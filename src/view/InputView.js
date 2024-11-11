import { MissionUtils } from "@woowacourse/mission-utils";
import MembershipDiscount from "../discounts/MembershipDiscount.js";
import { MEMBERSHIP_STATUS } from "../config/constants.js";
class InputView {
  static async readItem() {
    const input = await MissionUtils.Console.readLineAsync("구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n");
    return input;
  }

  parseUserInput(input) {
    const items = input.split(",");
    return items.map((item) => {
      const cleanedItem = item.replace(/[\[\]\s]/g, "");
      const [name, quantity] = cleanedItem.split("-");
      return [name, Number(quantity)];
    });
  }

  static async requestMembershipDiscount(price) {
    const userMembershipAnswer = await MissionUtils.Console.readLineAsync("멤버십 할인을 받으시겠습니까? (Y/N)\n");
    const membership = new MembershipDiscount(MEMBERSHIP_STATUS[userMembershipAnswer]);

    if (membership.isActive()) {
      const discountAmount = membership.calculateDiscount(price);
      return discountAmount;
    } else {
      console.log("멤버십 할인이 적용되지 않습니다.");
      return 0;
    }
  }

  // ...
}

export default InputView;

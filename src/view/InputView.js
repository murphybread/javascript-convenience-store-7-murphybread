import { MissionUtils } from "@woowacourse/mission-utils";

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

  // ...
}

export default InputView;

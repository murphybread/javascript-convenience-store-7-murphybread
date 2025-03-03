import { MissionUtils } from "@woowacourse/mission-utils";
class Validator {
  static number(value) {
    if (typeof value !== "number" || value <= 0 || !Number.isInteger(value)) {
      MissionUtils.Console.print("[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.")
      return false;

    }
    return true;
  }
  static stockName(name) {
    if (typeof name !== "string" || name.trim() === "" || name.length > 50) {
      MissionUtils.Console.print("[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.")
      return false;

    }
    return true;
  }

  static itemFormat(items) {
    const validFormat = /^\[[a-zA-Z가-힣0-9]+\-\d+\]$/;

    items.forEach((item) => {
      if (!validFormat.test(item.trim())) {
        MissionUtils.Console.print("[ERROR] 잘못된 입력입니다. 다시 입력해 주세요.")
        
        return false;
      }
    });
    return true;
  }

  static checkExceedStockQuantity(findStockItemInfo, requestStockQuantity) {
    let currentStockQuantity = 0;
    for (let stock of findStockItemInfo) {
      currentStockQuantity += stock.quantity;
    }
    if (currentStockQuantity < requestStockQuantity) {
      MissionUtils.Console.print("[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.")
      return false;
    }
    return true;
  }
}
export default Validator;

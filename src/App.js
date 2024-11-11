import OuputView from "./view/OutputView.js";
import InputView from "./view/InputView.js";
import StockSystem from "./inventory/Stocksystem.js";
import MembershipDiscount from "./discounts/MembershipDiscount.js";
import { MissionUtils } from "@woowacourse/mission-utils";

class App {
  constructor() {
    this.outputView = new OuputView();
    this.inputView = new InputView();
    this.stockSystem = new StockSystem();
  }

  async run() {
    let keepRunning = true;

    while (keepRunning) {
      this.outputView.printIntroduction();
      this.outputView.printProducts();

      const input = await InputView.readItem();
      const inputList = this.inputView.parseUserInput(input);
      for (const input of inputList) {
        let [totalStock, normalStock, promotionStock, promotionGift] = await this.stockSystem.calculateTotalPrice(input[0], input[1]);
        this.stockSystem.updateStockList(totalStock, normalStock, promotionStock, promotionGift);
        this.stockSystem.writeUpdatedStockToFile(input[0], input[1]);
      }

      // 멤버십 할인 요청
      await InputView.requestMembershipDiscount(this.stockSystem.totalStockList);
      await StockSystem.initializeTestMd();

      // 영수증 출력
      this.outputView.printReceipt(this.stockSystem.totalStockList, this.stockSystem.normalStockList, this.stockSystem.promotionStockList, this.stockSystem.promotionGiftList);

      // 사용자에게 다시 실행할지 묻는 부분 추가
      const continueAnswer = await MissionUtils.Console.readLineAsync("감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n");

      this.stockSystem.initializeStockList();
      keepRunning = continueAnswer.toLowerCase() === "y";
    }
  }
}

export default App;

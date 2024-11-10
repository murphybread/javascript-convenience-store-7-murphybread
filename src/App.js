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
    const totalStockList = [];
    const normalStockList = [];
    const promotionStockList = [];

    while (keepRunning) {
      this.outputView.printIntroduction();
      this.outputView.printProducts();

      const input = await InputView.readItem();
      const inputList = this.inputView.parseUserInput(input);
      for (const input of inputList) {
        let [totalStock, promoStock, normalStock] = await this.stockSystem.calculateTotalPrice(input[0], input[1]);
        totalStockList.push(totalStock);
        normalStockList.push(normalStock);
        promotionStockList.push(promoStock);
        console.log(`totalStockList ${totalStockList}\n`);
        console.log(`promotionStockList ${promotionStockList}\n`);
        console.log(`normalStockList ${normalStockList}\n`);
      }

      const membershipPrice = await InputView.requestMembershipDiscount(this.stockSystem.normalPrice);
      await StockSystem.initializeTestMd();

      // 영수증 출력
      console.log(`purcharsedStockList ${JSON.stringify(purcharsedStockList)}`, `promotionStockList ${JSON.stringify(promotionStockList)}`);
      this.outputView.printReceipt(purcharsedStockList, promotionStockList, membershipPrice);

      // 사용자에게 다시 실행할지 묻는 부분 추가
      const continueAnswer = await MissionUtils.Console.readLineAsync("감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)\n");
      keepRunning = continueAnswer.toLowerCase() === "y";
    }
  }
}

export default App;

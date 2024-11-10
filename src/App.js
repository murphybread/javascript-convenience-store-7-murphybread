import OuputView from "./view/OutputView.js";
import InputView from "./view/InputView.js";
import StockSystem from "./inventory/Stocksystem.js";
import MembershipDiscount from "./discounts/MembershipDiscount.js";

class App {
  constructor() {
    this.outputView = new OuputView();
    this.inputView = new InputView();
    this.stockSystem = new StockSystem();
  }

  async run() {
    this.outputView.printIntroduction();
    this.outputView.printProducts();

    const input = await InputView.readItem();
    const inputList = this.inputView.parseUserInput(input);
    inputList.forEach((input) => {
      this.stockSystem.calculateTotalPrice(input[0], input[1]);
      this.stockSystem.testwriteUpdatedStockToFile(input[0], input[1]);
    });

    await InputView.requestMembershipDiscount(this.stockSystem.normalPrice);
    await StockSystem.initializeTestMd();
  }
}

export default App;

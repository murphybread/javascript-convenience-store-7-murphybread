import OuputView from "./view/OutputView.js";
import InputView from "./view/InputView.js";
import StockSystem from "./inventory/Stocksystem.js";

class App {
  constructor() {
    this.outputView = new OuputView();
    this.inputView = new InputView();
  }

  async run() {
    this.outputView.printIntroduction();
    this.outputView.printProducts();

    const input = await InputView.readItem();
    const inputList = this.inputView.parseUserInput(input);
    StockSystem.calculateTotalPrice(inputList[0], inputList[1]);
  }
}

export default App;

import OuputView from "./view/OutputView.js";
import InputView from "./view/InputView.js";

class App {
  constructor() {
    this.outputView = new OuputView();
    this.inputView = new InputView();
  }

  async run() {
    this.outputView.printIntroduction();
    this.outputView.printProducts();
    const input = await this.inputView.readItem();
    console.log(this.inputView.parseUserInput(input));
  }
}

export default App;

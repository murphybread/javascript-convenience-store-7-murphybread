import { MissionUtils } from "@woowacourse/mission-utils";
import StockSystem from "../inventory/Stocksystem.js";
import { DIRECTORY_PATH, MEMBERSHIP_STATUS, TEST_FILE } from "../config/constants.js";
import path from "path";
import fs from "fs";

class MarkdownFileProcessor {
  static async initializeTestMd() {
    const items = StockSystem.parseFile("products.md");
    const filePath = path.join(DIRECTORY_PATH, TEST_FILE);
    let markdownContent = "name,price,quantity,promotion\n";
    items.forEach((item) => {
      markdownContent += `${item.name},${item.price},${item.quantity},${item.promotion}\n`;
    });
    fs.writeFileSync(filePath, markdownContent, "utf8");
  }
}

export default MarkdownFileProcessor;
MarkdownFileProcessor.initializeTestMd();

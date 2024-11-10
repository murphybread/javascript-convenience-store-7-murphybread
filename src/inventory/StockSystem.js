import fs from "fs";
import path from "path";
import { DIRECTORY_PATH, MEMBERSHIP_STATUS } from "../config/constants.js";
import MembershipDiscount from "../discounts/MembershipDiscount.js";
import PromotionSystem from "../discounts/PromotionSystem.js";
import InputView from "../view/InputView.js";
import { MissionUtils } from "@woowacourse/mission-utils";

const TEST_FILE = "test.md";

class StockSystem {
  static #directoryPath = DIRECTORY_PATH;

  constructor() {
    this.promotionSystem = new PromotionSystem();
    this.membershipDiscount = new MembershipDiscount();
    this.totalPrice = 0;
    this.normalPrice = 0;
    this.promtionPrice = 0;
  }
  static parseFile(fileName) {
    const items = [];
    const filePath = path.join(this.#directoryPath, fileName);

    const fileStocklistRaw = fs.readFileSync(filePath, "utf-8");
    const fileStocklist = fileStocklistRaw
      .trim()
      .split(/\r?\n/)
      .map((line) => line.split(","));

    const header = fileStocklist[0]; // 첫 번째 줄 (헤더)
    const body = fileStocklist.slice(1); // 나머지 부분 (본문)

    body.forEach((item) => {
      const stockItem = {};
      header.forEach((key, index) => {
        // 숫자 처리
        if (Number.isNaN(Number(item[index]))) {
          stockItem[key] = item[index];
        } else {
          stockItem[key] = Number(item[index]);
        }
      });
      items.push(stockItem);
    });

    return items;
  }

  static findStockItemByName(stockName, stockQuantity) {
    const items = StockSystem.parseFile("products.md");
    const foundItem = items.filter((item) => item.name === stockName && item.quantity >= stockQuantity);
    return foundItem;
  }

  static findPromotionItemByName(stockName, stockQuantity) {
    const items = StockSystem.parseFile("products.md");
    const promotionItems = items.filter((item) => item.name === stockName && item.quantity >= stockQuantity && item.promotion !== "null");
    return promotionItems;
  }

  static findNormalItemByName(stockName, stockQuantity) {
    const items = StockSystem.parseFile("products.md");
    const promotionItems = items.filter((item) => item.name === stockName && item.quantity >= stockQuantity && item.promotion === "null");
    return promotionItems;
  }

  // 실제 원본 products.md수정
  writeUpdatedStockToFile(stockName, stockQuantity) {
    const items = StockSystem.parseFile(TEST_FILE);
    const filePath = path.join(StockSystem.#directoryPath, TEST_FILE);
    let hasUpdated = false;

    const updatedStock = items.map((stock) => {
      if (!hasUpdated && stock.name === stockName && stock.quantity >= stockQuantity) {
        hasUpdated = true;
        return { ...stock, quantity: stock.quantity - stockQuantity };
      }
      return stock;
    });
    let markdownContent = "name,price,quantity,promotion\n";
    updatedStock.forEach((item) => {
      markdownContent += `${item.name},${item.price},${item.quantity},${item.promotion}\n`;
    });

    fs.writeFileSync(filePath, markdownContent, "utf8");
  }

  calculateTotalPrice(stockName, stockQuantity) {
    const items = StockSystem.parseFile(TEST_FILE);

    // 먼저 재고가 존재하는지 확인
    const findStockItemInfo = StockSystem.findStockItemByName(stockName, stockQuantity);
    if (findStockItemInfo.length === 0) {
      MissionUtils.Console.print("재고가 부족합니다.");

      return InputView.readItem();
    }
    // 프로모션 재고가 있는 경우 프로모션재고반환 없는 경우 일반 재고 정보 반환
    const promotionSaleItemInfo = StockSystem.findPromotionItemByName(stockName, stockQuantity);
    const normalSaleItemInfo = StockSystem.findNormalItemByName(stockName, stockQuantity);

    console.log(`promotionSaleItemInfo ${JSON.stringify(promotionSaleItemInfo, null, 2)}`);
    console.log(`normalSaleItemInfo ${JSON.stringify(normalSaleItemInfo, null, 2)}`);

    if (promotionSaleItemInfo.length > 0) {
      promotionSaleItemInfo.forEach((stock) => {
        this.promtionPrice += stock.price * stockQuantity;
      });
    } else {
      normalSaleItemInfo.forEach((stock) => {
        this.normalPrice += stock.price * stockQuantity;
      });
    }

    this.totalPrice += this.normalPrice + this.promtionPrice;

    console.log(`this.totalPrice ${this.totalPrice} , this.normalPrice ${this.normalPrice} , this.promtionPrice ${this.promtionPrice}`);

    return [this.totalPrice, this.normalPrice, this.promtionPrice];
  }

  static async initializeTestMd() {
    const initializeAnwser = await MissionUtils.Console.readLineAsync("\ntest.md를 초기화 할까요?");
    if (MEMBERSHIP_STATUS[initializeAnwser]) {
      const items = StockSystem.parseFile("products.md");
      const filePath = path.join(StockSystem.#directoryPath, TEST_FILE);
      let markdownContent = "name,price,quantity,promotion\n";
      items.forEach((item) => {
        markdownContent += `${item.name},${item.price},${item.quantity},${item.promotion}\n`;
      });
      fs.writeFileSync(filePath, markdownContent, "utf8");
    }
  }
}

export default StockSystem;

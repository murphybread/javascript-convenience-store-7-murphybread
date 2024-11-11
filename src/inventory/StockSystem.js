import fs from "fs";
import path from "path";
import { DIRECTORY_PATH, MEMBERSHIP_STATUS, TEST_FILE } from "../config/constants.js";
import MembershipDiscount from "../discounts/MembershipDiscount.js";
import PromotionSystem from "../discounts/PromotionSystem.js";
import InputView from "../view/InputView.js";
import { MissionUtils } from "@woowacourse/mission-utils";

class StockSystem {
  static #directoryPath = DIRECTORY_PATH;

  constructor() {
    this.promotionSystem = new PromotionSystem();
    this.membershipDiscount = new MembershipDiscount();
    this.totalStockList = [];
    this.normalStockList = [];
    this.promotionStockList = [];
    this.promotionGiftList = [];
  }

  initializeStockList() {
    MissionUtils.Console.print("");
    this.totalStockList = [];
    this.normalStockList = [];
    this.promotionStockList = [];
    this.promotionGiftList = [];
  }

  updateStockList(totalStock, normalStock, promotionStock, promotionGift) {
    this.totalStockList.push(totalStock);
    this.normalStockList.push(normalStock);
    this.promotionStockList.push(promotionStock);
    this.promotionGiftList.push(promotionGift);
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
    const foundItem = items.filter((item) => item.name === stockName && item.quantity > 0);
    return foundItem;
  }

  static findPromotionItemByName(stockName, stockQuantity) {
    const items = StockSystem.parseFile("products.md");
    const promotionItems = items.filter((item) => item.name === stockName && item.quantity > 0 && item.promotion !== "null");
    return promotionItems;
  }

  static findNormalItemByName(stockName, stockQuantity) {
    const items = StockSystem.parseFile("products.md");
    const promotionItems = items.filter((item) => item.name === stockName && item.quantity > 0 && item.promotion === "null");
    return promotionItems;
  }

  // 실제 원본 products.md수정
  writeUpdatedStockToFile(stockName, stockQuantity) {
    const items = StockSystem.parseFile(TEST_FILE);
    const filePath = path.join(StockSystem.#directoryPath, TEST_FILE);
    let purchasedStock = {};
    let hasUpdated = false;

    const updatedStock = items.map((stock) => {
      if (!hasUpdated && stock.name === stockName && stock.quantity >= stockQuantity) {
        hasUpdated = true;
        purchasedStock = { ...stock, quantity: stockQuantity };
        return { ...stock, quantity: stock.quantity - stockQuantity };
      }
      return stock;
    });
    let markdownContent = "name,price,quantity,promotion\n";
    updatedStock.forEach((item) => {
      markdownContent += `${item.name},${item.price},${item.quantity},${item.promotion}\n`;
    });

    fs.writeFileSync(filePath, markdownContent, "utf8");
    return purchasedStock;
  }

  async checkPromotionAvailable(promotionSaleItemInfo, requestStockQuantity) {
    // 프로모션 조건 확인
    if (promotionSaleItemInfo[0].promotion === "MD추천상품" || promotionSaleItemInfo[0].promotion === "반짝할인") {
      if (requestStockQuantity % 2 === 1) {
        const userPromoAnswer = await MissionUtils.Console.readLineAsync(`\n현재 ${promotionSaleItemInfo[0].name} 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`);

        if (userPromoAnswer.toLowerCase() === "y") {
          return 1;
        }
      }
      return 0;
    }

    if (promotionSaleItemInfo[0].promotion === "탄산2+1") {
      if (requestStockQuantity % 3 === 2) {
        const userPromoAnswer = await MissionUtils.Console.readLineAsync(`\n현재 ${promotionSaleItemInfo[0].name} 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`);
        if (userPromoAnswer.toLowerCase() === "y") {
          return 1;
        }
      }
    }
    return 0;
  }

  calculatePromotionGift(promotionSaleItemInfo) {
    // 프로모션 조건 확인
    if (promotionSaleItemInfo.promotion === "MD추천상품" || promotionSaleItemInfo.promotion === "반짝할인") {
      return { ...promotionSaleItemInfo, quantity: promotionSaleItemInfo.quantity / 2 };
    }

    if (promotionSaleItemInfo.promotion === "탄산2+1") {
      return { ...promotionSaleItemInfo, quantity: promotionSaleItemInfo.quantity / 3 };
    }
    return 0;
  }

  async calculateTotalPrice(requestStockName, requestStockQuantity) {
    const items = StockSystem.parseFile(TEST_FILE);

    // 먼저 재고가 존재하는지 확인
    const findStockItemInfo = StockSystem.findStockItemByName(requestStockName, requestStockQuantity);
    const findPromotionSaleItemInfo = StockSystem.findPromotionItemByName(requestStockName, requestStockQuantity);
    const findNormalSaleItemInfo = StockSystem.findNormalItemByName(requestStockName, requestStockQuantity);

    if (findStockItemInfo.length === 0) {
      MissionUtils.Console.print("재고가 부족합니다.");

      return InputView.readItem();
    }

    // 프로모션 재고가 있는 경우 프로모션재고반환 없는 경우 일반 재고 정보 반환
    let promotionSaleItemInfo = { ...findStockItemInfo[0], quantity: 0 };
    let promotionGift = { ...findStockItemInfo[0], quantity: 0 };
    let normalSaleItemInfo = { ...findStockItemInfo[0], quantity: 0 };
    let totalSaleItemInfo = { ...findStockItemInfo[0], quantity: 0 };
    if (findPromotionSaleItemInfo.length > 0) {
      for (const stock of findPromotionSaleItemInfo) {
        // 프로모션 체크 추가. 프로모션재고가 있는데 고객이 해당 수량보다 적게가져온경우
        const additionalQuantity = await this.checkPromotionAvailable(findPromotionSaleItemInfo, requestStockQuantity);
        promotionSaleItemInfo = { ...promotionSaleItemInfo, quantity: Math.min(findPromotionSaleItemInfo[0].quantity, requestStockQuantity) + additionalQuantity };
        promotionGift = this.calculatePromotionGift(promotionSaleItemInfo);
      }
    } else {
      // 프로모션 재고가 없는 경우 mock데이터 작성
      promotionSaleItemInfo = { ...findStockItemInfo[0], quantity: 0 };
    }
    // 프로모션 재고로 불충분 한 경우 일반 재고 소모
    if (promotionSaleItemInfo.quantity < requestStockQuantity) {
      normalSaleItemInfo = { ...findNormalSaleItemInfo[0], quantity: requestStockQuantity - promotionSaleItemInfo.quantity };
    }

    totalSaleItemInfo = { ...totalSaleItemInfo, quantity: promotionSaleItemInfo.quantity + normalSaleItemInfo.quantity };

    return [totalSaleItemInfo, normalSaleItemInfo, promotionSaleItemInfo, promotionGift];
  }
}

export default StockSystem;

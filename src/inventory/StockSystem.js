import fs from "fs";
import path from "path";
import { DIRECTORY_PATH, MEMBERSHIP_STATUS, TEST_FILE } from "../config/constants.js";
import MembershipDiscount from "../discounts/MembershipDiscount.js";
import PromotionSystem from "../discounts/PromotionSystem.js";
import InputView from "../view/InputView.js";
import { MissionUtils } from "@woowacourse/mission-utils";
import Validator from "../utils/Validator.js";

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
    const items = StockSystem.parseFile(TEST_FILE);
    const foundItem = items.filter((item) => item.name === stockName);
    return foundItem;
  }

  static findPromotionItemByName(stockName, stockQuantity) {
    const items = StockSystem.parseFile(TEST_FILE);
    const promotionSystem = new PromotionSystem();
    const activePromotions = promotionSystem.getActivePromotions();
    const promotionItems = items.filter((item) => item.name === stockName && activePromotions.includes(item.promotion));
    return promotionItems;
  }

  static findNormalItemByName(stockName, stockQuantity) {
    const items = StockSystem.parseFile(TEST_FILE);
    const promotionItems = items.filter((item) => item.name === stockName && item.promotion === "null");
    return promotionItems;
  }

  // 실제 원본 products.md수정
  writeUpdatedStockToFile(totalStock) {
    const items = StockSystem.parseFile(TEST_FILE);
    const filePath = path.join(StockSystem.#directoryPath, TEST_FILE);

    let updatedStock = items;

    for (let purchasedStock of totalStock) {
      updatedStock = updatedStock.map((stock) => {
        if (stock.name === purchasedStock.name && stock.promotion === purchasedStock.promotion) {
          return { ...stock, quantity: stock.quantity - purchasedStock.quantity };
        }
        return stock;
      });
    }

    let markdownContent = "name,price,quantity,promotion\n";
    updatedStock.forEach((item) => {
      markdownContent += `${item.name},${item.price},${item.quantity},${item.promotion}\n`;
    });

    fs.writeFileSync(filePath, markdownContent, "utf8");
  }

  async checkPromotionAvailable(findPromotionSaleItemInfo, requestStockQuantity) {
    // 추가 요구 개수 프로모션 조건 확인
    if (findPromotionSaleItemInfo[0].promotion === "MD추천상품" || findPromotionSaleItemInfo[0].promotion === "반짝할인") {
      if (requestStockQuantity % 2 === 1 && findPromotionSaleItemInfo[0].quantity - requestStockQuantity >= 1) {
        const userPromoAnswer = await MissionUtils.Console.readLineAsync(`\n현재 ${findPromotionSaleItemInfo[0].name} 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)\n`);

        if (userPromoAnswer.toLowerCase() === "y") {
          return 1;
        }
      }
      return 0;
    }

    if (findPromotionSaleItemInfo[0].promotion === "탄산2+1") {
      if (requestStockQuantity % 3 === 2 && findPromotionSaleItemInfo[0].quantity - requestStockQuantity >= 1) {
        const userPromoAnswer = await MissionUtils.Console.readLineAsync(`\n현재 ${findPromotionSaleItemInfo[0].name} 1개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`);
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
      return { ...promotionSaleItemInfo, quantity: Math.floor(promotionSaleItemInfo.quantity / 3) };
    }
    return 0;
  }

  async calculateTotalPrice(requestStockName, requestStockQuantity) {
    const items = StockSystem.parseFile(TEST_FILE);

    // 먼저 재고가 존재하는지 확인
    const findStockItemInfo = StockSystem.findStockItemByName(requestStockName, requestStockQuantity);
    const findPromotionSaleItemInfo = StockSystem.findPromotionItemByName(requestStockName, requestStockQuantity);
    const findNormalSaleItemInfo = StockSystem.findNormalItemByName(requestStockName, requestStockQuantity);

    // 존재하지 않는 상품을 입력한경우
    if (findStockItemInfo.length === 0) {
      MissionUtils.Console.print("[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.");

      return InputView.readItem();
    }

    // 재고수량 확인
    if(!Validator.checkExceedStockQuantity(findStockItemInfo, requestStockQuantity)){

      return [0,0,0,0]
    }

    // 프로모션 재고가 있는 경우 프로모션 재고반환 없는 경우 일반 재고 정보 반환
    let promotionSaleItemInfo = [];
    let promotionSaleQuantity = 0;
    let promotionGift = 0;
    let normalSaleItemInfo = [];
    let totalSaleItemInfoList = [];
    if (findPromotionSaleItemInfo.length > 0 && findPromotionSaleItemInfo[0].quantity > 0) {
      // 프로모션 체크 추가. 프로모션재고가 있는데 고객이 해당 수량보다 적게가져온경우
      for (const stock of findPromotionSaleItemInfo) {
        const additionalQuantity = await this.checkPromotionAvailable(findPromotionSaleItemInfo, requestStockQuantity);
        promotionSaleItemInfo = { ...findPromotionSaleItemInfo[0], quantity: Math.min(findPromotionSaleItemInfo[0].quantity, requestStockQuantity) + additionalQuantity };
        promotionSaleQuantity = promotionSaleItemInfo.quantity;
        promotionGift = this.calculatePromotionGift(promotionSaleItemInfo);
      }
    }
    // 프로모션 재고로 불충분 한 경우 일반 재고 소모

    if (promotionSaleQuantity < requestStockQuantity && findNormalSaleItemInfo[0].quantity > 0) {
      if (promotionSaleItemInfo.promotion === "MD추천상품" || promotionSaleItemInfo.promotion === "반짝할인") {
        let nonPromotionQuantity = requestStockQuantity - (promotionSaleItemInfo.quantity - (promotionSaleItemInfo.quantity % 2));
        const userPromoAnswer = await MissionUtils.Console.readLineAsync(`\n현재 ${promotionSaleItemInfo.name} ${nonPromotionQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`);
        if (MEMBERSHIP_STATUS[userPromoAnswer]) {
          normalSaleItemInfo = { ...findNormalSaleItemInfo[0], quantity: requestStockQuantity - promotionSaleItemInfo.quantity };
        }
      }

      if (promotionSaleItemInfo.promotion === "탄산2+1") {
        let nonPromotionQuantity = requestStockQuantity - (promotionSaleItemInfo.quantity - (promotionSaleItemInfo.quantity % 3));
        const userPromoAnswer = await MissionUtils.Console.readLineAsync(`\n현재 ${promotionSaleItemInfo.name} ${nonPromotionQuantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)\n`);
        if (MEMBERSHIP_STATUS[userPromoAnswer]) {
          normalSaleItemInfo = { ...findNormalSaleItemInfo[0], quantity: requestStockQuantity - promotionSaleItemInfo.quantity };
        }
      }

      //프로모션이 없었던 경우
      if (promotionSaleItemInfo.length === 0) {
        normalSaleItemInfo = { ...findNormalSaleItemInfo[0], quantity: requestStockQuantity };
      }
    }

    [promotionSaleItemInfo, normalSaleItemInfo].forEach((item) => {
      if (!Array.isArray(item) && Object.keys(item).length > 0) {
        totalSaleItemInfoList.push(item);
      }
    });
    return [totalSaleItemInfoList, normalSaleItemInfo, promotionSaleItemInfo, promotionGift];
  }
}

export default StockSystem;

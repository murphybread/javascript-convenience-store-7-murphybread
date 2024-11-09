import fs from "fs";
import path from "path";
import StockSystem from "../src/inventory/StockSystem.js";

const stockList = [
  {
    name: "콜라",
    price: 1000,
    quantity: 10,
    promotion: "탄산2+1"
  }
];

describe("stockList 클래스", () => {
  test("재고 수량 고려한 결제 가능 여부 반환: 재고량이 입력받은 숫자보다 큰 경우 true반환", () => {
    const userInput = ["콜라", 5];

    const result = stockList.some((stock) => {
      if (stock.name === userInput[0]) {
        return stock.quantity >= userInput[1];
      }
    });

    expect(result).toBe(true);
  });

  test("재고 수량 고려한 결제 가능 여부 반환: 재고량이 입력받은 숫자보다 작은 경우 false반환", () => {
    const userInput = ["콜라", 50];

    const result = stockList.some((stock) => {
      if (stock.name === userInput[0]) {
        return stock.quantity > userInput[1];
      }
    });
  });

  test("고객이 상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리한다.", () => {
    const items = StockSystem.parseFile("products.md");
    const userInput = ["콜라", 3];
    const orderCount = userInput[1];
    let hasUpdated = false; // 첫 번째 항목만 업데이트할 플래그

    const updatedStock = items.map((stock) => {
      if (!hasUpdated && stock.name === userInput[0] && stock.quantity >= orderCount) {
        hasUpdated = true; // 첫 번째 항목을 업데이트한 후에는 false 유지
        // promotion 상품 먼저 결제
        if (stock.promotion !== "null") {
          return { ...stock, quantity: stock.quantity - orderCount };
        } else {
          return { ...stock, quantity: stock.quantity - orderCount };
        }
      }
      return stock;
    });
    console.log(updatedStock);

    let markdownContent = "name,price,quantity,promotion\n";
    updatedStock.forEach((item) => {
      markdownContent += `${item.name},${item.price},${item.quantity},${item.promotion}\n`;
    });
    expect(updatedStock[0].quantity).toBe(7);
  });
});

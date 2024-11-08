import fs from "fs";
import path from "path";

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
    const userInput = ["콜라", 3];
    const orderCount = userInput[1];
    const updatedStock = stockList.map((stock) => {
      if (stock.name === userInput[0] && stock.quantity >= orderCount) {
        return { ...stock, quantity: stock.quantity - orderCount };
      }
      return stock;
    });
    expect(updatedStock[0].quantity).toBe(7);
  });

  test("재고는 `public/products.md`를 통해 관리.", () => {
    const items = [];
    const filePath = path.join(__dirname, "../public/products.md");

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
        if (Number.isNaN(Number(item[index]))) {
          stockItem[key] = item[index];
        } else {
          stockItem[key] = Number(item[index]);
        }
      });
      items.push(stockItem);
    });

    expect(items[0]).toEqual(stockList[0]);
  });
});

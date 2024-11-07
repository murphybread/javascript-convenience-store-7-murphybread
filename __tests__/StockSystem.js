const stockSystem = [
  {
    name: "goods1",
    price: 1000,
    count: 10,
    promotionType: "탄산2+1",
  },
];

describe("StockSystem 클래스", () => {
  test("재고 수량 고려한 결제 가능 여부 반환: 재고량이 입력받은 숫자보다 큰 경우 true반환", () => {
    const userInput = ["goods1", 5];

    const result = stockSystem.some((stock) => {
      if (stock.name === userInput[0]) {
        return stock.count >= userInput[1];
      }
    });

    expect(result).toBe(true);
  });

  test("재고 수량 고려한 결제 가능 여부 반환: 재고량이 입력받은 숫자보다 작은 경우 false반환", () => {
    const userInput = ["goods1", 50];

    const result = stockSystem.some((stock) => {
      if (stock.name === userInput[0]) {
        return stock.count > userInput[1];
      }
    });
  });

  test("고객이 상품을 구매할 때마다, 결제된 수량만큼 해당 상품의 재고에서 차감하여 수량을 관리한다.", () => {
    const userInput = ["goods1", 3];
    const orderCount = userInput[1];
    const updatedStock = stockSystem.map((stock) => {
      if (stock.name === userInput[0] && stock.count >= orderCount) {
        return { ...stock, count: stock.count - orderCount };
      }
      return stock;
    });
    expect(updatedStock[0].count).toBe(7);
  });
});

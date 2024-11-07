import Stock from "../src/inventory/Stock.js";

const stockList = [
  {
    name: "콜라",
    price: 1000,
    quantity: 10,
    promotion: "탄산 2+1",
  },
];

describe("Stock 클래스 테스트", () => {
  test("Stock getter 테스트", () => {
    const stock = new Stock("콜라", 1000, 10, "탄산 2+1");
    const stockGet = stock.getDetails();

    expect(stockGet).toEqual(stockList[0]);
  });
});

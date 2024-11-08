import MarkdownToObjectReader from "../src/utils/MarkdownToObjectReader";
import path from "path";

describe("MarkdownToObjectReader 클래스 테스트", () => {
  test("prdocut.md 파일 읽어와 배열안의 각 항목이 오브젝트형식인지 확인", () => {
    const items = MarkdownToObjectReader.parseFile("products.md");
    const exampleItem = [
      { name: "콜라", price: 1000, quantity: 10, promotion: "탄산2+1" },
      { name: "콜라", price: 1000, quantity: 10, promotion: "null" },
      { name: "사이다", price: 1000, quantity: 8, promotion: "탄산2+1" },
      { name: "사이다", price: 1000, quantity: 7, promotion: "null" },
      { name: "오렌지주스", price: 1800, quantity: 9, promotion: "MD추천상품" }
    ];
    expect(items.slice(0, 5)).toEqual(exampleItem);
  });

  test("promotions.md 파일 읽어와 배열안의 각 항목이 오브젝트형식인지 확인", () => {
    const items = MarkdownToObjectReader.parseFile("promotions.md");
    const exampleItem = [
      { name: "탄산2+1", buy: 2, get: 1, start_date: "2024-01-01", end_date: "2024-12-31" },
      { name: "MD추천상품", buy: 1, get: 1, start_date: "2024-01-01", end_date: "2024-12-31" },
      { name: "반짝할인", buy: 1, get: 1, start_date: "2024-11-01", end_date: "2024-11-30" }
    ];
    expect(items.slice(0, 5)).toEqual(exampleItem);
  });
});

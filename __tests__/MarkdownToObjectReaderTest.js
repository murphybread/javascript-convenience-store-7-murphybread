import MarkdownToObjectReader from "../src/utils/MarkdownToObjectReader";
import path from "path";

describe("MarkdownToObjectReader 클래스 테스트", () => {
  test("prdocut.md 파일 읽어와 배열안의 각 항목이 오브젝트형식인지 확인", () => {
    const directoryPath = path.join(__dirname, "../public/");
    const items = MarkdownToObjectReader.product(directoryPath, "products.md");
    const exampleItem = [
      { name: "콜라", price: 1000, quantity: 10, promotion: "탄산2+1" },
      { name: "콜라", price: 1000, quantity: 10, promotion: "null" },
      { name: "사이다", price: 1000, quantity: 8, promotion: "탄산2+1" },
      { name: "사이다", price: 1000, quantity: 7, promotion: "null" },
      { name: "오렌지주스", price: 1800, quantity: 9, promotion: "MD추천상품" },
    ];
    expect(items.slice(0, 5)).toEqual(exampleItem);
  });
});

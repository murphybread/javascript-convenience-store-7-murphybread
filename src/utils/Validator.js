class Validator {
  static number(value) {
    if (typeof value !== "number" || value <= 0 || !Number.isInteger(value)) {
      throw new Error("[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.");
    }
  }
  static stockName(name) {
    if (typeof name !== "string" || name.trim() === "" || name.length > 50) {
      throw new Error("[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.");
    }
  }
}
export default Validator;

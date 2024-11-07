class Stock {
  #name;
  #price;
  #count;
  #promotionType;

  constructor(name, price, count, promotionType) {
    this.#name = name;
    this.#price = price;
    this.#count = count;
    this.#promotionType = promotionType;
  }

  getDetails() {
    return {
      name: this.#name,
      price: this.#price,
      count: this.#count,
      promotionType: this.#promotionType,
    };
  }
}

export default Stock;

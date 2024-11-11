class MembershipDiscount {
  constructor(active) {
    this.active = active;
  }

  isActive() {
    return this.active;
  }

  static calculateDiscount(normalStockList) {
    let normalPrice = 0;

    for (let stock of normalStockList) {
      normalPrice += stock.price * stock.quantity;
    }
    return Math.min(normalPrice * 0.3, 8000);
  }
}

export default MembershipDiscount;

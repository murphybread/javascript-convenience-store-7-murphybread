class MembershipDiscount {
  constructor(active) {
    this.active = active;
  }

  isActive() {
    return this.active;
  }

  calculateDiscount(normalStockList) {
    let normalPrice = 0;
    if (this.active) {
      for (let stock of normalStockList) {
        normalPrice += stock.price * stock.quantity;
      }
      return Math.min(normalPrice * 0.3, 8000);
    }
    return 0;
  }
}

export default MembershipDiscount;

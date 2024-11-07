class MembershipDiscount {
  constructor(active) {
    this.active = active;
  }

  isActive() {
    return this.active;
  }

  calculateDiscount(price) {
    if (this.active) {
      return Math.min(price * 0.3, 8000);
    }
    return 0;
  }
}

export default MembershipDiscount;

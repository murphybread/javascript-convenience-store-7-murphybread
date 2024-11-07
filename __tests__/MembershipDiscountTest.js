import MembershipDiscount from "../src/discounts/MembershipDiscount";
import { MEMBERSHIP_STATUS } from "../src/config/constants";

describe("MembershipDiscount 클래스", () => {
  test("멤버십 할인 케이스 N으로 입력 받은 경우 0원 반환", () => {
    const userMembershipAnswer = "N";
    const membership = new MembershipDiscount(MEMBERSHIP_STATUS[userMembershipAnswer]);

    expect(membership.isActive()).toBe(false); // 멤버십이 비활성화 되어야 함
  });

  test.each([
    [10000, 3000],
    [27000, 8000]
  ])("멤버십 할인 케이스 적용한 경우 값 %s 일 경우 그 30%인 %s반환 (최대 8000원)", (origianlPrice, discountPrice) => {
    const userMembershipAnswer = "Y";
    const membershipPrice = new MembershipDiscount(MEMBERSHIP_STATUS[userMembershipAnswer]).calculateDiscount(origianlPrice);

    expect(membershipPrice).toBe(discountPrice); // 멤버십이 비활성화 되어야 함
  });
});

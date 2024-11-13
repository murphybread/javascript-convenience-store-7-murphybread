import { MissionUtils } from "@woowacourse/mission-utils";
import DateUtils from "../src/utils/DateUtils";

describe("DateUtils 클래스", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("한국 날짜 UTC보다 +9시간반환", () => {
    const currentDate = new Date();

    const currentKoreaDate = DateUtils.getKoreaNow();

    expect(currentKoreaDate.getTime() - currentDate.getTime()).toBe(60 * 60 * 9 * 1000);
  });

  test("원하는 포맷  YYYY-MM-DD로 반환 예시 2024-11-07", () => {
    const fakeDate = new Date(2024, 10, 7); // 2024년 11월 7일
    jest.setSystemTime(fakeDate);

    const currentKoreaDate = DateUtils.getKoreaNow();

    const currentKoreaFormattedDate = DateUtils.getKoreaNowFormatted(currentKoreaDate);
    expect(currentKoreaFormattedDate).toBe("2024-11-07");
  });
});

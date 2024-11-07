import { MissionUtils } from "@woowacourse/mission-utils";

class DateUtils {
  static getKoreaNow() {
    const utcDate = MissionUtils.DateTimes.now();
    return new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  }
  static getKoreaNowFormatted(koreaDate) {
    return koreaDate.toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\./g, "").replace(/\s/g, "-");
  }
}

export default DateUtils;

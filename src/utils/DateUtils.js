import { MissionUtils } from "@woowacourse/mission-utils";

class DateUtils {
  static getKoreaNow() {
    const utcDate = MissionUtils.DateTimes.now();
    return new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  }
  static getKoreaNowFormatted(koreaDate) {
    return koreaDate.toISOString().split("T")[0];
  }
}

export default DateUtils;

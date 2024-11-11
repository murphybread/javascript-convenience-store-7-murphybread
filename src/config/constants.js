import path from "path";
import { fileURLToPath } from "url";

let __filename = "";
let __dirname = "";

try {
  // 'import.meta.url'을 런타임에 평가하여 구문 오류를 피합니다.
  const metaUrl = eval("import.meta.url");
  __filename = fileURLToPath(metaUrl);
  __dirname = path.dirname(__filename);
} catch (e) {
  // CommonJS 환경에서는 기존의 __filename과 __dirname을 사용합니다.
  __filename = typeof __filename !== "undefined" ? __filename : "";
  __dirname = typeof __dirname !== "undefined" ? __dirname : "";
}

export const MEMBERSHIP_STATUS = {
  Y: true,
  N: false,
  y: true,
  n: false
};

export const DIRECTORY_PATH = path.join(__dirname, "../../public/");
export const TEST_FILE = "products.md";

import path from "path";
import { fileURLToPath } from "url";

// let __dirname;

// try {
//   const __filename = fileURLToPath(eval('import.meta.url'));
//   __dirname = path.dirname(__filename);
// } catch (e) {
//   // Jest 환경에서는 CommonJS 모듈 시스템을 사용하므로 __dirname이 이미 정의되어 있습니다.
//   __dirname = __dirname || process.cwd();
// }

export const MEMBERSHIP_STATUS = {
  Y: true,
  N: false,
  y: true,
  n: false
};

export const DIRECTORY_PATH = path.join(process.cwd(),'public');
export const TEST_FILE = "products.md";

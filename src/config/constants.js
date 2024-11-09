import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const MEMBERSHIP_STATUS = {
  Y: true,
  N: false
};

export const DIRECTORY_PATH = path.join(__dirname, "../../public/");

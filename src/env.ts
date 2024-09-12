import { cleanEnv, host, port, str, url } from "envalid";
import { env as processEnv } from "node:process";

export const env = cleanEnv(processEnv, {
  ACCESS_TOKEN: str(),
  BASE_URL: url({
    default: "https://localhost:7777/api",
  }),
  HOST: host({
    default: "127.0.0.1",
  }),
  PORT: port({
    default: 9777,
  }),
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "production",
  }),
});

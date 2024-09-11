import { cleanEnv, host, num, port, str } from "envalid";
import { env as processEnv } from "node:process";

export const env = cleanEnv(processEnv, {
  ACCESS_TOKEN: str(),
  SCRAPE_INTERVAL: num({
    desc: "Interval in milliseconds to scrape the server state",
    default: 5000,
  }),
  HOST: host({
    default: "127.0.0.1",
  }),
  PORT: port({
    default: 3001,
  }),
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "production",
  }),
});

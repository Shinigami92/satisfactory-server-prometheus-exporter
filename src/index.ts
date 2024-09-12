import express from "express";
import { register } from "prom-client";
import { createClient } from "satisfactory-server-api-client";
import { env } from "./env.js";
import { registerGetAdvancedGameSettings } from "./metrics/advancedGameSettings.js";
import { registerServerGameStateMetrics } from "./metrics/serverGameState.js";

const app = express();

app.get("/", (req, res) => {
  res.send(`<html lang="en">
  <head>
    <title>Satisfactory Server Prometheus Exporter</title>
  </head>
  <body>
    <h1>Satisfactory Server Prometheus Exporter</h1>
    <p><a href="/metrics">Metrics</a></p>
  </body>
</html>
`);
});

// Disable SSL certificate validation
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const client = createClient({
  baseUrl: env.BASE_URL,
  accessToken: env.ACCESS_TOKEN,
});

registerGetAdvancedGameSettings(client);
registerServerGameStateMetrics(client);

app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.listen(env.PORT, env.HOST, () => {
  console.log(`Server running at http://${env.HOST}:${env.PORT}/`);
});

import express from "express";
import { Gauge, register } from "prom-client";
import { createClient } from "satisfactory-server-api-client";
import { env } from "./env.js";

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

const client = createClient({
  accessToken: env.ACCESS_TOKEN,
});

const gauge1 = new Gauge({
  name: "satisfactory_server_game_state_is_game_paused",
  help: "Is the game paused?",
});

setInterval(async () => {
  try {
    const { data } = await client.v1.QueryServerState();
    gauge1.set(data.serverGameState.isGamePaused ? 1 : 0);
  } catch {}
}, env.SCRAPE_INTERVAL);

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

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

new Gauge({
  name: "satisfactory_server_game_state_average_tick_rate",
  help: "Average tick rate of the server, in ticks per second",
  async collect() {
    try {
      const { data } = await client.v1.QueryServerState();
      this.set(data.serverGameState.averageTickRate);
    } catch {}
  },
});

new Gauge({
  name: "satisfactory_server_game_state_is_game_paused",
  help: "1 if the game is paused. If the game is paused, total game duration does not increase",
  async collect() {
    try {
      const { data } = await client.v1.QueryServerState();
      this.set(data.serverGameState.isGamePaused ? 1 : 0);
    } catch {}
  },
});

new Gauge({
  name: "satisfactory_server_game_state_is_game_running",
  help: "1 if the save is currently loaded, 0 if the server is waiting for the session to be created",
  async collect() {
    try {
      const { data } = await client.v1.QueryServerState();
      this.set(data.serverGameState.isGameRunning ? 1 : 0);
    } catch {}
  },
});

new Gauge({
  name: "satisfactory_server_game_state_num_connected_players",
  help: "Number of the players currently connected to the Dedicated Server",
  async collect() {
    try {
      const { data } = await client.v1.QueryServerState();
      this.set(data.serverGameState.numConnectedPlayers);
    } catch {}
  },
});

new Gauge({
  name: "satisfactory_server_game_state_player_limit",
  help: "Maximum number of the players that can be connected to the Dedicated Server",
  async collect() {
    try {
      const { data } = await client.v1.QueryServerState();
      this.set(data.serverGameState.playerLimit);
    } catch {}
  },
});

new Gauge({
  name: "satisfactory_server_game_state_tech_tier",
  help: "Maximum Tech Tier of all Schematics currently unlocked",
  async collect() {
    try {
      const { data } = await client.v1.QueryServerState();
      this.set(data.serverGameState.techTier);
    } catch {}
  },
});

new Gauge({
  name: "satisfactory_server_game_state_total_game_duration",
  help: "Total time the current save has been loaded, in seconds",
  async collect() {
    try {
      const { data } = await client.v1.QueryServerState();
      this.set(data.serverGameState.totalGameDuration);
    } catch {}
  },
});

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

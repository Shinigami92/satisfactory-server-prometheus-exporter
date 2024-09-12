import { Gauge } from "prom-client";
import type {
  Client,
  QueryServerStateResponseData,
} from "satisfactory-server-api-client";
import { memoFactory } from "../memo.js";

const memo = memoFactory<QueryServerStateResponseData>((client) =>
  client.v1.QueryServerState()
);

export function registerServerGameStateMetrics(client: Client) {
  const metrics = [];

  metrics.push(
    new Gauge({
      name: "satisfactory_server_game_state_average_tick_rate",
      help: "Average tick rate of the server, in ticks per second",
      async collect() {
        const data = await memo(client);
        this.set(data?.serverGameState.averageTickRate ?? 0);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_game_state_is_game_paused",
      help: "1 if the game is paused. If the game is paused, total game duration does not increase",
      async collect() {
        const data = await memo(client);
        this.set(data?.serverGameState.isGamePaused ? 1 : 0);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_game_state_is_game_running",
      help: "1 if the save is currently loaded, 0 if the server is waiting for the session to be created",
      async collect() {
        const data = await memo(client);
        this.set(data?.serverGameState.isGameRunning ? 1 : 0);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_game_state_num_connected_players",
      help: "Number of the players currently connected to the Dedicated Server",
      async collect() {
        const data = await memo(client);
        this.set(data?.serverGameState.numConnectedPlayers ?? 0);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_game_state_player_limit",
      help: "Maximum number of the players that can be connected to the Dedicated Server",
      async collect() {
        const data = await memo(client);
        this.set(data?.serverGameState.playerLimit ?? 0);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_game_state_tech_tier",
      help: "Maximum Tech Tier of all Schematics currently unlocked",
      async collect() {
        const data = await memo(client);
        this.set(data?.serverGameState.techTier ?? 0);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_game_state_total_game_duration",
      help: "Total time the current save has been loaded, in seconds",
      async collect() {
        const data = await memo(client);
        this.set(data?.serverGameState.totalGameDuration ?? 0);
      },
    })
  );

  return metrics;
}

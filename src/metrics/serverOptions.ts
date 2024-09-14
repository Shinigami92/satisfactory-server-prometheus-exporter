import { Gauge } from "prom-client";
import type {
  Client,
  GetServerOptionsResponseData,
} from "satisfactory-server-api-client";
import { memoFactory } from "../memo.js";

const memo = memoFactory<GetServerOptionsResponseData>((client) =>
  client.v1.GetServerOptions()
);

export function registerServerOptionsMetrics(client: Client) {
  const metrics = [];

  metrics.push(
    new Gauge({
      name: "satisfactory_server_options_auto_pause",
      help: "Whether auto pause is enabled in the server options",
      async collect() {
        const data = await memo(client);
        this.set(data.serverOptions["FG.DSAutoPause"] === "True" ? 1 : 0);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_options_auto_save_on_disconnect",
      help: "Whether auto save on disconnect is enabled in the server options",
      async collect() {
        const data = await memo(client);
        this.set(
          data.serverOptions["FG.DSAutoSaveOnDisconnect"] === "True" ? 1 : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_server_options_send_gameplay_data",
      help: "Whether sending gameplay data is enabled in the server options",
      async collect() {
        const data = await memo(client);
        this.set(data.serverOptions["FG.SendGameplayData"] === "True" ? 1 : 0);
      },
    })
  );

  return metrics;
}

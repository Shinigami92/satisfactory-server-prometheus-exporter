import { Gauge } from "prom-client";
import type {
  Client,
  HealthCheckResponseData,
} from "satisfactory-server-api-client";
import { memoFactory } from "../memo.js";

const memo = memoFactory<HealthCheckResponseData>((client) =>
  client.v1.HealthCheck({
    data: {
      clientCustomData: "",
    },
  })
);

export function registerHealthCheckMetrics(client: Client) {
  const metrics = [];

  metrics.push(
    new Gauge({
      name: "satisfactory_health_check_health",
      help: '1="healthy" if tick rate is above ten ticks per second, 0="slow" otherwise',
      async collect() {
        const data = await memo(client);
        this.set(data.health === "healthy" ? 1 : 0);
      },
    })
  );

  return metrics;
}

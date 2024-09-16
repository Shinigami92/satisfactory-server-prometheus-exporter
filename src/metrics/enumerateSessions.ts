import { Gauge } from "prom-client";
import type {
  Client,
  EnumerateSessionsResponseData,
  SaveHeader,
  SessionSaveStruct,
} from "satisfactory-server-api-client";
import { memoFactory } from "../memo.js";

const memo = memoFactory<EnumerateSessionsResponseData>((client) =>
  client.v1.EnumerateSessions()
);

function getCurrentSession(
  data: EnumerateSessionsResponseData
): SessionSaveStruct | undefined {
  return data.sessions[data.currentSessionIndex];
}

function getNewestSaveHeader(
  session: SessionSaveStruct
): SaveHeader | undefined {
  return session.saveHeaders.toSorted(
    (a, b) => b.playDurationSeconds - a.playDurationSeconds
  )[0];
}

export function registerEnumerateSessionsMetrics(client: Client) {
  const metrics = [];

  metrics.push(
    new Gauge({
      name: "satisfactory_current_session_save_version",
      help: "Version of the Save Game format the current session was saved with",
      async collect() {
        const data = await memo(client);
        const session = getCurrentSession(data);
        if (!session) {
          return;
        }
        const newestSaveHeader = getNewestSaveHeader(session);
        if (!newestSaveHeader) {
          return;
        }
        const saveVersion = newestSaveHeader.saveVersion;
        this.set(saveVersion);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_current_session_build_version",
      help: "Build version of the game or dedicated server the current session was saved by",
      async collect() {
        const data = await memo(client);
        const session = getCurrentSession(data);
        if (!session) {
          return;
        }
        const newestSaveHeader = getNewestSaveHeader(session);
        if (!newestSaveHeader) {
          return;
        }
        const buildVersion = newestSaveHeader.buildVersion;
        this.set(buildVersion);
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_current_session_last_saved",
      help: "Unix timestamp of when the current session was last saved",
      async collect() {
        const data = await memo(client);
        const session = getCurrentSession(data);
        if (!session) {
          return;
        }
        const newestSaveHeader = getNewestSaveHeader(session);
        if (!newestSaveHeader) {
          return;
        }
        const saveDateTime = newestSaveHeader.saveDateTime;
        const value = new Date(
          `${saveDateTime
            .replace("-", "T")
            .replace(".", "-")
            .replace(".", "-")
            .replace(".", ":")
            .replace(".", ":")}.000Z`
        );
        this.set(value.getTime() / 1000);
      },
    })
  );
  return metrics;
}

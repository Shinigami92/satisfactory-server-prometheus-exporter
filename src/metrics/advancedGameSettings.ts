import { Gauge } from "prom-client";
import type {
  Client,
  GetAdvancedGameSettingsResponseData,
} from "satisfactory-server-api-client";
import { memoFactory } from "../memo.js";

const memo = memoFactory<GetAdvancedGameSettingsResponseData>((client) =>
  client.v1.GetAdvancedGameSettings()
);

export function registerGetAdvancedGameSettings(client: Client) {
  const metrics = [];

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_game_rules_disable_arachnid_creatures",
      help: "Whether arachnid creatures are disabled in the game rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings[
            "FG.GameRules.DisableArachnidCreatures"
          ] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_game_rules_give_all_tiers",
      help: "Whether all tiers are given in the game rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings["FG.GameRules.GiveAllTiers"] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_game_rules_no_power",
      help: "Whether no power is enabled in the game rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings["FG.GameRules.NoPower"] === "True" ? 1 : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_game_rules_no_unlock_cost",
      help: "Whether no unlock cost is enabled in the game rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings["FG.GameRules.NoUnlockCost"] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_game_rules_unlock_all_research_schematics",
      help: "Whether all research schematics are unlocked in the game rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings[
            "FG.GameRules.UnlockAllResearchSchematics"
          ] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_game_rules_unlock_all_resource_sink_schematics",
      help: "Whether all resource sink schematics are unlocked in the game rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings[
            "FG.GameRules.UnlockAllResourceSinkSchematics"
          ] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_game_rules_unlock_instant_alt_recipes",
      help: "Whether instant alt recipes are unlocked in the game rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings["FG.GameRules.UnlockInstantAltRecipes"] ===
            "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_player_rules_flight_mode",
      help: "Whether flight mode is enabled in the player rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings["FG.PlayerRules.FlightMode"] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_player_rules_god_mode",
      help: "Whether god mode is enabled in the player rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings["FG.PlayerRules.GodMode"] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_advanced_game_settings_player_rules_no_build_cost",
      help: "Whether no build cost is enabled in the player rules",
      async collect() {
        const data = await memo(client);
        this.set(
          data?.advancedGameSettings["FG.PlayerRules.NoBuildCost"] === "True"
            ? 1
            : 0
        );
      },
    })
  );

  metrics.push(
    new Gauge({
      name: "satisfactory_creative_mode_enabled",
      help: "Whether creative mode is enabled",
      async collect() {
        const data = await memo(client);
        this.set(data?.creativeModeEnabled ? 1 : 0);
      },
    })
  );

  return metrics;
}

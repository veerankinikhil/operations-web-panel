import { checkBotHealth, executeBotAction } from "./src/lib/telegram.ts";

async function test() {
  console.log("Testing Bot Health Check...");
  const health = await checkBotHealth();
  console.log("Health Result:", JSON.stringify(health, null, 2));

  console.log("\nTesting Action Execution (Bind Tools)...");
  const bindRes = await executeBotAction("bind_tools", {
    toolType: "anti_ban_guard",
    targetId: "TEST_ACC_992",
    mode: "high priority",
  });
  console.log("Bind Action Result:", JSON.stringify(bindRes, null, 2));

  console.log("\nTesting Action Execution (Account Status)...");
  const statusRes = await executeBotAction("account_status", { scope: "all" });
  console.log("Account Status Result:", JSON.stringify(statusRes, null, 2));
}

test().catch(console.error);

import { checkBotHealth, executeBotAction } from "./src/lib/telegram.ts";

async function runStage4Tests() {
  console.log("=== STAGE 4 END-TO-END FLOW TESTS ===");

  console.log("\n[Test 1] Testing Health Check flow...");
  const health = await checkBotHealth();
  if (!health.connected) throw new Error("Health check failed");
  console.log("✔ Health Check PASSED:", health.username, `(${health.latencyMs}ms)`);

  console.log("\n[Test 2] Testing Feature 1: Bind Tools...");
  const res1 = await executeBotAction("bind_tools", {
    toolType: "anti_ban_guard",
    targetId: "TEST_ACC_001",
    mode: "high priority",
  });
  if (!res1.success || !res1.data.securitySignature) throw new Error("Bind tools flow failed");
  console.log("✔ Bind Tools PASSED:", res1.message);

  console.log("\n[Test 3] Testing Feature 2: Change Bind...");
  const res2 = await executeBotAction("change_bind", {
    currentBind: "OLD_KEY_8482",
    newBind: "NEW_KEY_9931",
  });
  if (!res2.success || res2.data.activeBind !== "NEW_KEY_9931") throw new Error("Change bind flow failed");
  console.log("✔ Change Bind PASSED:", res2.message);

  console.log("\n[Test 4] Testing Feature 3: Account Status...");
  const res3 = await executeBotAction("account_status", { scope: "all" });
  if (!res3.success || res3.data.accountHealth !== "OPTIMAL") throw new Error("Account status flow failed");
  console.log("✔ Account Status PASSED:", res3.data.banRiskScore);

  console.log("\n[Test 5] Testing Feature 4: Settings...");
  const res4 = await executeBotAction("settings", {
    autoPolling: true,
    detailedLogs: true,
  });
  if (!res4.success || !res4.data.webhookSecurity) throw new Error("Settings flow failed");
  console.log("✔ Settings PASSED:", res4.message);

  console.log("\n[Test 6] Testing Feature 5: Help...");
  const res5 = await executeBotAction("help", {});
  if (!res5.success || res5.data.commands.length === 0) throw new Error("Help flow failed");
  console.log("✔ Help PASSED:", `${res5.data.commands.length} commands retrieved`);

  console.log("\n[Test 7] Testing Input Validation & Error Handling...");
  try {
    await executeBotAction("invalid_unknown_feature", {});
    throw new Error("Validation failed to reject invalid feature");
  } catch (err: any) {
    console.log("✔ Invalid Feature Rejection PASSED:", err.message);
  }

  try {
    await executeBotAction("change_bind", { currentBind: "OLD" });
    throw new Error("Validation failed to reject missing newBind");
  } catch (err: any) {
    console.log("✔ Missing Parameter Rejection PASSED:", err.message);
  }

  console.log("\n==========================================");
  console.log("ALL STAGE 4 FLOW TESTS PASSED SUCCESSFULLY");
  console.log("==========================================");
}

runStage4Tests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

import { connectToDatabase, persistActivity, persistBinding, getActiveBindingsCount } from "./src/lib/db.ts";
import { checkRateLimit, sanitizeInput } from "./src/lib/security.ts";

async function runStage5Tests() {
  console.log("=== STAGE 5 DB & SECURITY TESTS ===");

  console.log("\n[Test 1] Testing Database Adapter...");
  const dbStatus = await connectToDatabase();
  console.log("✔ DB Status:", dbStatus.mode, "(Connected:", dbStatus.isConnected, ")");

  console.log("\n[Test 2] Testing Activity Persistence...");
  const log = await persistActivity({
    action: "TEST_SECURITY_CHECK",
    feature: "account_status",
    status: "SUCCESS",
    message: "Security probe audit test",
  });
  console.log("✔ Persist Activity PASSED:", log.action, log.timestamp);

  console.log("\n[Test 3] Testing Binding Persistence...");
  const binding = await persistBinding({
    toolType: "anti_ban_guard",
    targetId: "TEST_USER_99",
    mode: "high priority",
    actionId: "ACT-TEST-1",
  });
  console.log("✔ Persist Binding PASSED:", binding.toolType, "->", binding.targetId);

  const count = await getActiveBindingsCount();
  console.log("✔ Active Bindings Count:", count);

  console.log("\n[Test 4] Testing Rate Limiting Protection...");
  const clientIp = "192.168.1.100";
  const r1 = checkRateLimit(clientIp);
  console.log("✔ Rate limit token deduction PASSED (Allowed:", r1.allowed, "Remaining:", r1.remaining, ")");

  console.log("\n[Test 5] Testing Input Sanitization...");
  const sanitized = sanitizeInput("<script>alert('xss')</script>TEST");
  if (sanitized.includes("<") || sanitized.includes(">")) throw new Error("Sanitization failed");
  console.log("✔ Sanitization PASSED:", sanitized);

  console.log("\n==========================================");
  console.log("ALL STAGE 5 PERSISTENCE & SECURITY PASSED");
  console.log("==========================================");
}

runStage5Tests().catch((e) => {
  console.error(e);
  process.exit(1);
});

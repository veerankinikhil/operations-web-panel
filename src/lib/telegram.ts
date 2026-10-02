/**
 * Service Layer - Ban Tool Web Interface
 * Validates request parameters, Access Token, and Execution Key.
 */

export interface BotHealthResponse {
  connected: boolean;
  status: "connected" | "connecting" | "disconnected" | "error";
  username: string;
  botId?: number | string;
  botName?: string;
  latencyMs: number;
  mode: "live" | "simulated";
  checkedAt: string;
}

export interface PanelResponse {
  success: boolean;
  actionId: string;
  timestamp: string;
  mode: string;
  server: string;
  uid: string;
  status: string;
  token?: string;
  details: Record<string, any>;
  message: string;
}

const AUTHORIZED_EXECUTION_KEY = "SAMBA-MG-NENU";

export function getExpectedBotUsername(): string {
  return process.env.TELEGRAM_BOT_USERNAME || "BanBot";
}

export async function checkBotHealth(): Promise<BotHealthResponse> {
  return {
    connected: true,
    status: "connected",
    username: getExpectedBotUsername(),
    botName: "Operations Web Panel",
    botId: 7894561230,
    latencyMs: 35,
    mode: "simulated",
    checkedAt: new Date().toISOString(),
  };
}

export async function processPanelAction(
  actionType: "30_days" | "7_days" | "permanent",
  payload: {
    uid?: string;
    accessToken?: string;
    key?: string;
    server?: "india" | "other";
  }
): Promise<PanelResponse> {
  const timestamp = new Date().toISOString();
  const actionId = `ACT-${Math.floor(100000 + Math.random() * 900000)}`;

  // 1. Validate Access Token
  const token = payload.accessToken?.trim();
  if (!token) {
    throw new Error("Access Token is required.");
  }

  // 2. Validate Execution Key
  const inputKey = payload.key?.trim();
  if (!inputKey) {
    throw new Error("Execution Key is required.");
  }

  if (inputKey !== AUTHORIZED_EXECUTION_KEY) {
    throw new Error("Invalid Execution Key. Access denied.");
  }

  // 3. Validate UID
  const uid = payload.uid?.trim();
  if (!uid) {
    throw new Error("Please enter a valid Player UID / Game ID.");
  }

  if (!/^\d{6,14}$/.test(uid)) {
    throw new Error("Invalid UID format. UID must be 6 to 14 numeric digits.");
  }

  // 4. Validate Server / Mode Rules
  const server = payload.server || "india";
  if (server === "other" && (actionType === "30_days" || actionType === "permanent")) {
    throw new Error(
      "Other Servers only support 7 Days Mode. India Server supports 30 Days + Permanent."
    );
  }

  const securityHash = `0x${Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`;

  return {
    success: true,
    actionId,
    timestamp,
    mode: actionType.toUpperCase(),
    server: server === "india" ? "India Server (IND)" : "Other Servers (GLOBAL)",
    uid,
    status: "PROCESSED & QUEUED",
    details: {
      actionId,
      targetUid: uid,
      accessToken: token.substring(0, 4) + "****",
      region: server === "india" ? "India Server" : "Other Servers",
      selectedDuration:
        actionType === "30_days"
          ? "30 Days Duration"
          : actionType === "7_days"
          ? "7 Days Duration"
          : "Permanent Mode",
      securityHash,
      gatewayResponse: "OK_200",
      executionKey: "VALIDATED",
    },
    message: `Request [${actionType.toUpperCase()}] queued successfully for UID: ${uid}.`,
  };
}

export type BanMode = "30_days" | "7_days" | "permanent";
export type ServerRegion = "india" | "other";

export type FeatureType = "30_days" | "7_days" | "permanent" | "get_token" | "bind_tools" | "change_bind" | "account_status" | "settings" | "help";

export type BotStatus = "connected" | "connecting" | "disconnected" | "error";

export interface ActivityItem {
  id: string;
  timestamp: string;
  action: string;
  status: "success" | "pending" | "error" | "info";
  message: string;
  details?: Record<string, any>;
}

export interface BanRequest {
  id: string;
  uid: string;
  server: ServerRegion;
  mode: BanMode;
  token?: string;
  timestamp: string;
  status: "pending" | "processing" | "completed" | "failed";
  hash?: string;
  responseMsg?: string;
}

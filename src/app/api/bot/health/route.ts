import { NextResponse } from "next/server";
import { checkBotHealth } from "@/lib/telegram";

export async function GET() {
  try {
    const health = await checkBotHealth();
    return NextResponse.json(health, { status: health.connected ? 200 : 503 });
  } catch (error: any) {
    return NextResponse.json(
      {
        connected: false,
        status: "error",
        error: error.message || "Failed to perform health check",
        checkedAt: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

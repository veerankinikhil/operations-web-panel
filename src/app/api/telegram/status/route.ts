import { NextResponse } from "next/server";
import { checkBotHealth, getExpectedBotUsername } from "@/lib/telegram";
import { connectToDatabase, getActiveBindingsCount } from "@/lib/db";

export async function GET() {
  try {
    const health = await checkBotHealth();
    const dbStatus = await connectToDatabase();
    const bindingsCount = await getActiveBindingsCount();

    return NextResponse.json({
      success: true,
      botUsername: getExpectedBotUsername(),
      health,
      database: {
        connected: dbStatus.isConnected,
        mode: dbStatus.mode,
      },
      activeBindingsCount: bindingsCount,
      hasCustomToken: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch bot status",
      },
      { status: 500 }
    );
  }
}

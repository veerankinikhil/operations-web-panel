import { NextRequest, NextResponse } from "next/server";
import { processPanelAction } from "@/lib/telegram";
import { persistActivity } from "@/lib/db";
import { checkRateLimit, sanitizeInput } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "127.0.0.1";
    const rateCheck = checkRateLimit(ip);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Rate limit reached. Please wait a few seconds before retrying.",
        },
        { status: 429 }
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const body = sanitizeInput(rawBody);
    const { actionType, payload = {} } = body;

    if (!actionType) {
      return NextResponse.json(
        { success: false, error: "Missing actionType" },
        { status: 400 }
      );
    }

    const result = await processPanelAction(actionType, payload);

    await persistActivity({
      action: actionType.toUpperCase(),
      feature: actionType,
      status: "SUCCESS",
      message: result.message,
      details: result.details,
      ip,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process request",
      },
      { status: 400 }
    );
  }
}

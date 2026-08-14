import { NextResponse } from "next/server";
import { getAllTickerMessages } from "@/server/services/apiFetcherService";

export async function GET() {
  try {
    const messages = await getAllTickerMessages();

    return NextResponse.json({ messages, timestamp: Date.now() });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

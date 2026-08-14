import { NextResponse } from "next/server";
import { getOrFetchData } from "@/server/services/apiFetcherService";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sourceId: string }> },
) {
  try {
    const { sourceId } = await params;

    const result = await getOrFetchData(sourceId);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    return NextResponse.json({ error: errorMessage }, { status: 429 });
  }
}

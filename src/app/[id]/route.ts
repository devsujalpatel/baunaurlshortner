import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { urlsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ⬅️ await is required

  const [result] = await db
    .select({ targetUrl: urlsTable.targetUrl })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, id));

  if (!result) {
    return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
  }

  return NextResponse.redirect(result.targetUrl);
}

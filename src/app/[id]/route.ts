import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { urlsTable } from "@/models/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const [result] = await db
    .select({ targetUrl: urlsTable.targetUrl })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, id));

  if (!result) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(result.targetUrl, { status: 301 });
}

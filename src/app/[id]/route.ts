import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { urlsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Catch all short links like /abc123
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const [result] = await db
    .select({
      targetUrl: urlsTable.targetUrl,
    })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, params.id));

  if (!result) {
    return NextResponse.json({ error: "Short URL not found" }, { status: 404 });
  }

  // Redirect user to original URL
  return NextResponse.redirect(result.targetUrl);
}

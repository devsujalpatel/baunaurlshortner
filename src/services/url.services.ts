import { db } from "@/db/db";
import { urlsTable } from "@/models/schema";
import { eq } from "drizzle-orm";

export async function getUrlByShortCode(shortCode: string) {
  try {
    const [url] = await db
      .select({
        id: urlsTable.id,
        shortCode: urlsTable.shortCode,
        targetUrl: urlsTable.targetUrl,
      })
      .from(urlsTable)
      .where(eq(urlsTable.shortCode, shortCode));

    return url;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createShorten(
  shortCode: string,
  url: string,
  userId: string
) {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode,
      targetUrl: url,
      userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetUrl: urlsTable.targetUrl,
    });

  return result;
}

import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const urlsTable = pgTable("urls", {
  id: uuid("id").primaryKey(),

  shortCode: varchar("code", { length: 155 }).notNull().unique(),
  targetUrl: text("target_url").notNull(),

  userId: uuid("user_id")
    .references(() => user.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

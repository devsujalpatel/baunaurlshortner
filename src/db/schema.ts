import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: text("first_name").notNull(),
  lastname: text("last_name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const urlsTable = pgTable("urls", {
  id: uuid("id").primaryKey().defaultRandom(),

  shortCode: varchar("code", { length: 155 }).notNull().unique(),
  targetUrl: text("target_url").notNull(),

  userId: uuid("user_id")
    .references(() => userTable.id)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
});

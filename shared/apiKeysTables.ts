import { pgTable, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// API Keys Management System
export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull().default("general"),
  description: text("description"),
  encryptedKey: text("encrypted_key"),
  encryptionIv: text("encryption_iv"),
  encryptionTag: text("encryption_tag"),
  isActive: boolean("is_active").default(false),
  required: boolean("required").default(false),
  encrypted: boolean("encrypted").default(true),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Zod Schemas
export const insertApiKeySchema = createInsertSchema(apiKeys);
export const selectApiKeySchema = createInsertSchema(apiKeys);

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type SelectApiKey = z.infer<typeof selectApiKeySchema>;
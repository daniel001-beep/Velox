import {
  pgTable,
  text,
  timestamp,
  integer,
  numeric,
  uuid,
  jsonb,
  boolean,
  primaryKey,
  serial,
  doublePrecision,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AdapterAccountType } from "next-auth/adapters";

// --- NextAuth Tables ---

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  isAdmin: boolean("isAdmin").default(false),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- Store Tables (Aligned with Seed Route) ---

export const products = pgTable("product", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("imageurl").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("createdat").defaultNow(),
});

export const reviews = pgTable("review", {
  id: serial("id").primaryKey(),
  productId: integer("productid").notNull().references(() => products.id, { onDelete: "cascade" }),
  userId: text("userid").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("createdat").defaultNow(),
});

// --- Fintech / Ledger Tables ---

export const transactions = pgTable("transaction", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  orderId: integer("order_id"),
  idempotencyKey: text("idempotency_key"),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  metadata: jsonb("metadata").default({}),
  lockedUntil: timestamp("locked_until"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const ledgerEntries = pgTable("ledger_entry", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id")
    .notNull()
    .references(() => transactions.id),
  userId: text("user_id").notNull(),
  accountType: text("account_type").notNull(),
  entryType: text("entry_type").notNull(),
  amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const auditLogs = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  eventType: text("event_type").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  changes: jsonb("changes"),
  changeHash: text("change_hash"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata").default({}),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const addressHistory = pgTable("address_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  street: text("street"),
  city: text("city"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow(),
});

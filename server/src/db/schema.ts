import { serial, text, pgTable, timestamp, integer, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums for status fields
export const messageStatusEnum = pgEnum('message_status', ['pending', 'sending', 'completed', 'failed']);
export const sendLogStatusEnum = pgEnum('send_log_status', ['success', 'failed']);

// Bot configurations table
export const botConfigsTable = pgTable('bot_configs', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  token: text('token').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Messages table
export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(),
  bot_id: integer('bot_id').notNull().references(() => botConfigsTable.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  target_recipients: jsonb('target_recipients').notNull(), // Store array of recipients as JSON
  repeat_count: integer('repeat_count').notNull(),
  status: messageStatusEnum('status').default('pending').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Message send logs table
export const messageSendLogsTable = pgTable('message_send_logs', {
  id: serial('id').primaryKey(),
  message_id: integer('message_id').notNull().references(() => messagesTable.id, { onDelete: 'cascade' }),
  recipient: text('recipient').notNull(),
  attempt_number: integer('attempt_number').notNull(),
  status: sendLogStatusEnum('status').notNull(),
  error_message: text('error_message'), // Nullable by default
  sent_at: timestamp('sent_at').defaultNow().notNull(),
});

// Relations
export const botConfigsRelations = relations(botConfigsTable, ({ many }) => ({
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one, many }) => ({
  botConfig: one(botConfigsTable, {
    fields: [messagesTable.bot_id],
    references: [botConfigsTable.id],
  }),
  sendLogs: many(messageSendLogsTable),
}));

export const messageSendLogsRelations = relations(messageSendLogsTable, ({ one }) => ({
  message: one(messagesTable, {
    fields: [messageSendLogsTable.message_id],
    references: [messagesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type BotConfig = typeof botConfigsTable.$inferSelect;
export type NewBotConfig = typeof botConfigsTable.$inferInsert;
export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;
export type MessageSendLog = typeof messageSendLogsTable.$inferSelect;
export type NewMessageSendLog = typeof messageSendLogsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { 
  botConfigs: botConfigsTable, 
  messages: messagesTable, 
  messageSendLogs: messageSendLogsTable 
};
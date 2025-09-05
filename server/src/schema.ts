import { z } from 'zod';

// Bot configuration schema
export const botConfigSchema = z.object({
  id: z.number(),
  name: z.string(),
  token: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type BotConfig = z.infer<typeof botConfigSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.number(),
  bot_id: z.number(),
  content: z.string(),
  target_recipients: z.array(z.string()), // Array of chat IDs or usernames
  repeat_count: z.number().int().min(1),
  status: z.enum(['pending', 'sending', 'completed', 'failed']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Message = z.infer<typeof messageSchema>;

// Message send log schema
export const messageSendLogSchema = z.object({
  id: z.number(),
  message_id: z.number(),
  recipient: z.string(),
  attempt_number: z.number().int().min(1),
  status: z.enum(['success', 'failed']),
  error_message: z.string().nullable(),
  sent_at: z.coerce.date()
});

export type MessageSendLog = z.infer<typeof messageSendLogSchema>;

// Input schema for creating bot configuration
export const createBotConfigInputSchema = z.object({
  name: z.string().min(1),
  token: z.string().min(1)
});

export type CreateBotConfigInput = z.infer<typeof createBotConfigInputSchema>;

// Input schema for updating bot configuration
export const updateBotConfigInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1).optional(),
  token: z.string().min(1).optional()
});

export type UpdateBotConfigInput = z.infer<typeof updateBotConfigInputSchema>;

// Input schema for creating message
export const createMessageInputSchema = z.object({
  bot_id: z.number(),
  content: z.string().min(1),
  target_recipients: z.array(z.string().min(1)).min(1),
  repeat_count: z.number().int().min(1).max(100) // Limit to prevent spam
});

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;

// Input schema for updating message status
export const updateMessageStatusInputSchema = z.object({
  id: z.number(),
  status: z.enum(['pending', 'sending', 'completed', 'failed'])
});

export type UpdateMessageStatusInput = z.infer<typeof updateMessageStatusInputSchema>;

// Input schema for creating message send log
export const createMessageSendLogInputSchema = z.object({
  message_id: z.number(),
  recipient: z.string(),
  attempt_number: z.number().int().min(1),
  status: z.enum(['success', 'failed']),
  error_message: z.string().nullable().optional()
});

export type CreateMessageSendLogInput = z.infer<typeof createMessageSendLogInputSchema>;

// Input schema for getting message with logs
export const getMessageWithLogsInputSchema = z.object({
  id: z.number()
});

export type GetMessageWithLogsInput = z.infer<typeof getMessageWithLogsInputSchema>;
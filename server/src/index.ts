import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createBotConfigInputSchema,
  updateBotConfigInputSchema,
  createMessageInputSchema,
  updateMessageStatusInputSchema,
  getMessageWithLogsInputSchema,
  createMessageSendLogInputSchema
} from './schema';

// Import handlers
import { createBotConfig } from './handlers/create_bot_config';
import { getBotConfigs } from './handlers/get_bot_configs';
import { updateBotConfig } from './handlers/update_bot_config';
import { deleteBotConfig } from './handlers/delete_bot_config';
import { createMessage } from './handlers/create_message';
import { getMessages } from './handlers/get_messages';
import { getMessageWithLogs } from './handlers/get_message_with_logs';
import { sendMessage } from './handlers/send_message';
import { updateMessageStatus } from './handlers/update_message_status';
import { createMessageSendLog } from './handlers/create_message_send_log';
import { validateBotToken } from './handlers/validate_bot_token';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Bot configuration routes
  createBotConfig: publicProcedure
    .input(createBotConfigInputSchema)
    .mutation(({ input }) => createBotConfig(input)),

  getBotConfigs: publicProcedure
    .query(() => getBotConfigs()),

  updateBotConfig: publicProcedure
    .input(updateBotConfigInputSchema)
    .mutation(({ input }) => updateBotConfig(input)),

  deleteBotConfig: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteBotConfig(input.id)),

  // Bot token validation
  validateBotToken: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(({ input }) => validateBotToken(input.token)),

  // Message routes
  createMessage: publicProcedure
    .input(createMessageInputSchema)
    .mutation(({ input }) => createMessage(input)),

  getMessages: publicProcedure
    .query(() => getMessages()),

  getMessageWithLogs: publicProcedure
    .input(getMessageWithLogsInputSchema)
    .query(({ input }) => getMessageWithLogs(input)),

  sendMessage: publicProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(({ input }) => sendMessage(input.messageId)),

  updateMessageStatus: publicProcedure
    .input(updateMessageStatusInputSchema)
    .mutation(({ input }) => updateMessageStatus(input)),

  // Message send log routes
  createMessageSendLog: publicProcedure
    .input(createMessageSendLogInputSchema)
    .mutation(({ input }) => createMessageSendLog(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
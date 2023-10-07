import { z } from 'zod';

export const ConversationRequest = z.object({
  prompt: z.string(),
});

export type ConversationRequestType = z.infer<typeof ConversationRequest>;

export const ConversationResponse = z.object({
  errorCauseAndCorrectiveAction: z.string(),
  modifiedCode: z.string().optional(),
});

export type ConversationResponseType = z.infer<typeof ConversationResponse>;
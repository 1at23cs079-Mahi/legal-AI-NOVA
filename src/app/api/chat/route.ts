
'use server';

import { nextJSStream } from '@genkit-ai/next/server';
import { chatWithTools } from '@/ai/flows/chat';

export const POST = async (req: Request) => {
  const json = await req.json();
  return nextJSStream(json, chatWithTools);
};

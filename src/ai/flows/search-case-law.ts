'use server';

/**
 * @fileOverview An AI agent for searching case law using a RAG model.
 *
 * - searchCaseLaw - A function that handles the case law search process.
 * - SearchCaseLawInput - The input type for the searchCaseLaw function.
 * - SearchCaseLawOutput - The return type for the searchCaseLaw function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SearchCaseLawInputSchema = z.object({
  query: z.string().describe('The search query for case law.'),
  filters: z
    .object({
      court: z.string().optional().describe('Filter by court name.'),
      judge: z.string().optional().describe('Filter by judge name.'),
      year: z.number().optional().describe('Filter by year.'),
      subject: z.string().optional().describe('Filter by subject matter.'),
    })
    .optional(),
});
export type SearchCaseLawInput = z.infer<typeof SearchCaseLawInputSchema>;

const CaseLawSchema = z.object({
  id: z.number().describe('Unique identifier for the case.'),
  title: z.string().describe('The title of the case.'),
  citation: z.string().describe('The legal citation for the case.'),
  court: z.string().describe('The court that heard the case.'),
  date: z.string().describe('The date the judgment was delivered (DD/MM/YYYY).'),
  summary: z.string().describe('A brief summary of the case.'),
  status: z.enum(['Landmark', 'Recent', 'Overruled']).describe('The status of the case law.'),
});
export type CaseLaw = z.infer<typeof CaseLawSchema>;


const SearchCaseLawOutputSchema = z.object({
  results: z.array(CaseLawSchema).describe('A list of case law search results.'),
});
export type SearchCaseLawOutput = z.infer<typeof SearchCaseLawOutputSchema>;

export async function searchCaseLaw(
  input: SearchCaseLawInput
): Promise<SearchCaseLawOutput> {
  return searchCaseLawFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchCaseLawPrompt',
  input: { schema: SearchCaseLawInputSchema },
  output: { schema: SearchCaseLawOutputSchema },
  prompt: `You are a legal research assistant performing a Retrieval-Augmented Generation (RAG) task.
  You have already retrieved the most relevant documents from a comprehensive database of Indian case law based on the user's query and filters.
  Your task is to synthesize these retrieved results into a clear, structured list for the user.

  User Query: {{{query}}}

  {{#if filters}}
  Filters:
  {{#if filters.court}}- Court: {{{filters.court}}}{{/if}}
  {{#if filters.judge}}- Judge: {{{filters.judge}}}{{/if}}
  {{#if filters.year}}- Year: {{{filters.year}}}{{/if}}
  {{#if filters.subject}}- Subject: {{{filters.subject}}}{{/if}}
  {{/if}}

  Based on the (simulated) retrieved documents, generate a list of the top 5 most relevant cases. For each case, provide all the required fields.
  Determine the status of the case (Landmark, Recent, or Overruled) based on its significance and history.
  `,
});

const searchCaseLawFlow = ai.defineFlow(
  {
    name: 'searchCaseLawFlow',
    inputSchema: SearchCaseLawInputSchema,
    outputSchema: SearchCaseLawOutputSchema,
  },
  async (input) => {
    // This flow simulates a RAG model.
    // In a real application, you would first query a vector database (e.g., Pinecone, Chroma)
    // to retrieve relevant document chunks, and then pass them to the LLM.
    // For this prototype, we ask the LLM to generate results as if it has already performed retrieval.
    const { output } = await prompt(input);
    return output!;
  }
);

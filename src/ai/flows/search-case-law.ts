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
import { searchCaseLawDatabase } from '@/services/legal-search';

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

const searchCaseLawFlow = ai.defineFlow(
  {
    name: 'searchCaseLawFlow',
    inputSchema: SearchCaseLawInputSchema,
    outputSchema: SearchCaseLawOutputSchema,
  },
  async (input) => {
    // This flow simulates a RAG model.
    // 1. Retrieve relevant documents from our "database".
    const searchResults = await searchCaseLawDatabase(input.query, input.filters);

    // 2. If we have results, we can just return them directly.
    // An alternative approach would be to pass the results to an LLM
    // to synthesize a summary or answer, but for a structured search
    // result, returning the data directly is often better.
    return {
      results: searchResults,
    };
  }
);

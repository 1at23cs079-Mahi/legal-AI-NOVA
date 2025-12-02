
'use server';

/**
 * @fileOverview An AI agent for drafting legal petitions.
 *
 * - draftLegalPetition - A function that handles the petition drafting process.
 * - DraftLegalPetitionInput - The input type for the draftLegalPetition function.
 * - DraftLegalPetitionOutput - The return type for the draftLegalPetition function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftLegalPetitionInputSchema = z.object({
  query: z.string().describe('The details of the legal petition to draft.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user.'),
});
export type DraftLegalPetitionInput = z.infer<typeof DraftLegalPetitionInputSchema>;

const DraftLegalPetitionOutputSchema = z.object({
  draft: z.string().describe('The draft of the legal petition, formatted with proper headings, sections, and placeholders for copy-pasting into a document editor.'),
});
export type DraftLegalPetitionOutput = z.infer<typeof DraftLegalPetitionOutputSchema>;

export async function draftLegalPetition(input: DraftLegalPetitionInput): Promise<DraftLegalPetitionOutput> {
  return draftLegalPetitionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftLegalPetitionPrompt',
  input: {schema: DraftLegalPetitionInputSchema},
  output: {schema: DraftLegalPetitionOutputSchema},
  prompt: `You are LegalAi, an AI assistant specialized in drafting legal petitions for the Indian legal system. Your task is to generate a clean, well-formatted, and ready-to-use draft of a legal petition based on the user's request.

User Role: {{{userRole}}}

Drafting Request: {{{query}}}

**Instructions for Drafting:**
1.  **Structure and Formatting**: Create a formal legal petition structure. Use clear headings for different sections like "IN THE COURT OF [Court Name]", "PETITION UNDER [Relevant Section/Article]", "PARTIES", "MOST RESPECTFULLY SHOWETH:", "PRAYER", etc.
2.  **Placeholders**: Use clear, bracketed placeholders for all case-specific details that the user must fill in (e.g., "[Client's Name]", "[Address]", "[Date]", "[Name of Petitioner]", "[Name of Respondent]").
3.  **Content Generation**: Based on the user's query, generate the core factual narrative and legal grounds. Write in formal legal language.
4.  **Whitespace and Alignment**: Use line breaks and indentation to ensure the document is perfectly aligned and readable. The final output should be formatted so it can be directly copied and pasted into a text editor or word processor without losing its structure.
5.  **Role-Based Customization**:
    - For an 'Advocate', the draft should be formal, comprehensive, and ready for court filing, with detailed legal arguments and placeholders for evidence.
    - For a 'Student', the draft should be well-structured with annotations explaining the purpose of each clause, serving as a learning tool.
    - For a 'Public' user, the draft should be a simplified pro-forma template with very clear explanations for each section and what information is needed.
6.  **DO NOT INCLUDE DISCLAIMERS**: Your entire response should be only the legal draft itself. Do not add any introductory text, concluding remarks, or disclaimers. The output must be the raw, formatted petition.
  `,
});

const draftLegalPetitionFlow = ai.defineFlow(
  {
    name: 'draftLegalPetitionFlow',
    inputSchema: DraftLegalPetitionInputSchema,
    outputSchema: DraftLegalPetitionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

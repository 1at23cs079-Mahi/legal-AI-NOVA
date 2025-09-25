
'use server';

/**
 * @fileOverview A document analysis AI agent that annotates clauses, suggests redline edits,
 * and provides matching precedent for each flagged clause in a legal document using a RAG model.
 *
 * - analyzeDocumentAndSuggestEdits - A function that handles the document analysis process.
 * - AnalyzeDocumentAndSuggestEditsInput - The input type for the analyzeDocumentAndSuggestEdits function.
 * - AnalyzeDocumentAndSuggestEditsOutput - The return type for the analyzeDocumentAndSuggestEdits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { searchCaseLawDatabase } from '@/services/legal-search';

const AnalyzeDocumentAndSuggestEditsInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A legal document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. Supported file types: PDF, DOCX, TXT."
    ),
});
export type AnalyzeDocumentAndSuggestEditsInput = z.infer<
  typeof AnalyzeDocumentAndSuggestEditsInputSchema
>;

const AnalysisResultSchema = z.object({
    annotatedClauses: z.string().describe("A summary of the key clauses identified in the document."),
    suggestedEdits: z.string().describe("Specific redline edits suggested for the flagged clauses. Provide actionable and clear suggestions."),
    matchingPrecedent: z.string().describe("Relevant legal precedents that match or support the suggested edits for each flagged clause, found using the provided search tool."),
});

const AnalyzeDocumentAndSuggestEditsOutputSchema = z.object({
  analysisResults: z
    .string()
    .describe(
      'A JSON string containing the analysis results. The JSON object should have three keys: "annotatedClauses", "suggestedEdits", and "matchingPrecedent".'
    ),
});
export type AnalyzeDocumentAndSuggestEditsOutput = z.infer<
  typeof AnalyzeDocumentAndSuggestEditsOutputSchema
>;

export async function analyzeDocumentAndSuggestEdits(
  input: AnalyzeDocumentAndSuggestEditsInput
): Promise<AnalyzeDocumentAndSuggestEditsOutput> {
  return analyzeDocumentAndSuggestEditsFlow(input);
}

const legalSearch = ai.defineTool(
    {
      name: 'legalSearch',
      description: 'Search for relevant legal documents and case law from the knowledge base to find precedents.',
      inputSchema: z.object({
        query: z.string().describe('A specific search query about legal topics, cases, or statutes to find supporting precedents.'),
      }),
      outputSchema: z.object({
        results: z.array(z.object({
            source: z.string().describe('The document source or case citation.'),
            content: z.string().describe('The content or summary of the document.'),
        })),
      }),
    },
    async (input) => {
        const searchResults = await searchCaseLawDatabase(input.query);
        return {
            results: searchResults.map(c => ({
                source: c.citation,
                content: c.summary,
            }))
        };
    }
);


const analyzeDocumentAndSuggestEditsPrompt = ai.definePrompt({
  name: 'analyzeDocumentAndSuggestEditsPrompt',
  input: {schema: AnalyzeDocumentAndSuggestEditsInputSchema},
  output: {schema: z.object({ analysisResults: AnalysisResultSchema }) },
  tools: [legalSearch],
  prompt: `You are an expert legal analyst. Your task is to perform a Retrieval-Augmented Generation (RAG) analysis on the provided legal document.

Document to Analyze: {{media url=documentDataUri}}

Please perform the following actions in a two-step process:
1.  **Analyze and Identify**: First, carefully review the document to identify key clauses, potential risks, and areas for improvement. Focus on liability, termination, payment terms, and intellectual property.

2.  **Retrieve and Synthesize**: For each clause you identify as potentially problematic or ambiguous, use the 'legalSearch' tool to find relevant legal precedents or statutes from the knowledge base.

3.  **Generate Output**: Based on your analysis and the retrieved information, generate the final output. Your suggestions MUST be supported by the precedents you find.

    - **Annotate Clauses**: Summarize the key clauses identified.
    - **Suggest Redline Edits**: Suggest specific, clear edits for problematic clauses.
    - **Find Matching Precedent**: Provide the relevant legal precedents retrieved from the 'legalSearch' tool that support your recommendations. Cite the sources.

Return your entire analysis as a single JSON object with the keys "annotatedClauses", "suggestedEdits", and "matchingPrecedent". Do not include any other text or formatting in your response.

**Disclaimer**: The analysis provided is for informational purposes only and does not constitute legal advice. It is an automated review and may contain errors or omissions. Always consult with a qualified legal professional for advice on your specific situation. LegalAI is not liable for any actions taken based on this analysis.
`,
});

const analyzeDocumentAndSuggestEditsFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentAndSuggestEditsFlow',
    inputSchema: AnalyzeDocumentAndSuggestEditsInputSchema,
    outputSchema: AnalyzeDocumentAndSuggestEditsOutputSchema,
  },
  async input => {
    if (!input.documentDataUri) {
        throw new Error('A document must be provided for analysis.');
    }
    const {output} = await analyzeDocumentAndSuggestEditsPrompt(input);
    if (!output) {
        throw new Error('The model did not return a valid analysis.');
    }
    return {
        analysisResults: JSON.stringify(output.analysisResults),
    };
  }
);


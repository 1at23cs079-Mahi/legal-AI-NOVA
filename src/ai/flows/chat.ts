'use server';

/**
 * @fileOverview A conversational AI agent for legal queries.
 *
 * - chat - A function that handles conversational legal queries.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { draftLegalPetition, DraftLegalPetitionInput } from './draft-legal-petition';
import { summarizeLegalDocument, SummarizeLegalDocumentInput } from './summarize-legal-document';
import { generateCaseTimeline, GenerateCaseTimelineInput } from './generate-case-timeline';
import { analyzeDocumentAndSuggestEdits, AnalyzeDocumentAndSuggestEditsInput } from './analyze-document-and-suggest-edits';
import { searchCaseLaw, SearchCaseLawInput, SearchCaseLawOutput } from './search-case-law';
import { translateText, TranslateTextInput } from './translate-text';
import { transcribeAudio, TranscribeAudioInput } from './transcribe-audio';

export type ChatInput = z.infer<typeof ChatInputSchema>;
const ChatInputSchema = z.object({
  message: z.string().describe('The user message'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
  userRole: z
    .enum(['Advocate', 'Student', 'Public'])
    .describe('The role of the user.'),
  documentDataUri: z.string().optional().describe('A document for analysis or summarization, as a data URI.'),
  audioDataUri: z.string().optional().describe('An audio file for transcription, as a data URI.'),
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;
const ChatOutputSchema = z.object({
  role: z.literal('model'),
  content: z.string().describe('The model\'s response.'),
  citations: z.array(z.string()).optional().describe('Relevant citations.'),
  analysisResults: z.string().optional().describe('The analysis results for a document.'),
  timeline: z.string().optional().describe('A timeline of events.'),
  searchResult: z.any().optional().describe('The search result'),
});

function getCommand(message: string): { command: string | null; text: string } {
    const commandRegex = /^\/(\w+)\s*(.*)/;
    const match = message.match(commandRegex);
    if (match) {
        return { command: match[1].toLowerCase(), text: match[2] };
    }
    return { command: null, text: message };
}


export async function chat(input: ChatInput): Promise<ChatOutput> {
  let response: Partial<ChatOutput> = {};
  const { command, text } = getCommand(input.message);

  switch (command) {
    case 'draft':
      const draftInput: DraftLegalPetitionInput = { query: text, userRole: input.userRole };
      const draftOutput = await draftLegalPetition(draftInput);
      response = { content: draftOutput.draft, citations: draftOutput.citations };
      break;
    case 'summarize':
      if (!input.documentDataUri) throw new Error('Document required for summarization.');
      const summarizeInput: SummarizeLegalDocumentInput = { documentDataUri: input.documentDataUri };
      const summarizeOutput = await summarizeLegalDocument(summarizeInput);
      response = { content: summarizeOutput.summary, citations: summarizeOutput.citations };
      break;
    case 'timeline':
      const timelineInput: GenerateCaseTimelineInput = { caseDetails: text };
      const timelineOutput = await generateCaseTimeline(timelineInput);
      response = { content: timelineOutput.timeline, timeline: timelineOutput.timeline };
      break;
    case 'analyze':
      if (!input.documentDataUri) throw new Error('Document required for analysis.');
      const analyzeInput: AnalyzeDocumentAndSuggestEditsInput = { documentDataUri: input.documentDataUri };
      const analyzeOutput = await analyzeDocumentAndSuggestEdits(analyzeInput);
      response = { content: analyzeOutput.analysisResults, analysisResults: analyzeOutput.analysisResults };
      break;
    case 'search':
        const searchInput: SearchCaseLawInput = { query: text };
        const searchOutput = await searchCaseLaw(searchInput);
        response = { content: `Found ${searchOutput.results.length} cases.`, searchResult: searchOutput };
        break;
    case 'translate':
        const translateRegex = /^(to\s*)?(\w+)\s*(.*)/i;
        const translateMatch = text.match(translateRegex);
        if(!translateMatch) throw new Error('Invalid translate command. Use /translate to <language> <text>');
        const targetLanguage = translateMatch[2];
        const textToTranslate = translateMatch[3];
        const translateInput: TranslateTextInput = { text: textToTranslate, targetLanguage };
        const translateOutput = await translateText(translateInput);
        response = { content: translateOutput.translatedText };
        break;
    case 'transcribe':
        if (!input.audioDataUri) throw new Error('Audio file required for transcription.');
        const transcribeInput: TranscribeAudioInput = { audioDataUri: input.audioDataUri };
        const transcribeOutput = await transcribeAudio(transcribeInput);
        response = { content: transcribeOutput.transcript };
        break;
    default:
        const { text: chatText } = await ai.generate({
            prompt: `You are LegalAi, a RAG-based AI assistant. Your responses must be grounded in your fine-tuned knowledge of Indian law and the provided conversation history.
            User role: ${input.userRole}.
            Conversation History:
            ${input.history?.map(h => `${h.role}: ${h.content}`).join('\n') || ''}
            User: ${input.message}
            LegalAi:`,
        });
        response = { content: chatText };
  }

  return { role: 'model', ...response, content: response.content || "Sorry, I couldn't process that request." };
}

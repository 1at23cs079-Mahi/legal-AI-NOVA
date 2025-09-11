'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  History,
  Scale,
  FileUp,
  Loader2,
  Share2,
  Copy,
  Download,
  Mic,
  Settings,
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  draftLegalPetition,
  DraftLegalPetitionInput,
} from '@/ai/flows/draft-legal-petition';
import {
  summarizeLegalDocument,
  SummarizeLegalDocumentInput,
} from '@/ai/flows/summarize-legal-document';
import {
  generateCaseTimeline,
  GenerateCaseTimelineInput,
} from '@/ai/flows/generate-case-timeline';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type AiTask =
  | 'draft-petition'
  | 'summarize-document'
  | 'generate-timeline'
  | 'analyze-document';

export default function CaseManagementPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AiTask>('draft-petition');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const getRole = () => {
    const role = searchParams.get('role');
    if (role === 'advocate') return 'Advocate';
    if (role === 'student') return 'Student';
    return 'Public';
  };

  const executeTask = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      let response;
      if (activeTab === 'draft-petition') {
        const input: DraftLegalPetitionInput = {
          query: inputText,
          userRole: getRole(),
        };
        response = await draftLegalPetition(input);
      } else if (
        activeTab === 'summarize-document' ||
        activeTab === 'analyze-document'
      ) {
        if (!file) {
          toast({
            variant: 'destructive',
            title: 'No file selected',
            description: 'Please upload a document to proceed.',
          });
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        const dataUri = await new Promise<string>(resolve => {
          reader.onload = e => resolve(e.target?.result as string);
        });

        if (activeTab === 'summarize-document') {
          const input: SummarizeLegalDocumentInput = { documentDataUri: dataUri };
          response = await summarizeLegalDocument(input);
        } else {
          // Placeholder for analyze-document
          toast({ title: 'Coming Soon!', description: 'Document analysis feature is under development.'})
          response = { analysisResults: "Document analysis feature is not yet implemented."};
        }

      } else if (activeTab === 'generate-timeline') {
        const input: GenerateCaseTimelineInput = { caseDetails: inputText };
        response = await generateCaseTimeline(input);
      }
      setResult(response);
    } catch (error) {
      console.error('AI task failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Failed to complete the request. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (activeTab) {
      case 'draft-petition':
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Drafted Petition</h3>
            <pre className="bg-muted p-4 rounded-md whitespace-pre-wrap font-sans text-sm">
              {result.draft}
            </pre>
            <h3 className="text-lg font-semibold mt-4 mb-2">Citations</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {result.citations.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        );
      case 'summarize-document':
         return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-sm whitespace-pre-wrap">{result.summary}</p>
            <h3 className="text-lg font-semibold mt-4 mb-2">Citations</h3>
             <ul className="list-disc pl-5 space-y-1 text-sm">
              {result.citations.map((c: string, i: number) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        );
      case 'generate-timeline':
         return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Case Timeline</h3>
            <p className="text-sm whitespace-pre-wrap">{result.timeline}</p>
          </div>
        );
       case 'analyze-document':
         return (
            <div>
                <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
                <p className="text-sm">{result.analysisResults}</p>
            </div>
         )
      default:
        return null;
    }
  };

  const getTabContent = (tab: AiTask) => {
    switch (tab) {
      case 'draft-petition':
      case 'generate-timeline':
        return (
          <Textarea
            placeholder={
              tab === 'draft-petition'
                ? 'Describe the petition you want to draft...'
                : 'Enter case details to generate a timeline...'
            }
            className="min-h-[150px] text-base"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />
        );
      case 'summarize-document':
      case 'analyze-document':
        return (
          <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center h-[150px]">
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <label
              htmlFor="file-upload"
              className="mt-4 text-sm font-medium text-primary hover:underline cursor-pointer"
            >
              {file ? file.name : 'Click to upload a document'}
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, TXT up to 10MB
            </p>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.docx,.txt"
            />
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="lg:sticky top-24">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Case Management
          </CardTitle>
          <CardDescription>
            Your AI-powered legal assistant for research, drafting, and analysis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={value => {
              setActiveTab(value as AiTask);
              setResult(null);
              setInputText('');
              setFile(null);
            }}
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
              <TabsTrigger value="draft-petition" className="flex-col h-auto py-2">
                <FileText className="h-5 w-5 mb-1" /> Draft
              </TabsTrigger>
              <TabsTrigger value="summarize-document" className="flex-col h-auto py-2">
                <Scale className="h-5 w-5 mb-1" /> Summarize
              </TabsTrigger>
              <TabsTrigger value="generate-timeline" className="flex-col h-auto py-2">
                <History className="h-5 w-5 mb-1" /> Timeline
              </TabsTrigger>
               <TabsTrigger value="analyze-document" className="flex-col h-auto py-2">
                <Scale className="h-5 w-5 mb-1" /> Analyze
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">{getTabContent(activeTab)}</div>
          </Tabs>

          <div className="mt-4 space-y-2">
            <Label>Mode</Label>
            <Select defaultValue="case-review">
              <SelectTrigger>
                <SelectValue placeholder="Select a mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opinion">Opinion</SelectItem>
                <SelectItem value="case-review">Case Review</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-4">
          <div className="flex items-center gap-2">
             <Button
                onClick={executeTask}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Processing...' : 'Generate'}
              </Button>
              <Button variant="outline" size="icon"><Mic/></Button>
              <Button variant="outline" size="icon"><Settings/></Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            ⚖ LegalAi Disclaimer: This is not legal advice. Please consult a licensed advocate for legal decisions.
          </p>

        </CardFooter>
      </Card>

      <Card className="min-h-[60vh]">
        <CardHeader className="flex flex-row items-center justify-between">
           <CardTitle className="font-headline text-2xl">Output</CardTitle>
           {result && (
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}><Copy className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon"><Download className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon"><Share2 className="h-4 w-4"/></Button>
            </div>
           )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Your request is being processed...
              </p>
            </div>
          ) : result ? (
            renderResult()
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[40vh] text-center p-8">
              <Scale className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground">
                Your results will appear here.
              </h3>
              <p className="text-sm text-muted-foreground/80 mt-1">
                Select a task and provide the necessary input to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

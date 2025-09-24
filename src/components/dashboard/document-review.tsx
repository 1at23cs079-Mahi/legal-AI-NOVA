
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  Copy,
  UploadCloud,
  X,
  FileCheck2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { analyzeDocumentAndSuggestEdits } from '@/ai/flows/analyze-document-and-suggest-edits';
import { ScrollArea } from '@/components/ui/scroll-area';

type AnalysisResult = {
  annotatedClauses: string;
  suggestedEdits: string;
  matchingPrecedent: string;
};

export function DocumentReview() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      // Limit file size to 10MB
      if (files[0].size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 10MB.',
        });
        return;
      }
      setFile(files[0]);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const executeAnalysis = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a document to analyze.',
      });
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      const dataUri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const response = await analyzeDocumentAndSuggestEdits({ documentDataUri: dataUri });
      const parsedResults = JSON.parse(response.analysisResults);

      setAnalysisResult({
        annotatedClauses: parsedResults.annotatedClauses || "No clauses annotated.",
        suggestedEdits: parsedResults.suggestedEdits || "No edits suggested.",
        matchingPrecedent: parsedResults.matchingPrecedent || "No matching precedent found.",
      });

    } catch (error: any) {
      console.error('Document analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message ||
          'Failed to complete the analysis. The model may have returned an unexpected format. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      description: 'Copied to clipboard!',
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col gap-6">
        <Card
          className={`flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed transition-colors duration-300 ${
            isDragging ? 'border-primary bg-primary/10' : 'border-border'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Upload your document
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag and drop or click to browse.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-6"
              >
                <label htmlFor="file-upload">
                  Browse File
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </label>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <FileCheck2 className="w-12 h-12 text-green-500" />
              <p className="mt-4 font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => setFile(null)}
              >
                <X className="w-4 h-4 mr-2" />
                Remove File
              </Button>
            </div>
          )}
        </Card>
        <Button
          onClick={executeAnalysis}
          disabled={!file || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Document'
          )}
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
          <Card className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Analyzing document...</p>
            </div>
          </Card>
        ) : analysisResult ? (
          <>
            <Card className="flex-1 flex flex-col">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Annotated Clauses</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(analysisResult.annotatedClauses)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                <ScrollArea className="h-full">
                  <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert">
                    <p>{analysisResult.annotatedClauses}</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card className="flex-1 flex flex-col">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Suggested Redline Edits</CardTitle>
                 <Button variant="ghost" size="icon" onClick={() => handleCopy(analysisResult.suggestedEdits)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                 <ScrollArea className="h-full">
                   <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert">
                    <p>{analysisResult.suggestedEdits}</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
             <Card className="flex-1 flex flex-col">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Matching Precedent</CardTitle>
                 <Button variant="ghost" size="icon" onClick={() => handleCopy(analysisResult.matchingPrecedent)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1">
                 <ScrollArea className="h-full">
                   <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert">
                    <p>{analysisResult.matchingPrecedent}</p>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>Your analysis results will appear here.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

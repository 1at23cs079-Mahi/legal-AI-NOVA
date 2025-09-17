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
import { Textarea } from '@/components/ui/textarea';
import {
  FileText,
  Loader2,
  Copy,
  UploadCloud,
  X,
  FileCheck2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { summarizeLegalDocument } from '@/ai/flows/summarize-legal-document';
import { analyzeDocumentAndSuggestEdits } from '@/ai/flows/analyze-document-and-suggest-edits';

type AnalysisResult = {
  content: string;
  citations?: string[];
};

export function DocumentReview() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [reviewType, setReviewType] = useState<'summarize' | 'analyze'>(
    'summarize'
  );
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
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

  const executeReview = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a document to review.',
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

      let response: any;
      if (reviewType === 'summarize') {
        response = await summarizeLegalDocument({ documentDataUri: dataUri });
        setAnalysisResult({
          content: response.summary,
          citations: response.citations,
        });
      } else {
        response = await analyzeDocumentAndSuggestEdits({
          documentDataUri: dataUri,
        });
        setAnalysisResult({
          content: response.analysisResults,
        });
      }
    } catch (error: any) {
      console.error('Document review failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message ||
          'Failed to complete the document review. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (analysisResult) {
      navigator.clipboard.writeText(analysisResult.content);
      toast({
        description: 'Copied to clipboard!',
      });
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
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
              <UploadCloud className="w-16 h-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                Upload your document
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Drag and drop your file here, or click to browse.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supports PDF, DOCX, TXT, and image files.
              </p>
              <Button
                asChild
                variant="outline"
                className="mt-6"
              >
                <label htmlFor="file-upload-review">
                  Browse File
                  <input
                    id="file-upload-review"
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  />
                </label>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center text-center">
              <FileCheck2 className="w-16 h-16 text-green-500" />
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
        <div className="flex items-center gap-4">
          <Select
            value={reviewType}
            onValueChange={(v) => setReviewType(v as 'summarize' | 'analyze')}
            disabled={isLoading}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select review type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summarize">Summarize Document</SelectItem>
              <SelectItem value="analyze">Analyze & Suggest Edits</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={executeReview}
            disabled={!file || isLoading}
            className="w-48"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Review Document'
            )}
          </Button>
        </div>
      </div>
      <div className="flex flex-col">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className='space-y-1'>
                <CardTitle>Analysis Result</CardTitle>
                <CardDescription>
                { !analysisResult && !isLoading ? 'Your document analysis will appear here.' : ''}
                </CardDescription>
            </div>
            {analysisResult && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="h-full">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : analysisResult ? (
              <div className="prose prose-sm max-w-none text-sm text-foreground h-[calc(100vh_-_20rem)] overflow-y-auto">
                <p>{analysisResult.content}</p>
                {analysisResult.citations &&
                  analysisResult.citations.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-xs mb-1">Citations</h4>
                      <ul className="list-disc pl-5 space-y-1 text-xs">
                        {analysisResult.citations.map(
                          (c: string, i: number) => (
                            <li key={i}>{c}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

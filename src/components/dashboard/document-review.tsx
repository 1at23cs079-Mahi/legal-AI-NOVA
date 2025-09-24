
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Loader2,
  Copy,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export function LegalTerminology() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [term, setTerm] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);

  const explainTerm = async () => {
    if (!term.trim()) {
      toast({
        variant: 'destructive',
        title: 'No term entered',
        description: 'Please enter a legal term to explain.',
      });
      return;
    }

    setIsLoading(true);
    setExplanation(null);

    try {
      const response = await translateText({ text: `Explain the legal term "${term}" in simple, easy-to-understand language.`, targetLanguage: 'English' });
      setExplanation(response.translatedText);

    } catch (error: any) {
      console.error('Explanation failed:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          error.message ||
          'Failed to get an explanation. Please try again.',
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
      <div className="flex flex-col gap-4">
        <Card>
            <CardHeader>
                <CardTitle>Explain Legal Terminology</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Legal Term</label>
                    <Textarea 
                        placeholder="e.g., 'Res Judicata', 'Caveat Emptor'"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                </div>
                <Button
                    onClick={explainTerm}
                    disabled={isLoading}
                    className="w-full"
                    >
                    {isLoading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Explaining...
                        </>
                    ) : (
                        'Explain Term'
                    )}
                </Button>
            </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Explanation</CardTitle>
              {explanation && (
                <Button variant="ghost" size="icon" onClick={() => handleCopy(explanation)}>
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1">
                <ScrollArea className="h-full w-full">
                    {isLoading ? (
                         <div className="flex h-full items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Generating explanation...</p>
                            </div>
                        </div>
                    ) : explanation ? (
                        <div className="prose prose-sm max-w-none text-sm text-foreground dark:prose-invert whitespace-pre-wrap">
                           {explanation}
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <div className="text-center text-muted-foreground">
                            <p>The explanation for your term will appear here.</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}

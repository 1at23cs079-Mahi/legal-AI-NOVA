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
import { Input } from '@/components/ui/input';
import {
  Search as SearchIcon,
  Filter,
  Loader2,
  Book,
  Landmark,
  Scale,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  searchCaseLaw,
  SearchCaseLawInput,
  CaseLaw,
} from '@/ai/flows/search-case-law';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function CaseLawSearchPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    court: '',
    judge: '',
    year: '',
    subject: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CaseLaw[]>([]);

  const handleSearch = async () => {
    setIsLoading(true);
    setResults([]);
    try {
      const input: SearchCaseLawInput = {
        query: searchQuery,
        filters: {
          court: filters.court || undefined,
          judge: filters.judge || undefined,
          year: filters.year ? parseInt(filters.year) : undefined,
          subject: filters.subject || undefined,
        },
      };
      const response = await searchCaseLaw(input);
      setResults(response.results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: 'An error occurred while searching for case law.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Case Law Search
          </CardTitle>
          <CardDescription>
            Search through millions of judgments from the Supreme Court, High
            Courts, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by case name, citation, keyword..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <SearchIcon className="mr-2 h-4 w-4" />
                )}
                Search
              </Button>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="filters">
                <AccordionTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced Filters
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                    <Select
                      value={filters.court}
                      onValueChange={value => handleFilterChange('court', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Court" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Supreme Court of India">
                          Supreme Court
                        </SelectItem>
                        <SelectItem value="Delhi High Court">
                          Delhi High Court
                        </SelectItem>
                        <SelectItem value="Bombay High Court">
                          Bombay High Court
                        </SelectItem>
                        <SelectItem value="NCLAT">NCLAT</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="text"
                      placeholder="Judge Name"
                      value={filters.judge}
                      onChange={e => handleFilterChange('judge', e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Year"
                      value={filters.year}
                      onChange={e => handleFilterChange('year', e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Subject / Keywords"
                      value={filters.subject}
                      onChange={e =>
                        handleFilterChange('subject', e.target.value)
                      }
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case Title & Citation</TableHead>
                  <TableHead>Court</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map(result => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="font-medium hover:underline">
                        <Link href="#">{result.title}</Link>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.citation}
                      </div>
                    </TableCell>
                    <TableCell>{result.court}</TableCell>
                    <TableCell>{result.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          result.status === 'Landmark'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {result.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Book className="mx-auto h-12 w-12 mb-4" />
              <p>No results found. Try a different search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

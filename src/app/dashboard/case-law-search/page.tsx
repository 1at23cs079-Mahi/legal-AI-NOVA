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
  FileText,
  Search as SearchIcon,
  Filter,
  Book,
  Scale,
  Landmark,
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

const searchResults = [
  {
    id: 1,
    title: 'Kesavananda Bharati vs. State of Kerala',
    citation: 'AIR 1973 SC 1461',
    court: 'Supreme Court of India',
    date: '24/04/1973',
    summary:
      'Established the basic structure doctrine of the Indian Constitution.',
    status: 'Landmark',
  },
  {
    id: 2,
    title: 'Maneka Gandhi vs. Union of India',
    citation: 'AIR 1978 SC 597',
    court: 'Supreme Court of India',
    date: '25/01/1978',
    summary:
      'Widened the interpretation of Article 21, introducing due process.',
    status: 'Landmark',
  },
  {
    id: 3,
    title: 'Shayara Bano vs. Union of India',
    citation: '(2017) 9 SCC 1',
    court: 'Supreme Court of India',
    date: '22/08/2017',
    summary: 'Declared the practice of Triple Talaq unconstitutional.',
    status: 'Recent',
  },
  {
    id: 4,
    title: 'Justice K.S. Puttaswamy (Retd.) vs. Union of India',
    citation: '(2017) 10 SCC 1',
    court: 'Supreme Court of India',
    date: '24/08/2017',
    summary: 'Affirmed the right to privacy as a fundamental right.',
    status: 'Landmark',
  },
];

export default function CaseLawSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
                />
              </div>
              <Button>
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Court" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sc">Supreme Court</SelectItem>
                  <SelectItem value="hc">High Courts</SelectItem>
                  <SelectItem value="tribunals">Tribunals</SelectItem>
                </SelectContent>
              </Select>
              <Input type="text" placeholder="Judge Name" />
              <Input type="text" placeholder="Year" />
              <Input type="text" placeholder="Subject" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
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
              {searchResults.map(result => (
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
                        result.status === 'Landmark' ? 'default' : 'secondary'
                      }
                    >
                      {result.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

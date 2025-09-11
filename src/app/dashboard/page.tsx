'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Briefcase,
  Search as SearchIcon,
  FileText,
  Clock,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type QuickAccessTileProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
};

function QuickAccessTile({
  title,
  description,
  icon: Icon,
  href,
}: QuickAccessTileProps) {
  return (
    <Link href={href} className="block hover:bg-muted/50 rounded-lg">
      <Card className="h-full transition-all border-border hover:border-primary">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
          <div className="bg-primary/10 p-3 rounded-full">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg font-headline">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'user';
  const caseManagementUrl = `/dashboard/case-management?${searchParams.toString()}`;
  const caseLawSearchUrl = `/dashboard/case-law-search?${searchParams.toString()}`;

  const recentActivities = [
    {
      action: 'Drafted a new petition',
      details: 'Civil Suit for Recovery',
      time: '2 hours ago',
    },
    {
      action: 'Searched for case law',
      details: '"Anticipatory bail under Section 438"',
      time: '5 hours ago',
    },
    {
      action: 'Summarized a document',
      details: 'Lease_Agreement_Final.pdf',
      time: '1 day ago',
    },
    {
      action: 'Translated text',
      details: 'To Hindi',
      time: '2 days ago',
    },
  ];

  return (
    <div className="flex-1 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          Welcome to LegalAi, {role.charAt(0).toUpperCase() + role.slice(1)}
        </h2>
        <p className="text-muted-foreground">
          Your AI-powered legal assistant for India is ready to help.
        </p>
      </div>

      <div>
        <h3 className="text-xl font-semibold font-headline mb-4">
          Quick Access
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <QuickAccessTile
            title="Case Management"
            description="Draft petitions, summarize documents, and manage your cases with AI."
            icon={Briefcase}
            href={caseManagementUrl}
          />
          <QuickAccessTile
            title="Case Law Search"
            description="Explore millions of judgments from Indian courts with RAG-powered search."
            icon={SearchIcon}
            href={caseLawSearchUrl}
          />
          <QuickAccessTile
            title="Document Analysis"
            description="Upload and analyze legal documents for clauses, precedents, and redlines."
            icon={FileText}
            href={caseManagementUrl} // Points to the same chat UI
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold font-headline mb-4">
          Recent Activity
        </h3>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-muted rounded-full p-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.details}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { AssistantChat } from '@/components/dashboard/assistant-chat';
import { DocumentReview } from '@/components/dashboard/document-review';

export default function CaseManagementPage() {
  return (
    <div className="flex flex-col h-[calc(100vh_-_6rem)]">
      <Tabs defaultValue="assistant" className="flex-1 flex flex-col">
        <div className="flex justify-center pt-4">
          <TabsList>
            <TabsTrigger value="assistant">Assistant</TabsTrigger>
            <TabsTrigger value="review">Document Review</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="assistant" className="flex-1 flex flex-col">
          <AssistantChat />
        </TabsContent>
        <TabsContent value="review" className="flex-1 flex flex-col">
          <DocumentReview />
        </TabsContent>
      </Tabs>
    </div>
  );
}

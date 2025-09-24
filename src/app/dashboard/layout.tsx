
'use client';
import React, { useState, type ReactNode } from 'react';
import {
  Sidebar,
  SidebarBody,
  SidebarHeader,
  SidebarHeaderAction,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader, type ModelId } from '@/components/dashboard/header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [selectedLlm, setSelectedLlm] = useState<ModelId>('googleai/gemini-1.5-pro');

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <div className="flex flex-col flex-1">
          <DashboardHeader selectedLlm={selectedLlm} setSelectedLlm={setSelectedLlm} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {React.cloneElement(children as React.ReactElement, { selectedLlm })}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

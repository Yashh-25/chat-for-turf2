'use client';
import * as React from 'react';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CreateGroupDialog } from '@/components/groups/create-group-dialog';
import { Plus, Users } from 'lucide-react';

export function DashboardLayout({ sidebar, children }: { sidebar: React.ReactNode, children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen bg-background">
        <Sidebar collapsible="icon" className="max-w-[280px]">
          <SidebarHeader className="p-4 items-center flex justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">Turf Talk</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
             <Button variant="outline" className="w-full justify-start gap-2 mb-4" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">New Group</span>
              </Button>
            {sidebar}
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <div className="md:hidden p-2 border-b flex items-center gap-2">
            <SidebarTrigger />
            <h2 className="font-semibold text-lg">Turf Talk</h2>
          </div>
          {children}
        </main>
      </div>
      <CreateGroupDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </SidebarProvider>
  );
}

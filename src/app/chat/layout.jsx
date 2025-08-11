import { DashboardLayout } from '@/components/dashboard-layout';
import { GroupList } from '@/components/groups/group-list';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function GroupListSkeleton() {
  return (
    <div className="p-2 space-y-2">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-1">
        {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}


export default function ChatLayout({
  children,
}) {
  return (
    <DashboardLayout sidebar={
      <Suspense fallback={<GroupListSkeleton />}>
        <GroupList />
      </Suspense>
    }>
      {children}
    </DashboardLayout>
  );
}

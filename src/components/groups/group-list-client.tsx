'use client';

import * as React from 'react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { Group } from '@/types';
import { useSidebar } from '@/components/ui/sidebar';


function GroupListItem({ group }: { group: Group }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const isActive = pathname === `/chat/${group.id}`;

  return (
    <SidebarMenuItem key={group.id} onClick={() => setOpenMobile(false)}>
      <Link href={`/chat/${group.id}`} passHref>
        <SidebarMenuButton isActive={isActive} className="w-full justify-start gap-3" tooltip={group.name}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20">
                <Users className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span className="truncate">{group.name}</span>
        </SidebarMenuButton>
      </Link>
    </SidebarMenuItem>
  );
}


export function GroupListClient({ groups }: { groups: Group[] }) {
  return (
    <SidebarMenu>
      {groups.map((group) => (
        <GroupListItem key={group.id} group={group} />
      ))}
    </SidebarMenu>
  );
}

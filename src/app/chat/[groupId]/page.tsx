import { ChatLayout } from '@/components/chat/chat-layout';
import { getGroupByIdAction, getUserByIdAction, getUsersAction } from '@/lib/actions';
import { notFound } from 'next/navigation';
import { Group, User } from '@/types';
import { Suspense } from 'react';

function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
       <div className="p-4 border-b bg-card h-[77px]"></div>
       <div className="flex-1 p-6"></div>
       <div className="p-4 border-t bg-card/80 backdrop-blur-sm h-[68px]"></div>
    </div>
  )
}

async function ChatPageContent({ groupId }: { groupId: string }) {
  const group = await getGroupByIdAction(groupId);
  const currentUser = await getUserByIdAction('user-1'); // Assume user-1 is current user
  
  if (!group || !currentUser) {
    notFound();
  }
  
  // Fetch all users once
  const allUsers = await getUsersAction();

  // Create a map for quick lookups
  const userMap = new Map(allUsers.map(u => [u.id, u]));

  // Ensure currentUser and all members are in the list for the chat layout
  const requiredUserIds = new Set([...group.members, currentUser.id]);
  const chatUsers = Array.from(requiredUserIds)
    .map(id => userMap.get(id))
    .filter((user): user is User => !!user);
  
  return (
      <ChatLayout group={group as Group} currentUser={currentUser} users={chatUsers} />
  );
}


export default async function ChatPage({ params }: { params: { groupId: string } }) {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatPageContent groupId={params.groupId} />
    </Suspense>
  )
}

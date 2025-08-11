'use client';

import * as React from 'react';
import { Group, User } from '@/types';
import { MessageList } from './message-list';
import { ChatInput } from './chat-input';
import { Button } from '@/components/ui/button';
import { Bot, Calendar, Users, Wallet, UserPlus, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BookingDialog } from './booking-dialog';
import { SplitPaymentDialog } from './split-payment-dialog';
import { AddMemberDialog } from './add-member-dialog';
import { GroupInfoSheet } from './group-info-sheet';
import { AiAssistantSheet } from './ai-assistant-sheet';
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';

export function ChatLayout({ group, currentUser, users }: { group: Group, currentUser: User, users: User[] }) {
  const [bookingDialogOpen, setBookingDialogOpen] = React.useState(false);
  const [splitPaymentDialogOpen, setSplitPaymentDialogOpen] = React.useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = React.useState(false);
  const [groupInfoSheetOpen, setGroupInfoSheetOpen] = React.useState(false);
  const [aiAssistantSheetOpen, setAiAssistantSheetOpen] = React.useState(false);

  const { isMobile } = useSidebar();
  const isHost = group.hostId === currentUser.id;

  const groupMembers = React.useMemo(() => {
    return users.filter(user => group.members.includes(user.id));
  }, [users, group.members]);


  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center p-3 md:p-4 border-b bg-card">
        {isMobile && (
          <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link href="/">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to groups</span>
            </Link>
          </Button>
        )}
        <button className="flex items-center gap-3 text-left flex-1" onClick={() => setGroupInfoSheetOpen(true)}>
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20">
              <Users className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-lg">{group.name}</h2>
            <p className="text-sm text-muted-foreground">{groupMembers.length} members</p>
          </div>
        </button>
        <div className="ml-auto flex items-center gap-1 md:gap-2">
           <Button onClick={() => setAiAssistantSheetOpen(true)} variant="outline" size="sm" className="hidden md:inline-flex">
              <Bot className="mr-2 h-4 w-4" />
              Talk to AI
            </Button>
           {isHost && (
             <Button onClick={() => setAddMemberDialogOpen(true)} variant="outline" size="sm" className='hidden md:inline-flex'>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
           )}
          {isHost && group.booking.status === 'none' && (
            <Button onClick={() => setBookingDialogOpen(true)} variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Book Now
            </Button>
          )}
          {group.booking.status === 'booked' && !isHost && (
            <Button onClick={() => setSplitPaymentDialogOpen(true)} className="bg-accent text-accent-foreground hover:bg-accent/90" size="sm">
              <Wallet className="mr-2 h-4 w-4" />
              Split
            </Button>
          )}
        </div>
      </header>
      <MessageList messages={group.messages} currentUser={currentUser} users={users} />
      <div className="p-4 border-t bg-card/80 backdrop-blur-sm">
        <ChatInput groupId={group.id} />
      </div>

      <BookingDialog group={group} open={bookingDialogOpen} onOpenChange={setBookingDialogOpen} />
      <SplitPaymentDialog group={group} open={splitPaymentDialogOpen} onOpenChange={setSplitPaymentDialogOpen} />
      <AddMemberDialog group={group} open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen} users={users} />
      <GroupInfoSheet 
        group={group} 
        open={groupInfoSheetOpen} 
        onOpenChange={setGroupInfoSheetOpen} 
        currentUser={currentUser}
        members={groupMembers}
        onAddMemberClick={() => setAddMemberDialogOpen(true)}
      />
      <AiAssistantSheet
        group={group}
        open={aiAssistantSheetOpen}
        onOpenChange={setAiAssistantSheetOpen}
      />
    </div>
  );
}

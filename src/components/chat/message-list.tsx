'use client';

import * as React from 'react';
import { Message, User } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './message-bubble';

export function MessageList({ messages, currentUser, users }: { messages: Message[], currentUser: User, users: User[] }) {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const scrollViewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (scrollViewport) {
      setTimeout(() => {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }, 100);
    }
  }, [messages.length]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 sm:p-6 space-y-6">
          {messages.map((message) => (
              <MessageBubble key={message.id} message={message} currentUser={currentUser} users={users} />
          ))}
      </div>
    </ScrollArea>
  );
}

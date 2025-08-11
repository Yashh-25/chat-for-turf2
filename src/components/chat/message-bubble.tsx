'use client';

import * as React from 'react';
import { Message, User } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User as UserIcon, ShieldAlert } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from 'date-fns';

export function MessageBubble({ message, currentUser, users }: { message: Message, currentUser: User, users: User[] }) {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const author = React.useMemo(() => {
    if (message.authorId === 'system' || message.authorId === 'ai') {
      return null;
    }
    return users.find(user => user.id === message.authorId) || null;
  }, [message.authorId, users]);

  const isCurrentUser = author?.id === currentUser.id;

  const getAvatar = () => {
    if (message.type === 'ai') {
      return (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      );
    }
    return (
      <Avatar className="h-8 w-8">
        <AvatarImage src={author?.avatar} alt={author?.name} data-ai-hint="person avatar" />
        <AvatarFallback>
          {author ? author.name.charAt(0).toUpperCase() : <UserIcon />}
        </AvatarFallback>
      </Avatar>
    );
  };
  
  if (message.type === 'system') {
    return (
        <div className="text-center text-xs text-muted-foreground my-4 flex items-center gap-2 justify-center animate-in fade-in-50 duration-300">
            <ShieldAlert className="h-4 w-4" />
            <span>{message.text}</span>
        </div>
    )
  }

  return (
    <div className={cn('flex items-start gap-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-300', isCurrentUser ? 'justify-end' : 'justify-start')}>
      {!isCurrentUser && getAvatar()}
      <div className={cn('flex flex-col gap-1', isCurrentUser ? 'items-end' : 'items-start')}>
        <div className={cn(
            'max-w-xs md:max-w-md lg:max-w-lg rounded-2xl p-3 text-sm shadow-md',
            isCurrentUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground border rounded-bl-none',
            message.type === 'ai' && 'bg-indigo-100 dark:bg-indigo-900/30 text-foreground border border-primary/20'
          )}>
            {!isCurrentUser && author && <p className="font-semibold text-primary mb-1">{author.name}</p>}
            {message.type === 'ai' && <p className="font-semibold text-primary mb-1 flex items-center gap-1"><Bot className="h-4 w-4" /> AI Assistant</p>}
            <p className="whitespace-pre-wrap">{message.text}</p>
        </div>
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground px-1 h-4">{isClient ? format(new Date(message.timestamp), 'p') : ''}</p>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{format(new Date(message.timestamp), 'PPpp')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
      {isCurrentUser && getAvatar()}
    </div>
  );
}

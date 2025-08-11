'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { turfBookingAssistant } from '@/lib/actions';
import { Group } from '@/types';
import { Bot, User } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const initialState: { messages: Message[] } = {
  messages: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Thinking...' : 'Ask'}
    </Button>
  );
}

export function AiAssistantSheet({ group, open, onOpenChange }: { 
    group: Group; 
    open: boolean; 
    onOpenChange: (open: boolean) => void;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);
  
  const assistantAction = async (prevState: any, formData: FormData) => {
    const question = formData.get('question') as string;
    if (!question) return { messages: prevState.messages };

    const userMessage: Message = { role: 'user', text: question };
    
    // Immediately show user's question
    const newMessages: Message[] = [...prevState.messages, userMessage];

    const aiResponse = await turfBookingAssistant({
        question,
        booking: group.booking.status !== 'none' ? group.booking : undefined
    });
    
    const assistantMessage: Message = { role: 'assistant', text: aiResponse.answer };

    return {
        messages: [...newMessages, assistantMessage]
    };
  };

  const [state, formAction] = useActionState(assistantAction, initialState);
  
  React.useEffect(() => {
    if (open) {
      // Reset state when sheet opens
      React.startTransition(() => {
        (formAction as (payload: FormData) => void)(new FormData());
      });
    }
  }, [open, formAction]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            AI Booking Assistant
          </SheetTitle>
          <SheetDescription>
            Ask me anything about turf bookings, availability, or pricing.
            I have context of this group's current booking if available.
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-1 -mx-6">
            <div className="px-6 space-y-6 py-4">
                {state.messages.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-12">
                        <p>No conversation yet.</p>
                        <p>Ask a question to get started!</p>
                    </div>
                )}
                {state.messages.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-3", msg.role === 'user' ? 'justify-end' : 'start')}>
                        {msg.role === 'assistant' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    <Bot className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            'max-w-xs rounded-2xl p-3 text-sm shadow-sm',
                            msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card text-card-foreground border rounded-bl-none',
                        )}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        {msg.role === 'user' && (
                             <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    <User className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
        <SheetFooter className="pt-4">
            <form
                ref={formRef}
                action={(formData) => {
                    formAction(formData);
                    formRef.current?.reset();
                }}
                className="w-full space-y-2"
            >
                <Input name="question" placeholder="e.g., What's the cost per person?" required autoComplete="off" />
                <SubmitButton />
            </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

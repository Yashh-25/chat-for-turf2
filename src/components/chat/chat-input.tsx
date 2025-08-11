'use client';

import * as React from 'react';
import { sendMessageAction } from '@/lib/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
      {pending ? <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin" /> : <Send className="h-5 w-5" />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

export function ChatInput({ groupId }: { groupId: string }) {
    const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
          const text = formData.get('message') as string;
          if (text.trim()) {
              formRef.current?.reset();
              await sendMessageAction(groupId, text);
          }
      }}
      className="flex items-center gap-2"
    >
      <Input name="message" placeholder="Type a message or use @ai to ask a question..." autoComplete="off" className="flex-1" />
      <SubmitButton />
    </form>
  );
}

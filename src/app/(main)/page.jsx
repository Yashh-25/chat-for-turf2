import { MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-gray-100/50 dark:bg-black/10">
      <div className="text-center p-4">
          <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold text-foreground">Welcome to Turf Talk</h2>
          <p className="mt-2 text-muted-foreground">Select a group to start chatting or create a new one.</p>
      </div>
    </div>
  );
}

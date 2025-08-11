'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { addMembersToGroupAction, getUsersAction } from '@/lib/actions';
import { useFormStatus } from 'react-dom';
import { Group, User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Members'}
    </Button>
  );
}

export function AddMemberDialog({ group, open, onOpenChange, users }: { group: Group; open: boolean; onOpenChange: (open: boolean) => void, users: User[] }) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [allUsers, setAllUsers] = React.useState<User[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      getUsersAction().then(setAllUsers);
      setSearchQuery('');
    }
  }, [open]);

  const potentialMembers = allUsers
    .filter((user) => !group.members.includes(user.id))
    .filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const handleAction = async (formData: FormData) => {
    const memberIds = formData.getAll('memberIds') as string[];
    if (memberIds.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No members selected',
        description: 'Please select at least one member to add.',
      });
      return;
    }
    
    await addMembersToGroupAction(group.id, formData);
    formRef.current?.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Members to {group.name}</DialogTitle>
          <DialogDescription>
            Select users to add to this group.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <form ref={formRef} action={handleAction}>
            <ScrollArea className="max-h-64 pr-4">
                <div className="space-y-4 py-2">
                    {potentialMembers.length > 0 ? (
                        potentialMembers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-3 rounded-md p-2 hover:bg-muted/50">
                                <Checkbox id={`member-${user.id}`} name="memberIds" value={user.id} />
                                <Label htmlFor={`member-${user.id}`} className="flex-1 cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person avatar" />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                    </div>
                                </Label>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-8">
                            {searchQuery ? "No users found." : "No new users to add."}
                        </p>
                    )}
                </div>
            </ScrollArea>
          <DialogFooter className="pt-6">
            <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import * as React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, X } from 'lucide-react';
import { Group, User } from '@/types';
import { removeMemberFromGroupAction } from '@/lib/actions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function GroupInfoSheet({ group, open, onOpenChange, currentUser, members, onAddMemberClick }: { 
    group: Group; 
    open: boolean; 
    onOpenChange: (open: boolean) => void;
    currentUser: User;
    members: User[];
    onAddMemberClick: () => void;
}) {
    const isHost = group.hostId === currentUser.id;

    const handleRemoveMember = async (memberId: string) => {
        await removeMemberFromGroupAction(group.id, memberId);
    }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-sm flex flex-col">
        <SheetHeader className="text-center items-center pt-8">
            <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20 text-4xl">
                    <Users className="h-12 w-12" />
                </AvatarFallback>
            </Avatar>
          <SheetTitle className="text-2xl">{group.name}</SheetTitle>
          <SheetDescription>
            {members.length} member{members.length > 1 ? 's' : ''}
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 flex-1">
            {isHost && (
                <Button variant="outline" className="w-full mb-4" onClick={() => {
                    onOpenChange(false);
                    onAddMemberClick();
                }}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Members
                </Button>
            )}

            <h3 className="text-sm font-semibold text-muted-foreground mb-2 px-1">Members</h3>
            <ul className="space-y-1">
                {members.map(member => (
                    <li key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 group">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person avatar" />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{member.name} {member.id === currentUser.id && "(You)"}</p>
                                {member.id === group.hostId && (
                                    <p className="text-xs text-primary">Admin</p>
                                )}
                            </div>
                        </div>
                        {isHost && member.id !== group.hostId && (
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                        <X className="h-4 w-4 text-destructive" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will remove {member.name} from the group. This action cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleRemoveMember(member.id)} className="bg-destructive hover:bg-destructive/90">
                                        Remove
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </li>
                ))}
            </ul>
        </div>
      </SheetContent>
    </Sheet>
  );
}

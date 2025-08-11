'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function SplitPaymentDialog({ group, open, onOpenChange }) {
  if (group.booking.status !== 'booked' || !group.booking.cost) {
    return null;
  }
  
  const totalMembers = group.members.length;
  const individualShare = group.booking.cost / totalMembers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Split Payment</DialogTitle>
          <DialogDescription>
            Pay your share to the host.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Cost:</span>
                <span className="font-semibold">{group.booking.cost}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Number of Members:</span>
                <span className="font-semibold">{totalMembers}</span>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Your Share</p>
                <p className="text-3xl font-bold text-primary">{individualShare.toFixed(2)}</p>
            </div>
            <div className="text-center">
                <p className="text-sm text-muted-foreground">Host's Mock Payment ID:</p>
                <p className="font-mono bg-muted p-2 rounded-md text-sm">{group.hostPaymentId}</p>
            </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

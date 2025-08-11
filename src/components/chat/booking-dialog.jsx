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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bookTurfAction } from '@/lib/actions';
import { useFormStatus } from 'react-dom';
import * as React from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Booking...' : 'Confirm Booking'}
    </Button>
  );
}

export function BookingDialog({ group, open, onOpenChange }) {
  const formRef = React.useRef(null);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book a Turf</DialogTitle>
          <DialogDescription>
            Enter the booking details. This will be shared with the group.
          </DialogDescription>
        </DialogHeader>
        <form
          ref={formRef}
          action={async (formData) => {
            await bookTurfAction(group.id, formData);
            formRef.current?.reset();
            onOpenChange(false);
          }}
          className="space-y-4 pt-4"
        >
          <div>
            <Label htmlFor="turfName">Turf Name</Label>
            <Input id="turfName" name="turfName" type="text" placeholder="e.g., City Arena" required />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" type="text" placeholder="e.g., Gandhinagar" required />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="text" placeholder="e.g., Saturday, 25th Dec" required />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input id="time" name="time" type="text" placeholder="e.g., 5:00 PM" required />
          </div>
          <div>
            <Label htmlFor="cost">Total Cost</Label>
            <Input id="cost" name="cost" type="number" placeholder="e.g., 3000" required />
          </div>
          <DialogFooter className="pt-4">
             <Button variant="ghost" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

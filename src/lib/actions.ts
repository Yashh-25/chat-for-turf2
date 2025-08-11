'use server';

import { revalidatePath } from 'next/cache';
import { addMessageToGroup, createGroup as createGroupData, updateBooking as updateBookingData, getGroupById, getUserById, addMembersToGroup as addMembersToGroupData, getUsers as getUsersData, removeMemberFromGroup } from '@/lib/data';
import { Group, Message, User } from '@/types';
import { turfBookingAssistant as turfBookingAssistantFlow } from '@/ai/flows/turf-booking-assistant';

export async function sendMessageAction(groupId: string, text: string) {
  // Post user's message
  const userMessage: Message = {
    id: `msg-${Date.now()}`,
    authorId: 'user-1', // Assuming the current user is always 'user-1'
    text,
    timestamp: Date.now(),
    type: 'user',
  };
  await addMessageToGroup(groupId, userMessage);
  
  if (text.startsWith('@ai')) {
    const question = text.replace('@ai', '').trim();
    if (question) {
      // Get group details to pass to the AI
      const group = await getGroupById(groupId);
      if (group) {
        const aiResponse = await turfBookingAssistantFlow({
          question,
          booking: group.booking.status !== 'none' ? group.booking : undefined
        });
        await sendAiMessageAction(groupId, aiResponse.answer);
      }
    }
  }
  revalidatePath(`/chat/${groupId}`);
}

export async function sendSystemMessageAction(groupId: string, text: string) {
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    authorId: 'system',
    text,
    timestamp: Date.now(),
    type: 'system',
  };
  addMessageToGroup(groupId, newMessage);
  revalidatePath(`/chat/${groupId}`);
}

export async function sendAiMessageAction(groupId: string, text: string) {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      authorId: 'ai',
      text,
      timestamp: Date.now(),
      type: 'ai',
    };
    addMessageToGroup(groupId, newMessage);
    revalidatePath(`/chat/${groupId}`);
}


export async function bookTurfAction(groupId: string, formData: FormData) {
    const cost = Number(formData.get('cost'));
    const date = String(formData.get('date'));
    const time = String(formData.get('time'));
    const turfName = String(formData.get('turfName'));
    const location = String(formData.get('location'));

    const booking: Group['booking'] = {
        status: 'booked',
        cost,
        bookedBy: 'user-1',
        date,
        time,
        turfName,
        location
    };
    updateBookingData(groupId, booking);
    const currentUser = await getUserByIdAction('user-1');
    await sendSystemMessageAction(groupId, `Turf booked by ${currentUser?.name} for ${date} at ${time}. Total cost: ${cost}.`);

    revalidatePath(`/chat/${groupId}`);
    revalidatePath(`/`);
}

export async function createGroupAction(formData: FormData) {
    const name = formData.get('name') as string;
    if (name) {
        createGroupData(name, 'user-1'); // Assuming 'user-1' is the host
        revalidatePath('/');
    }
}

export async function addMembersToGroupAction(groupId: string, formData: FormData) {
  const memberIds = formData.getAll('memberIds') as string[];
  if (memberIds.length > 0) {
    await addMembersToGroupData(groupId, memberIds);
    
    const users = await Promise.all(memberIds.map(id => getUserById(id)));
    const userNames = users.map(u => u?.name).filter(Boolean).join(', ');
    await sendSystemMessageAction(groupId, `Added ${userNames} to the group.`);

    revalidatePath(`/chat/${groupId}`);
    revalidatePath('/');
  }
}

export async function removeMemberFromGroupAction(groupId: string, memberId: string) {
    const user = await getUserById(memberId);
    await removeMemberFromGroup(groupId, memberId);
    if (user) {
      await sendSystemMessageAction(groupId, `Removed ${user.name} from the group.`);
    }
    revalidatePath(`/chat/${groupId}`);
    revalidatePath('/');
}


export async function getGroupByIdAction(groupId: string): Promise<Group | null> {
    return getGroupById(groupId);
}

export async function getUserByIdAction(userId: string): Promise<User | null> {
    return getUserById(userId);
}

export async function getUsersAction(): Promise<User[]> {
    return getUsersData();
}


export async function turfBookingAssistant(input: { question: string, booking?: Group['booking'] }) {
    return await turfBookingAssistantFlow(input);
}

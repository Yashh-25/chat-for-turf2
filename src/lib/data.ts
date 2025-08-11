import { Group, User, Message } from '@/types';
import { getDb } from './db';

// Seed the database with some mock data if it's empty
async function seedDatabase() {
    const db = await getDb();
    const usersCollection = db.collection('users');
    const groupsCollection = db.collection('groups');

    const userCount = await usersCollection.countDocuments();
    if (userCount === 0) {
        console.log('Seeding users...');
        await usersCollection.insertMany([
            { id: 'user-1', name: 'You', avatar: 'https://placehold.co/100x100.png' },
            { id: 'user-2', name: 'Jane Doe', avatar: 'https://placehold.co/100x100.png' },
            { id: 'user-3', name: 'Sam Wilson', avatar: 'https://placehold.co/100x100.png' },
            { id: 'user-4', name: 'Elena Garcia', avatar: 'https://placehold.co/100x100.png' },
            { id: 'user-5', name: 'Alex Ray', avatar: 'https://placehold.co/100x100.png' },
            { id: 'user-6', name: 'Mia Wong', avatar: 'https://placehold.co/100x100.png' },
        ]);
    }

    const groupCount = await groupsCollection.countDocuments();
    if (groupCount === 0) {
        console.log('Seeding groups...');
        await groupsCollection.insertMany([
          {
            id: 'group-1',
            name: 'Weekend Warriors',
            hostId: 'user-1',
            members: ['user-1', 'user-2', 'user-3'],
            hostPaymentId: 'pay-host-12345',
            booking: {
              status: 'booked',
              cost: 4000,
              bookedBy: 'user-1',
              date: 'Sunday, 29th Dec',
              time: '7:00 PM',
              turfName: 'City Arena',
              location: 'Gandhinagar',
            },
            messages: [
              { id: 'msg-1', authorId: 'user-2', text: 'Hey everyone! Ready for this weekend?', timestamp: 1722421824000, type: 'user' },
              { id: 'msg-2', authorId: 'user-1', text: 'Absolutely! I have booked the turf.', timestamp: 1722421884000, type: 'user' },
              { id: 'msg-3', authorId: 'system', text: 'Turf booked by You for Sunday, 29th Dec at 7:00 PM. Total cost: 4000.', timestamp: 1722421944000, type: 'system' },
              { id: 'msg-4', authorId: 'user-3', text: 'Great! What is the per-person cost?', timestamp: 1722422004000, type: 'user' },
              { id: 'msg-5', authorId: 'ai', text: 'The cost per person is 1333.33.', timestamp: 1722422064000, type: 'ai' },
            ],
          },
          {
            id: 'group-2',
            name: '5-a-side Pros',
            hostId: 'user-4',
            members: ['user-1', 'user-4'],
            hostPaymentId: 'pay-host-67890',
            booking: {
              status: 'booked',
              cost: 3000,
              bookedBy: 'user-4',
              date: 'Saturday, 28th Dec',
              time: '5:00 PM',
              turfName: 'Pro Soccer Land',
              location: 'Ahmedabad'
            },
            messages: [
              { id: 'msg-6', authorId: 'system', text: 'Turf is booked for this Saturday at 5 PM! Total cost is 3000.', timestamp: 1722421224000, type: 'system' },
              { id: 'msg-7', authorId: 'user-1', text: 'Awesome!', timestamp: 1722421284000, type: 'user' },
            ],
          },
          {
            id: 'group-3',
            name: 'Night Owls FC',
            hostId: 'user-2',
            members: ['user-1', 'user-2'],
            hostPaymentId: 'pay-host-abcde',
            booking: {
              status: 'none',
            },
            messages: [
               { id: 'msg-9', authorId: 'user-2', text: 'Anyone up for a late night game tomorrow?', timestamp: 1722420624000, type: 'user' },
            ],
          },
        ]);
    }
}

seedDatabase().catch(console.error);

export async function getUsers(): Promise<User[]> {
    const db = await getDb();
    const users = await db.collection('users').find({}).toArray();
    return JSON.parse(JSON.stringify(users));
}

export async function getGroupsForUser(userId: string): Promise<Group[]> {
    const db = await getDb();
    const groups = await db.collection('groups').find({ members: userId }).toArray();
    return JSON.parse(JSON.stringify(groups));
};

export async function getGroupById(groupId: string): Promise<Group | null> {
    const db = await getDb();
    const group = await db.collection<Omit<Group, 'id'>>('groups').findOne({ id: groupId });
    if (!group) return null;
    return JSON.parse(JSON.stringify(group));
};

export async function getUserById(userId: string): Promise<User | null> {
    const db = await getDb();
    const user = await db.collection<Omit<User, 'id'>>('users').findOne({ id: userId });
    if (!user) return null;
    return JSON.parse(JSON.stringify(user));
};

export async function addMessageToGroup(groupId: string, message: Message) {
    const db = await getDb();
    await db.collection('groups').updateOne({ id: groupId }, { $push: { messages: message } });
};

export async function updateBooking(groupId: string, booking: Group['booking']) {
    const db = await getDb();
    await db.collection('groups').updateOne({ id: groupId }, { $set: { booking: booking } });
};

export async function createGroup(name: string, hostId: string) {
    const db = await getDb();
    const newGroup: Omit<Group, '_id'> = {
        id: `group-${Date.now()}`,
        name,
        hostId,
        members: [hostId],
        messages: [{ id: 'msg-init', authorId: 'system', text: `Group "${name}" created.`, timestamp: Date.now(), type: 'system' }],
        booking: { status: 'none' },
        hostPaymentId: `pay-host-${Math.random().toString(36).substring(2, 9)}`,
    };
    await db.collection('groups').insertOne(newGroup as any);
    return newGroup as Group;
};

export async function addMembersToGroup(groupId: string, memberIds: string[]) {
    const db = await getDb();
    await db.collection('groups').updateOne({ id: groupId }, { $addToSet: { members: { $each: memberIds } } });
}

export async function removeMemberFromGroup(groupId: string, memberId: string) {
    const db = await getDb();
    await db.collection('groups').updateOne({ id: groupId }, { $pull: { members: memberId } });
}

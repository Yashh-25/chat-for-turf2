import { type ObjectId } from "mongodb";

export interface User {
  _id?: string;
  id: string;
  name: string;
  avatar: string;
}

export interface Message {
  id: string;
  authorId: string;
  text: string;
  timestamp: number;
  type: 'user' | 'ai' | 'system';
}

export interface Booking {
  status: 'none' | 'pending' | 'booked';
  cost?: number;
  bookedBy?: string; // userId
  date?: string;
  time?: string;
  turfName?: string;
  location?: string;
}

export interface Group {
  _id?: string;
  id: string;
  name: string;
  hostId: string;
  members: string[]; // array of user IDs
  messages: Message[];
  booking: Booking;
  hostPaymentId?: string;
}

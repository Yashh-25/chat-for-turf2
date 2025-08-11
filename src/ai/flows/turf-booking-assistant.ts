'use server';

/**
 * @fileOverview An AI assistant that answers questions about turf bookings.
 *
 * - turfBookingAssistant - A function that answers questions about turf bookings.
 * - TurfBookingAssistantInput - The input type for the turfBookingAssistant function.
 * - TurfBookingAssistantOutput - The return type for the turfBookingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { Booking } from '@/types';

const TurfBookingAssistantInputSchema = z.object({
  question: z.string().describe('The question about turf booking.'),
  booking: z.optional(z.object({
    status: z.enum(['none', 'pending', 'booked']),
    cost: z.optional(z.number()),
    bookedBy: z.optional(z.string()),
    date: z.optional(z.string()),
    time: z.optional(z.string()),
    turfName: z.optional(z.string()),
    location: z.optional(z.string()),
  })).describe('The current booking details for the group.'),
});
export type TurfBookingAssistantInput = z.infer<typeof TurfBookingAssistantInputSchema>;

const TurfBookingAssistantOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about turf booking.'),
});
export type TurfBookingAssistantOutput = z.infer<typeof TurfBookingAssistantOutputSchema>;

export async function turfBookingAssistant(input: TurfBookingAssistantInput): Promise<TurfBookingAssistantOutput> {
  return turfBookingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'turfBookingAssistantPrompt',
  input: {schema: TurfBookingAssistantInputSchema},
  output: {schema: TurfBookingAssistantOutputSchema},
  prompt: `You are an AI assistant that answers questions about turf bookings.

  You have access to information about turf availability, pricing, and booking procedures.
  
  {{#if booking}}
  The user is in a group that has a turf booked. Here are the details:
  - Status: {{booking.status}}
  {{#if booking.turfName}}- Turf Name: {{booking.turfName}}{{/if}}
  {{#if booking.location}}- Location: {{booking.location}}{{/if}}
  {{#if booking.date}}- Date: {{booking.date}}{{/if}}
  {{#if booking.time}}- Time: {{booking.time}}{{/if}}
  {{#if booking.cost}}- Cost: {{booking.cost}}{{/if}}
  Use this information to answer the user's question. If the user asks a question about "this turf" or "the booking", use the information provided above.
  {{/if}}

  Answer the following question:

  {{question}}`,
});

const turfBookingAssistantFlow = ai.defineFlow(
  {
    name: 'turfBookingAssistantFlow',
    inputSchema: TurfBookingAssistantInputSchema,
    outputSchema: TurfBookingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
